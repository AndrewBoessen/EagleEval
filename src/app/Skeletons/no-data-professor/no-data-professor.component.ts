import { Component, OnInit } from '@angular/core';

import {
  ProfessorService,
  ProfPageData,
} from 'src/app/PageDataService/professor.service';

@Component({
  selector: 'app-no-data-professor',
  templateUrl: './no-data-professor.component.html',
  styleUrls: ['./no-data-professor.component.css'],
})
export class NoDataProfessorComponent implements OnInit {
  profName: string | undefined = undefined;

  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      this.profName = data?.name || undefined;
    });
  }
}
