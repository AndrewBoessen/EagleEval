import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css'],
})
export class HeroSectionComponent {

  @Output() toggleDialogParameter = new EventEmitter<void>();

  triggerToggleCallback() {
    this.toggleDialogParameter.emit();
  }


}
