import { Component, OnInit } from '@angular/core';
import {
  ProfessorService,
  ProfPageData,
} from 'src/app/PageDataService/professor.service';

@Component({
  selector: 'app-class-data-prof',
  templateUrl: './class-data-prof.component.html',
  styleUrls: ['./class-data-prof.component.css']
})
export class ClassDataProfComponent implements OnInit {

  courseOvl: number | undefined = NaN;
  strokeColor: string = '#6d1f22';

  constructor(private prof: ProfessorService) {}




}
