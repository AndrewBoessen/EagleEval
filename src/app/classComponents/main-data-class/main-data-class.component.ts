import { Component, OnInit } from '@angular/core';
import {
  ClassService,
  CoursePageData,
} from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-main-data-class',
  templateUrl: './main-data-class.component.html',
  styleUrls: ['./main-data-class.component.css'],
})
export class MainDataClassComponent implements OnInit {
  classOvl: number | undefined = 0;
  strokeColor: string = '#6d1f22';

  attendanceNecessary: number | undefined = undefined;
  challenging: number | undefined = undefined;
  wellOrganized: number | undefined = undefined;
  helpfulAssignments: number | undefined = undefined;

  constructor(private classservice: ClassService) {}

  ngOnInit() {
    this.classservice
      .getCoursePageData()
      .subscribe((data: CoursePageData | null) => {
        this.classOvl = data?.avgOverall || undefined;
        this.attendanceNecessary = data?.avgAttendance || undefined;
        this.challenging = data?.avgChallanging || undefined;
        this.wellOrganized = data?.avgOriganized || undefined;
        this.helpfulAssignments = data?.avgAssignments || undefined;
      });
  }
}
