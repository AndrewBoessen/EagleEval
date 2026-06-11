import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
})
export class HeroSectionComponent {

  constructor(private router: Router) {}

  @Output() toggleDialogParameter = new EventEmitter<void>();

  triggerToggleCallback() {
    this.toggleDialogParameter.emit();
  }

  navMockProfessor() {
    this.router.navigate(['/example-professor']);
  }

  navMockClass() {
    this.router.navigate(['/example-class']);
  }

}
