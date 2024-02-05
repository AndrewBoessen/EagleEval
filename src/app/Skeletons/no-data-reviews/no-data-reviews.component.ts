import { Component, OnInit } from '@angular/core';

import {
  ProfessorService,
  ProfPageData,
} from 'src/app/PageDataService/professor.service';


@Component({
  selector: 'app-no-data-reviews',
  templateUrl: './no-data-reviews.component.html',
  styleUrls: ['./no-data-reviews.component.css']
})
export class NoDataReviewsComponent implements OnInit{


  profName: string | undefined = undefined;

  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      this.profName = data?.name || undefined;

    });
  }


}
