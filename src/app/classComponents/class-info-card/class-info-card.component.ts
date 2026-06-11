import { Component, OnInit, Input } from '@angular/core';
import {
  ClassService,
  CoursePageData,
} from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-class-info-card',
  templateUrl: './class-info-card.component.html',
  styleUrls: ['./class-info-card.component.css'],
})
export class ClassInfoCardComponent implements OnInit {
  constructor(private classservice: ClassService) { }

  @Input() courseName: string | undefined = undefined;
  @Input() courseCode: string | undefined = undefined;
  @Input() hoursWeek: number | undefined = undefined;
  @Input() description: string | undefined = undefined;

  ngOnInit() {

    const coreFields = [this.courseName, this.courseCode, this.hoursWeek, this.description];

    if (coreFields.some(field => !field)) {
      this.classservice
        .getCoursePageData()
        .subscribe((data: CoursePageData | null) => {
          this.courseName = data?.title || undefined;
          this.courseCode = data?.crs_code || undefined;
          this.hoursWeek = data?.avgEffortHours || undefined;
          this.description = data?.desc || undefined;
        });
    }
  }
}
