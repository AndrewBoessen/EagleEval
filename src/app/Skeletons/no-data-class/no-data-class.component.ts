import { Component, OnInit } from '@angular/core';
import {
  ClassService,
  CoursePageData,
} from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-no-data-class',
  templateUrl: './no-data-class.component.html',
  styleUrls: ['./no-data-class.component.css'],
})
export class NoDataClassComponent implements OnInit {
  courseCode: string | undefined = undefined;

  constructor(private classService: ClassService) {}

  ngOnInit() {
    this.classService
      .getCoursePageData()
      .subscribe((data: CoursePageData | null) => {
        this.courseCode = data?.crs_code || undefined;
      });
  }
}
