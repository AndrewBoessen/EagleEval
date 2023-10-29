import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ProfPageData {
  title: string;
  education?: string[];
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  avgOverall?: number;
  avgPrepared?: number;
  avgExplains?: number;
  avgAvailable?: number;
  avgEnthusiastic?: number;
}

export interface CourseTableData {
  title: string;
  crs_code: string;
  course_overall: number;
  effort_hours: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  constructor() {
    this._prof_data = new BehaviorSubject<ProfPageData | null>(null);
    this._table_data = new BehaviorSubject<CourseTableData[] | null>(null);
  }

  // Define variables
  private _prof_data: BehaviorSubject<ProfPageData | null>;
  private _table_data: BehaviorSubject<CourseTableData[] | null>;

  // Prof data setters and getters
  get ProfPageData(): Observable<ProfPageData | null> {
    return this._prof_data.asObservable();
  }

  set ProfPageData(data: ProfPageData | null) {
    this._prof_data.next(data);
  }

  // Course table setters and getters
  get crsTableData(): Observable<CourseTableData[] | null> {
    return this._table_data.asObservable();
  }

  set crsTableData(data: CourseTableData[] | null) {
    this._table_data.next(data);
  }
}
