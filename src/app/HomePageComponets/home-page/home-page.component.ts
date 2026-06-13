import { Component, OnInit, HostListener } from '@angular/core'; // 1. Added OnInit here

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {

  visible: boolean = false;


  ngOnInit(): void {
    const hasSeenFarewell = localStorage.getItem('eagleEvalFarewellClosed');

    if (!hasSeenFarewell) {
      this.visible = true;
    }
  }

  onDialogClose(): void {
    localStorage.setItem('eagleEvalFarewellClosed', 'true');
    this.visible = false;
  }

  showDialog() {
    this.visible = true;
  }
}

