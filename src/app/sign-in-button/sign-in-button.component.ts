import { Component } from '@angular/core';
import { CollectDataService } from '../collect-data/collect-data.service';
import {
  ProfileService,
  ProfileData,
} from '../PageDataService/profile.service';
import { PageServiceService } from '../page-service.service';

@Component({
  selector: 'app-sign-in-button',
  templateUrl: './sign-in-button.component.html',
  styleUrls: ['./sign-in-button.component.css'],
})
export class SignInButtonComponent {
  status: string = 'Sign In';
  redirectUrl: string = '/auth/google';

  constructor(
    private data: CollectDataService,
    private profile: ProfileService,
    public _pageService: PageServiceService
  ) {}
  ngOnInit() {
    this.profile.setProfilePageData(null);

    this.data.getProfilePageData();

    this.profile.getProfilePageData().subscribe((data: ProfileData | null) => {
      if (data) {
        this.status = 'Profile';
        this.redirectUrl = '/#/profile';
      } else {
        this.status = 'Sign In';
        this.redirectUrl = '/auth/google';
      }
    });
  }
}
