import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import {
  ProfileService,
  ProfileData,
  Comment,
} from '../PageDataService/profile.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
})
export class UserprofileComponent {
  user_email: string | undefined = undefined;
  user_name: string | undefined = undefined;
  comments: Comment[] | undefined = undefined;

  constructor(
    private confirmationService: ConfirmationService,
    private profile: ProfileService
  ) {}

  ngOnInit() {
    this.profile.getProfilePageData().subscribe((data: ProfileData | null) => {
      this.user_email = data?.email || undefined;
      this.user_name = data?.name || undefined;
    });

    this.profile.getComments().subscribe((data: Comment[] | null) => {
      this.comments = data || undefined;
    });
  }

  removeAccount() {
    this.confirmationService.confirm({
      message:
        'Deleting account will remove all reviews and data associated with your student email',
      header: 'Are you sure you wish to proceed?',
      icon: 'pi pi-exclamation-triangle',
    });
  }

  removeReview() {
    this.confirmationService.confirm({
      message: 'Deleting a review is an irreversible action',
      header: 'Are you sure you wish to proceed?',
      icon: 'pi pi-exclamation-triangle',
    });
  }
}
