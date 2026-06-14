import { Component, OnInit, Input } from '@angular/core';
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
  @Input() professorName: string | undefined = undefined;
  @Input() professorTitle: string[] | undefined = undefined;
  @Input() office: string | undefined = undefined;
  @Input() phone: string | undefined = undefined;
  @Input() email: string | undefined = undefined;
  @Input() education: string[] | undefined = undefined;


  constructor(private prof: ProfessorService) { }

  ngOnInit() {

    const coreFields = [this.professorName, this.office, this.phone, this.email, this.education];

    if (coreFields.some(field => !field)) {
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
}
