import { Component,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ProfessorService } from 'src/app/PageDataService/professor.service';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-professor-page-entry',
  templateUrl: './professor-page-entry.component.html',
  styleUrls: ['./professor-page-entry.component.css']
})
export class ProfessorPageEntryComponent {

  value: number = 50;

 instructorInAnotherClass: string;

  constructor(private professorService: ProfessorService) {
    // Access the instructor property from ProfessorService
    this.instructorInAnotherClass = professorService.instructorName;
  }



}
