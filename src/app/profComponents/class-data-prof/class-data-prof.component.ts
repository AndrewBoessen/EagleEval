import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import {
  ProfessorService,
  ProfPageData,
  CourseTableData,
  Comment,
} from 'src/app/PageDataService/professor.service';
import { CollectDataService } from '../../collect-data/collect-data.service';
import { convert } from 'html-to-text';

interface CourseData {
  _id: string;
  code: string;
  __v: number;
  college: string;
  description: string;
  subject: string;
  title: string;
}

@Component({
  selector: 'app-class-data-prof',
  templateUrl: './class-data-prof.component.html',
  styleUrls: ['./class-data-prof.component.css'],
})
export class ClassDataProfComponent implements OnInit {
  strokeColor: string = '#6d1f22';
  profName: string | undefined = undefined;
  comments: { [course: string]: Comment[] } | undefined = undefined;
  course_names: { [id: string]: string } = { general: 'General' };

  professorCourses: CourseTableData[] | undefined = undefined;
  halfLength: number = 0;

  constructor(
    private prof: ProfessorService,
    private data: CollectDataService
  ) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      this.comments = data?.comments || undefined;

      this.profName = data?.name || undefined;
      if (this.profName) {
        this.profName = this.profName + "'s Class Statistics";
      }

      if (this.comments) {
        const course_ids = Object.keys(this.comments);

        // Create an array to store all the observables
        const observables: Observable<CourseData>[] = [];

        course_ids.forEach((id: string) => {
          if (id != 'general') {
            observables.push(this.data.getCourseData(id));
          }
        });

        forkJoin(observables).subscribe((courses: CourseData[] | null) => {
          courses?.forEach((course: CourseData) => {
            if (course) {
              this.course_names[
                course._id
              ] = `${course.title} (${course.code})`;
            }
          });
        });
      }
    });

    this.prof.getcrsTableData().subscribe((data: CourseTableData[] | null) => {
      this.professorCourses = data || undefined;

      if (this.professorCourses) {
        this.halfLength = Math.ceil(this.professorCourses.length / 2);
      }
    });
  }

  formatTimestamp(inputTimestamp: Date): string {
    const dateObject = new Date(inputTimestamp);

    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObject.toLocaleDateString('en-US', options);
    const day = dateObject.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
        ? 'nd'
        : day === 3 || day === 23
        ? 'rd'
        : 'th';

    return `${formattedDate.replace(/(\d)([^\d])$/, `$1${suffix}$2`)}`;
  }

  convert(message: string) {
    return convert(message);
  }
}
