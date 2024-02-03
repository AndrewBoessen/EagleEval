import { Component, OnInit } from '@angular/core';
import {
  ClassService,
  CoursePageData,
} from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-class-info-card',
  templateUrl: './class-info-card.component.html',
  styleUrls: ['./class-info-card.component.css']
})
export class ClassInfoCardComponent implements OnInit{


  constructor(private classservice: ClassService) {}

  courseName: string | undefined = undefined;
  courseCode: string | undefined = undefined;
  hoursWeek: number | undefined = undefined;
  description: string | undefined = undefined;


  ngOnInit() {
    this.classservice.getCoursePageData().subscribe((data: CoursePageData | null) => {
      this.courseName = data?.title || undefined;
      this.courseCode = data?.crs_code || undefined;
      this.hoursWeek = data?.avgEffortHours || undefined;
      this.description = data?.desc || undefined;
   
    });
  }





}
