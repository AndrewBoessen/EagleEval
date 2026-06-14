import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface StatMetrics {
  Clicks: number;
  Impressions: number;
  CTR: string | number;
  Position: number;
}

@Component({
  selector: 'app-site-stats-page',
  templateUrl: './site-stats-page.component.html',
  styleUrls: ['./site-stats-page.component.css']
})
export class SiteStatsPageComponent implements OnInit {
  // Raw Data storage
  rawHistoryData: any[] = [];
  overallStats: StatMetrics = { Clicks: 0, Impressions: 0, CTR: '0%', Position: 0 };
  queriesData: any[] = [];
  rangeDates: Date[] | undefined;

  // Chart Data
  deviceChartData: any;
  deviceChartOptions: any;

  historyChartData: any;
  historyChartOptions: any;

  countriesChartData: any;
  countriesChartOptions: any;

  // Toggle state for History chart
  historyMetrics = [
    { label: 'Impressions', value: 'Impressions' },
    { label: 'Clicks', value: 'Clicks' },
    { label: 'CTR (%)', value: 'CTR' },
    { label: 'Position', value: 'Position' }
  ];
  selectedHistoryMetric: string = 'Impressions';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.setupChartOptions();
    this.fetchData();
  }

  fetchData() {
    forkJoin({
      overall: this.http.get<any>('../../../assets/stats-data/Overall-Stats.json'),
      devices: this.http.get<any>('../../../assets/stats-data/Devices.json'),
      history: this.http.get<any>('../../../assets/stats-data/Chart.json'),
      countries: this.http.get<any>('../../../assets/stats-data/Countries.json'),
      queries: this.http.get<any>('../../../assets/stats-data/Queries.json'),
    }).subscribe(res => {
      this.processOverallStats(res.overall);
      this.processDevices(res.devices);
      this.rawHistoryData = res.history;
      this.updateHistoryChart();
      this.processCountries(res.countries);
      this.processQueries(res.queries);
    });
  }


  processOverallStats(data: any) {
    const siteKey = Object.keys(data)[0];
    this.overallStats = data[siteKey];
  }

  processDevices(data: any) {
    const labels = Object.keys(data);
    const impressions = labels.map(key => data[key].Impressions);

    this.deviceChartData = {
      labels: labels,
      datasets: [
        {
          data: impressions,
          backgroundColor: ['#c5bfb0', '#5c0d0f', '#6d1f22'],
          hoverBackgroundColor: ['#c5bfb0', '#5c0d0f', '#6d1f22'],
        }
      ]
    };
  }

  clearDateFilter() {
    this.rangeDates = undefined;
    this.updateHistoryChart();
  }

updateHistoryChart() {
    if (!this.rawHistoryData.length) return;

    let filteredData = this.rawHistoryData;

    if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
      const startDate = this.rangeDates[0].getTime();
      const endDate = this.rangeDates[1].getTime();

      filteredData = this.rawHistoryData.filter(item => {
        const safeDateString = item.Date.replace(/-/g, '/');
        const itemDate = new Date(safeDateString).getTime();
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    const labels = filteredData.map(item => {
      const safeDateString = item.Date.replace(/-/g, '/');
      const dateObj = new Date(safeDateString);

      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    });

    const dataPoints = filteredData.map(item => {
      let val = item[this.selectedHistoryMetric];
      if (this.selectedHistoryMetric === 'CTR' && typeof val === 'string') {
        return parseFloat(val.replace('%', ''));
      }
      return val;
    });

    this.historyChartData = {
      labels: labels,
      datasets: [
        {
          label: this.selectedHistoryMetric,
          data: dataPoints,
          fill: false,
          borderColor: '#5c0d0f',
          backgroundColor: '#5c0d0f',
          tension: 0.4
        }
      ]
    };

    const isPosition = this.selectedHistoryMetric === 'Position';
    if (this.historyChartOptions && this.historyChartOptions.scales && this.historyChartOptions.scales.y) {
      this.historyChartOptions.scales.y.reverse = isPosition;
    }
  }


  processCountries(data: any) {
    // Convert object to array, calculate total engagement for sorting
    const countriesArray = Object.keys(data).map(key => ({
      country: key,
      ...data[key]
    }));

    // Sort by Impressions (descending) and grab top 10
    countriesArray.sort((a, b) => b.Impressions - a.Impressions);
    const topCountries = countriesArray.slice(0, 10);

    this.countriesChartData = {
      labels: topCountries.map(c => c.country),
      datasets: [
        {
          label: 'Impressions',
          backgroundColor: '#5c0d0f',
          data: topCountries.map(c => c.Impressions)
        },
        {
          label: 'Clicks',
          backgroundColor: '#c5bfb0',
          data: topCountries.map(c => c.Clicks)
        }
      ]
    };
  }

  processQueries(data: any) {
    // Map object to array for p-table
    this.queriesData = Object.keys(data).map(key => {
      const item = data[key];
      return {
        query: key,
        clicks: item.Clicks,
        impressions: item.Impressions,
        ctr: parseFloat(item.CTR.replace('%', '')), // parsed for sorting
        position: item.Position
      };
    });
  }

  setupChartOptions() {
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    };

    this.deviceChartOptions = { ...commonOptions };

    this.historyChartOptions = {
      ...commonOptions,
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 10,
            maxRotation: 45,
          }
        },
        y: { reverse: false }
      }
    };

    this.countriesChartOptions = {
      ...commonOptions,
      indexAxis: 'y',
      scales: {
        x: { stacked: false },
        y: { stacked: false }
      }
    };
  }


}
