import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Comment {
  user_id?: string;
  message: string;
  createdAt: Date;
  wouldTakeAgain?: boolean;
  professor_id: string;
  course_id?: string;
}

export interface ProfileData {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor() {
    this._profile_data = new BehaviorSubject<ProfileData | null>(null);
    this._user_comments = new BehaviorSubject<Comment[] | null>(null);
  }

  private _profile_data: BehaviorSubject<ProfileData | null>;
  private _user_comments: BehaviorSubject<Comment[] | null>;

  // Setters and getters
  getProfilePageData(): Observable<ProfileData | null> {
    return this._profile_data.asObservable();
  }

  setProfilePageData(data: ProfileData | null) {
    this._profile_data.next(data);
  }

  getComments(): Observable<Comment[] | null> {
    return this._user_comments.asObservable();
  }

  setComments(data: Comment[] | null) {
    this._user_comments.next(data);
  }
}
