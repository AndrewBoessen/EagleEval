import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AppSettings } from 'src/app/appSettings';


@Component({
  selector: 'app-descriptionhm',
  templateUrl: './descriptionhm.component.html',
  styleUrls: ['./descriptionhm.component.css'],
})
export class DescriptionhmComponent {
  inputValue: string = '';

  countReviews: number | undefined = undefined;
  countCourses: number | undefined = undefined;
  countProfs: number | undefined = undefined;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    const reviewUrl = AppSettings.API_ENDPOINT + 'fetch/database/reviews/count';
    const courseUrl = AppSettings.API_ENDPOINT + 'fetch/database/course/count';
    const profUrl = AppSettings.API_ENDPOINT + 'fetch/database/prof/count';

    this.apiService.getCount(reviewUrl).subscribe((data: any | null) => {
      this.countReviews = data?.count || undefined;
    });
    this.apiService.getCount(courseUrl).subscribe((data: any | null) => {
      this.countCourses = data?.count || undefined;
    });
    this.apiService.getCount(profUrl).subscribe((data: any | null) => {
      this.countProfs = data?.count || undefined;
    });
  }


}
