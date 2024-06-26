import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  ProfileService,
  ProfileData,
  Comment,
} from '../PageDataService/profile.service';
import { CommentService } from '../commentService/comment.service';
import { AppSettings } from '../appSettings';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

const AUTH_ENDPOINT = AppSettings.AUTH_ENDPOINT;

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
})
export class UserprofileComponent {
  user_email: string | undefined = undefined;
  user_name: string | undefined = undefined;
  comments: Comment[] | undefined = undefined;
  halfLength: number = 0;

  constructor(
    private router: Router,
    private api: ApiService,
    private comment: CommentService,
    private confirmationService: ConfirmationService,
    private profile: ProfileService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.profile.getProfilePageData().subscribe((data: ProfileData | null) => {
      this.user_email = data?.email || undefined;
      this.user_name = data?.name || undefined;
    });

    this.profile.getComments().subscribe((data: Comment[] | null) => {
      this.comments = data || undefined;
      if (this.comments) {
        this.halfLength = Math.ceil(this.comments.length / 2);
      }
    });
  }

  formatTimestamp(inputTimestamp: Date): string {
    const dateObject = new Date(inputTimestamp);

    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObject.toLocaleDateString('en-US', options);

    const day = dateObject.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
        ? 'nd'
        : day === 3 || day === 23
        ? 'rd'
        : 'th';

    return `${formattedDate.replace(/(\d)([^\d])$/, `$1${suffix}$2`)}`;
  }

  removeAccount() {
    this.confirmationService.confirm({
      message:
        'Deleting account will remove all reviews and data associated with your student email',
      header: 'Are you sure you wish to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProfile();
        this.logout();
      },
    });
  }

  removeReview(id: string) {
    this.confirmationService.confirm({
      message: 'Deleting a review is an irreversible action',
      header: 'Are you sure you wish to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteComment(id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Review removed',
        });
      },
    });
  }

  private deleteComment(id: string) {
    // remove commment from array
    if (this.comments) {
      this.profile.setComments(
        this.comments.filter((comment: Comment) => comment._id != id)
      );
    }

    this.comment.deleteComment(id);
  }

  private deleteProfile() {
    const delete_url = AUTH_ENDPOINT + 'profile';

    this.api.deleteProfile(delete_url).subscribe((response) => {
      console.log(response);
    });
  }

  logout() {
    const logout_url = AUTH_ENDPOINT + 'logout';

    this.api.logout(logout_url).subscribe({
      complete: () => {
        this.router.navigate(['/']);
      },
    });
  }
}
