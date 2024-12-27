import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from './api.service';
import { PageServiceService } from './page-service.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'frontEnd';
  message: any;
  isHomeBarVisible: boolean = true;

  constructor(
    private apiService: ApiService,
    public _pageService: PageServiceService,
    private router: Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomeBarVisible =
          !/\/professor/.test(event.url) &&
          !/\/class/.test(event.url) &&
          !/\/profile/.test(event.url) &&
          !/\/terms/.test(event.url) &&
          !/\/privacy/.test(event.url);
      }
    });
  }

  ngOnInit() {}
}
