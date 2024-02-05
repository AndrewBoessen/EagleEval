import { Component, OnInit } from '@angular/core';
import {
  ProfessorService,
  ProfPageData,
} from 'src/app/PageDataService/professor.service';

@Component({
  selector: 'app-contact-edu',
  templateUrl: './contact-edu.component.html',
  styleUrls: ['./contact-edu.component.css'],
})
export class ContactEDUComponent implements OnInit {
  professorName: string | undefined = undefined;
  professorTitle: string[] | undefined = undefined;
  office: string | undefined = undefined;
  phone: string | undefined = undefined;
  email: string | undefined = undefined;
  education: string[] | undefined = undefined;

  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      this.professorName = data?.name || undefined;
      this.professorTitle = data?.title || undefined;
      this.office = data?.office || undefined;
      this.phone = data?.phone || undefined;
      this.email = data?.email || undefined;
      this.education = data?.education || undefined;
    });
  }
}
