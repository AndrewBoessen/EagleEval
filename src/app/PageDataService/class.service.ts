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

export interface CoursePageData {
  title: string;
  crs_code: string;
  subject: string;
  college: string;
  desc: string;
  avgOverall?: number;
  avgOriganized?: number;
  avgChallanging?: number;
  avgEffortHours?: number;
  avgAttendance?: number;
  avgAssignments?: number;
}

export interface ProfTableData {
  id: string;
  name: string;
  prof_overall?: number;
  profile_image?: string;
  comments?: Comment[];
}

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  constructor() {
    this._course_data = new BehaviorSubject<CoursePageData | null>(null);
    this._table_data = new BehaviorSubject<ProfTableData[] | null>(null);
  }

  // Define variables
  private _course_data: BehaviorSubject<CoursePageData | null>;
  private _table_data: BehaviorSubject<ProfTableData[] | null>;

  // Prof data setters and getters
  getCoursePageData(): Observable<CoursePageData | null> {
    return this._course_data.asObservable();
  }

  setCoursePageData(data: CoursePageData | null) {
    this._course_data.next(data);
  }

  // Course table setters and getters
  getprofTableData(): Observable<ProfTableData[] | null> {
    return this._table_data.asObservable();
  }

  setprofTableData(data: ProfTableData[] | null) {
    this._table_data.next(data);
  }
}
