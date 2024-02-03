import { Component, OnInit } from '@angular/core';
import {
  ProfessorService,
  ProfPageData,
  CourseTableData,
  Comment
} from 'src/app/PageDataService/professor.service';

@Component({
  selector: 'app-class-data-prof',
  templateUrl: './class-data-prof.component.html',
  styleUrls: ['./class-data-prof.component.css']
})
export class ClassDataProfComponent implements OnInit {

  strokeColor: string = '#6d1f22';
  profName: string | undefined = undefined;
  comments: { [course: string]: Comment[] } | undefined = undefined;

  professorCourses: CourseTableData[] | undefined = undefined;
  firstHalfCourses: CourseTableData[] = [];
  secondHalfCourses: CourseTableData[] = [];



  constructor(private prof: ProfessorService) {}


  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      this.comments = data?.comments || undefined;

      this.profName = data?.name || undefined;
      if (this.profName){
         this.profName = this.profName + "'s Class Statistics";

      }
     
    });


    this.prof.getcrsTableData().subscribe((data: CourseTableData[] | null) => {
      this.professorCourses = data || undefined;

      if (this.professorCourses) {
        const halfLength = Math.ceil(this.professorCourses.length / 2);
        
        // Slice the array into two halves
        this.firstHalfCourses = this.professorCourses.slice(0, halfLength);
        this.secondHalfCourses = this.professorCourses.slice(halfLength);
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




}
