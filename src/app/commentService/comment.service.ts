import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from '../appSettings';

const API_ENDPOINT = AppSettings.API_ENDPOINT;

interface Comment {
  user_id?: string;
  message: string;
  wouldTakeAgain?: boolean;
  professor_id: string;
  course_id?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private api: ApiService) {}

  private reviewStatusSubject = new Subject<string>();
  reviewStatus$: Observable<string> = this.reviewStatusSubject.asObservable();

  createComment(commentData: Comment): void {
    const url = API_ENDPOINT + 'comments/prof';
    this.api.createComment(commentData, url).subscribe({
      next: (v) => this.reviewStatusSubject.next('processing'),
      error: (e) => this.reviewStatusSubject.next('error'),
      complete: () => this.reviewStatusSubject.next('success'),
    });
  }

  deleteComment(id: string): void {
    const url = API_ENDPOINT + 'comments/prof';
    this.api.deleteComment(id, url).subscribe({
      next: (v) => this.reviewStatusSubject.next('processing'),
      error: (e) => this.reviewStatusSubject.next('error'),
      complete: () => this.reviewStatusSubject.next('success'),
    });
  }
}
