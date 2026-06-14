import { Component, OnInit, Input } from '@angular/core';
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
  @Input() classOvl: number | undefined = 0;
  strokeColor: string = '#6d1f22';

  @Input() attendanceNecessary: number | undefined = undefined;
  @Input() challenging: number | undefined = undefined;
  @Input() wellOrganized: number | undefined = undefined;
  @Input() helpfulAssignments: number | undefined = undefined;

  constructor(private classservice: ClassService) { }

  ngOnInit() {

    const coreFields = [this.classOvl, this.attendanceNecessary, this.challenging, this.wellOrganized, this.helpfulAssignments];

    if (coreFields.some(field => !field)) {
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
}
