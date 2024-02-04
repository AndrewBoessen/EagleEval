import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import {
  ProfessorService,
  CourseTableData,
  ProfPageData,
} from '../PageDataService/professor.service';
import { ProfileService } from '../PageDataService/profile.service';
import { CommentService } from '../commentService/comment.service';

interface Comment {
  user_id?: string;
  message: string;
  wouldTakeAgain?: boolean;
  professor_id: string;
  course_id?: string | null;
}

interface Class {
  name: string;
  id: string | null;
}

@Component({
  selector: 'app-add-review-button',
  templateUrl: './add-review-button.component.html',
  styleUrls: ['./add-review-button.component.css'],
})
export class AddReviewButtonComponent implements OnInit {
  visible: boolean = false;
  profName: string | undefined = undefined;

  stateOptions: any[] = [
    { label: 'No', value: false },
    { label: 'Yes', value: true },
  ];

  classes: Class[] | undefined = undefined;

  selectedClass: Class | undefined = undefined;
  message: string | undefined = undefined;
  wouldRecommend: boolean | undefined = undefined;
  user_id: string | undefined = undefined;
  prof_id: string | undefined = undefined;

  constructor(
    private prof: ProfessorService,
    private user: ProfileService,
    private comment: CommentService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.user_id = undefined;
    this.message = undefined;
    this.prof_id = undefined;
    this.message = undefined;
    this.selectedClass = undefined;
    this.wouldRecommend = undefined;

    this.classes = [{ name: 'Other', id: null }];

    this.user.getProfilePageData().subscribe((user: any | null) => {
      this.user_id = user?._id;
    });

    this.prof.getProfPageData().subscribe((prof_data: ProfPageData | null) => {
      this.prof_id = prof_data?.id;
      this.profName = prof_data?.name;
    });

    this.prof
      .getcrsTableData()
      .subscribe((table_data: CourseTableData[] | null) => {
        if (table_data) {
          this.classes = table_data
            .map(
              (course: CourseTableData) =>
                <Class>{
                  name: course.crs_code,
                  id: course.id,
                }
            )
            .concat([{ name: 'Other', id: null }]);
        } else {
          this.classes = [{ name: 'Other', id: null }];
        }
      });
  }

  //logic for display
  showDialog() {
    this.visible = true;
  }

  submitReview() {
    if (
      this.user_id &&
      this.selectedClass &&
      this.wouldRecommend != undefined &&
      this.message &&
      this.prof_id
    ) {
      const new_comment: Comment = {
        user_id: this.user_id,
        course_id: this.selectedClass.id || null,
        message: this.message,
        professor_id: this.prof_id,
        wouldTakeAgain: this.wouldRecommend,
      };

      this.comment.createComment(new_comment);
      this.visible = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Your review has been added',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ensure you are logged in and all data fields are complete',
      });

      console.error('DATA NOT COMPELTE');
    }
  }
}
