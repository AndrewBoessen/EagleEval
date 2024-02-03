import { Component, OnInit } from '@angular/core';
import {
  ProfessorService,
  ProfPageData,
  CourseTableData
} from 'src/app/PageDataService/professor.service';

@Component({
  selector: 'app-class-data-prof',
  templateUrl: './class-data-prof.component.html',
  styleUrls: ['./class-data-prof.component.css']
})
export class ClassDataProfComponent implements OnInit {

  courseOvl: number | undefined = 0;
  strokeColor: string = '#6d1f22';
  profName: string | undefined = undefined;

  professorCourses: CourseTableData[] | undefined = undefined;

  constructor(private prof: ProfessorService) {}


  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      this.profName = data?.name || undefined;
      if (this.profName){
         this.profName = this.profName + "'s Class Statistics";

      }
     
    });


    this.prof.getcrsTableData().subscribe((data: CourseTableData[] | null) => {
      this.professorCourses = data || undefined;

    });
  }




}
