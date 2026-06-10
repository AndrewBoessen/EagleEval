import { Component, OnInit, Input } from '@angular/core';
import {
  ProfessorService,
  ProfPageData,
} from 'src/app/PageDataService/professor.service';

@Component({
  selector: 'app-main-data-card',
  templateUrl: './main-data-card.component.html',
  styleUrls: ['./main-data-card.component.css'],
})
export class MainDataCardComponent implements OnInit {

  strokeColor: string = '#6d1f22';
  @Input() professorOvl: number | undefined = NaN;
  @Input() instructorPrepared: number | undefined = undefined;
  @Input() clearMaterial: number | undefined = undefined;
  @Input() outsideClass: number | undefined = undefined;
  @Input() enthusiastic: number | undefined = undefined;

  constructor(private prof: ProfessorService) { }

  ngOnInit() {

    const coreFields = [this.professorOvl, this.instructorPrepared, this.clearMaterial, this.outsideClass, this.enthusiastic];

    if (coreFields.some(field => !field)) {
      this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
        this.professorOvl = data?.avgOverall || undefined;
        this.instructorPrepared = data?.avgPrepared || undefined;
        this.clearMaterial = data?.avgExplains || undefined;
        this.outsideClass = data?.avgAvailable || undefined;
        this.enthusiastic = data?.avgEnthusiastic || undefined;
      });
    }
  }
}
