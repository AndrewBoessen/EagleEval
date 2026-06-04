import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  constructor(private router: Router) { }

  visible: boolean = true;

  showDialog() {
    this.visible = true;
  }

}
