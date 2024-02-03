import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ProfessorService,
  ProfPageData,
} from 'src/app/PageDataService/professor.service';
import { CollectDataService } from '../collect-data/collect-data.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-professor-page-entry',
  templateUrl: './professor-page-entry.component.html',
  styleUrls: ['./professor-page-entry.component.css'],
})
export class ProfessorPageEntryComponent {
  //Professor image will now load in with this component
  professorImgURL: string = '';

  constructor(
    private professorService: ProfessorService,
    private route: ActivatedRoute,
    private data: CollectDataService
  ) {}
  ngOnInit() {
    // Set prof data to null
    this.professorService.setProfPageData(null);

    // First get the product id from the current route.
    this.route.paramMap.subscribe((routeParams) => {
      // Set prof data to null
      this.professorService.setProfPageData(null);
      this.professorService.setcrsTableData(null);

      const id = String(routeParams.get('profId'));

      // Populate prof data
      this.data.getProfPageData(id);
    });

    this.professorService
      .getProfPageData()
      .subscribe((data: ProfPageData | null) => {
        if (data) {
          if (data.profileImage) {
            this.professorImgURL = encodeURI(decodeURI(data.profileImage));
          }
        }
      });
  }
}
