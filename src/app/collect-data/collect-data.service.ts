import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { AppSettings } from '../appSettings';

import {
  ProfPageData,
  CourseTableData,
  ProfessorService,
} from '../PageDataService/professor.service';
import {
  CoursePageData,
  ProfTableData,
  ClassService,
} from '../PageDataService/class.service';
import { ProfileService } from '../PageDataService/profile.service';

const API_ENDPOINT = AppSettings.API_ENDPOINT;
const AUTH_ENDPOINT = AppSettings.AUTH_ENDPOINT;

interface ProfData {
  _id: string;
  name: string;
  __v: number;
  education?: string[];
  phone?: string;
  title?: string[];
  email?: string;
  office?: string;
  photoLink?: string;
}

interface CourseData {
  _id: string;
  code: string;
  __v: number;
  college: string;
  description: string;
  subject: string;
  title: string;
}

interface ReviewData {
  _id: string;
  code: string;
  prof: string;
  semester: string;
  __v: number;
  course_id?: string;
  course_overall?: number;
  instructor_overall?: number;
  professor_id?: string;
  section: number;
}

interface DrilldownData {
  _id: string;
  __v: number;
  review_id: string;
  coursewellorganized?: number;
  courseintellectuallychallenging?: number;
  effortavghoursweekly?: number;
  attendancenecessary?: number;
  assignmentshelpful?: number;
  instructorprepared?: number;
  instructorclearexplanations?: number;
  availableforhelpoutsideofclass?: number;
  stimulatedinterestinthesubjectmatter?: number;
}

interface Comment {
  _id: string;
  __v: number;
  user_id?: string;
  message: string;
  createdAt: Date;
  wouldTakeAgain?: boolean;
  professor_id: string;
  course_id?: string;
}

interface ProfileData {
  _id: string;
  __v: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class CollectDataService {
  constructor(
    private api: ApiService,
    private prof: ProfessorService,
    private course: ClassService,
    private profile: ProfileService
  ) {}

  /**
   * Converts a value to a percentage based on a specific formula.
   * @param value - The numeric value to be converted.
   * @returns The converted percentage value.
   */
  private convertToPercent(value: number) {
    return value > 0 ? value * 20 : 0;
  }

  /**
   * Calculates the average value for a specific field in an array of objects.
   * @param data - The array of objects containing the field.
   * @param fieldName - The field name for which the average is calculated.
   * @returns The calculated average value.
   */
  private calculateAverage<T, K extends keyof T>(data: T[], fieldName: K) {
    if (!data) {
      console.error('DATA undefined: ', data);
      return undefined;
    }
    const filteredData = data.filter(
      (item) => typeof item[fieldName] === 'number'
    );

    if (filteredData.length === 0) {
      return undefined;
    }

    const sum = filteredData.reduce(
      (acc, item) => acc + (item[fieldName] as number),
      0
    );
    const average = sum / filteredData.length;

    return Math.round(this.convertToPercent(average));
  }

  /**
   * Retrieves professor data from the API by ID.
   * @param id - The ID of the professor.
   * @returns An observable containing the professor data.
   */
  private getProfData(id: string): Observable<ProfData> {
    const url = API_ENDPOINT + 'fetch/database/prof';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrieves course data from the API by ID.
   * @param id - The ID of the course.
   * @returns An observable containing the course data.
   */
  getCourseData(id: string): Observable<CourseData> {
    const url = API_ENDPOINT + 'fetch/database/course';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrieves reviews for a professor from the API by ID.
   * @param id - The ID of the professor.
   * @returns An observable containing the reviews for the professor.
   */
  private getReviewsForProf(id: string): Observable<ReviewData[]> {
    const url = API_ENDPOINT + 'fetch/database/review/prof';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrieves reviews for a course from the API by ID.
   * @param id - The ID of the course.
   * @returns An observable containing the reviews for the course.
   */
  private getReviewsForCourse(id: string): Observable<ReviewData[]> {
    const url = API_ENDPOINT + 'fetch/database/review/course';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrieves drilldown data from the API by ID.
   * @param id - The ID of the drilldown data.
   * @returns An observable containing the drilldown data.
   */
  private getDrilldown(id: string): Observable<DrilldownData[]> {
    const url = API_ENDPOINT + 'fetch/database/drilldown';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrives user comments for professor by ID.
   * @param id - The ID of the professor
   * @returns An observable containing the comment data.
   */
  private getProfComments(id: string): Observable<Comment[]> {
    const url = API_ENDPOINT + 'comments/prof';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrives profile data for user
   * @returns An observable containing profile data
   */
  private getProfileData(): Observable<ProfileData> {
    const url = AUTH_ENDPOINT + 'profile';
    return this.api.getUserData(url);
  }

  /**
   * Retrives all reviews written by logged in user
   * @returns An observable containing comments
   */
  private getUsersComments(): Observable<Comment[]> {
    const url = AUTH_ENDPOINT + 'comments';
    return this.api.getUserData(url);
  }

  /**
   * Retrieves professor page data by ID, processes it, and updates the Professor Service.
   * @param id - The ID of the professor.
   */
  getProfPageData(id: string) {
    this.getReviewsForProf(id).subscribe((reviewData: ReviewData[]) => {
      const courseDict: { [id: string]: ReviewData[] } = {};
      let tableData: CourseTableData[] = [];

      let new_prof_page_data: ProfPageData = {
        id: undefined,
        name: undefined,
        education: undefined,
        email: undefined,
        title: undefined,
        office: undefined,
        profileImage: undefined,
        avgOverall: undefined,
        avgPrepared: undefined,
        avgExplains: undefined,
        avgAvailable: undefined,
        avgEnthusiastic: undefined,
        comments: undefined,
      };

      // Collect unique course IDs
      reviewData.forEach((review: ReviewData) => {
        if (review.course_id) {
          const course_id: string = review.course_id;
          if (!courseDict[course_id]) {
            // If the objectId does not exist in the dictionary, create a new entry
            courseDict[course_id] = [review];
          } else {
            // If the objectId already exists, push the new review into the existing array
            courseDict[course_id].push(review);
          }
        }
      });

      // Iterate over unique course IDs and fetch course data
      Object.keys(courseDict).forEach((course_id: string) => {
        this.getCourseData(course_id).subscribe(
          (course_data: CourseData | null) => {
            if (course_data) {
              const avg_overall = this.calculateAverage(
                courseDict[course_id],
                'instructor_overall'
              );

              const new_table_entry: CourseTableData = {
                id: course_data._id,
                title: course_data.title,
                crs_code: course_data.code,
                school: course_data.college,
                subject: course_data.subject,
                description: course_data.description,
                course_overall: avg_overall,
              };

              tableData.push(new_table_entry);

              // Set course table data in prof service
              this.prof.setcrsTableData(tableData);
            }
          }
        );
      });

      // Fill prof page data
      this.getProfData(id).subscribe((prof_data: ProfData) => {
        const new_prof_meta_data: Partial<ProfPageData> = {
          id: prof_data._id,
          name: prof_data.name,
          education: prof_data.education,
          email: prof_data.email,
          phone: prof_data.phone,
          title: prof_data.title,
          office: prof_data.office,
          profileImage: prof_data.photoLink,
        };

        new_prof_page_data = { ...new_prof_page_data, ...new_prof_meta_data };
        this.prof.setProfPageData(new_prof_page_data);
      });

      // Create an array to store all the observables
      const observables: Observable<DrilldownData[]>[] = [];

      // Iterate over reviews to create observables for each getDrilldown call
      reviewData.forEach((review: ReviewData) => {
        const review_id: string = review._id;
        observables.push(this.getDrilldown(review_id));
      });
      // Use forkJoin to combine all observables and subscribe to the result
      forkJoin(observables).subscribe(
        (ddDataArray: DrilldownData[][] | null) => {
          const ddData = ddDataArray?.flat() || [];

          const avg_overall = this.calculateAverage(
            reviewData,
            'instructor_overall'
          );
          const avg_prepared = this.calculateAverage(
            ddData,
            'instructorprepared'
          );
          const avg_explains = this.calculateAverage(
            ddData,
            'instructorclearexplanations'
          );
          const avg_available = this.calculateAverage(
            ddData,
            'availableforhelpoutsideofclass'
          );
          const avg_enthusiastic = this.calculateAverage(
            ddData,
            'stimulatedinterestinthesubjectmatter'
          );

          const new_dd_data: Partial<ProfPageData> = {
            avgOverall: avg_overall,
            avgPrepared: avg_prepared,
            avgExplains: avg_explains,
            avgAvailable: avg_available,
            avgEnthusiastic: avg_enthusiastic,
          };

          new_prof_page_data = { ...new_prof_page_data, ...new_dd_data };
          this.prof.setProfPageData(new_prof_page_data);
        }
      );

      this.getProfComments(id).subscribe((prof_comments: Comment[]) => {
        let commentDict: { [course: string]: Comment[] } = {};
        if (prof_comments) {
          prof_comments.forEach((comment: Comment) => {
            if (comment.course_id) {
              const course_id = comment.course_id;
              if (!commentDict[course_id]) {
                // If the objectId does not exist in the dictionary, create a new entry
                commentDict[course_id] = [comment];
              } else {
                // If the objectId already exists, push the new review into the existing array
                commentDict[course_id].push(comment);
              }
            } else {
              if (!commentDict['general']) {
                commentDict['general'] = [comment];
              } else {
                commentDict['general'].push(comment);
              }
            }
          });
        }
        const new_prof_comments: Partial<ProfPageData> = {
          comments: commentDict,
        };

        new_prof_page_data = { ...new_prof_page_data, ...new_prof_comments };
        this.prof.setProfPageData(new_prof_page_data);
      });
    });
  }

  /**
   * Retrieves course page data by ID, processes it, and updates the Course Service.
   * @param id - The ID of the course.
   */
  getCoursePageData(id: string) {
    this.getReviewsForCourse(id).subscribe((reviewData: ReviewData[]) => {
      const profDict: { [id: string]: ReviewData[] } = {};
      let tableData: ProfTableData[] = [];

      let new_course_page_data: Partial<CoursePageData> = {};

      // Collect prof ids
      reviewData.forEach((review: ReviewData) => {
        if (review.professor_id) {
          const prof_id: string = review.professor_id;
          if (!profDict[prof_id]) {
            // If the objectId does not exist in the dictionary, create a new entry
            profDict[prof_id] = [review];
          } else {
            // If the objectId already exists, push the new review into the existing array
            profDict[prof_id].push(review);
          }
        }
      });

      // Iterate over unique professor IDs and fetch course data
      Object.keys(profDict).forEach((prof_id: string) => {
        this.getProfData(prof_id).subscribe((prof_data: ProfData | null) => {
          if (prof_data) {
            this.getProfComments(prof_data._id).subscribe(
              (prof_comments: Comment[]) => {
                const avg_overall = this.calculateAverage(
                  profDict[prof_id],
                  'course_overall'
                );

                const new_table_entry: ProfTableData = {
                  id: prof_data._id,
                  name: prof_data.name,
                  prof_overall: avg_overall,
                  profile_image: prof_data.photoLink,
                  comments: prof_comments,
                };

                tableData.push(new_table_entry);
                // Set prof table data in course service
                this.course.setprofTableData(tableData);
              }
            );
          }
        });
      });

      // Fill course page data
      this.getCourseData(id).subscribe((course_data: CourseData) => {
        const new_course_meta_data: CoursePageData = {
          title: course_data.title,
          crs_code: course_data.code,
          subject: course_data.subject,
          college: course_data.college,
          desc: course_data.description,
        };

        new_course_page_data = {
          ...new_course_page_data,
          ...new_course_meta_data,
        };
        this.course.setCoursePageData(new_course_page_data as CoursePageData);
      });

      // Create an array to store all the observables
      const observables: Observable<DrilldownData[]>[] = [];

      // Iterate over reviews to create observables for each getDrilldown call
      reviewData.forEach((review: ReviewData) => {
        const review_id: string = review._id;
        observables.push(this.getDrilldown(review_id));
      });

      // Use forkJoin to combine all observables and subscribe to the result
      forkJoin(observables).subscribe(
        (ddDataArray: DrilldownData[][] | null) => {
          const ddData = ddDataArray?.flat() || [];

          const avg_overall = this.calculateAverage(
            reviewData,
            'course_overall'
          );
          const avg_organized = this.calculateAverage(
            ddData,
            'coursewellorganized'
          );
          const avg_challanging = this.calculateAverage(
            ddData,
            'courseintellectuallychallenging'
          );
          const avg_effort = this.calculateAverage(
            ddData,
            'effortavghoursweekly'
          );
          const avg_attendance = this.calculateAverage(
            ddData,
            'attendancenecessary'
          );
          const avg_asssignments = this.calculateAverage(
            ddData,
            'assignmentshelpful'
          );

          const new_dd_data: Partial<CoursePageData> = {
            avgOverall: avg_overall,
            avgOriganized: avg_organized,
            avgChallanging: avg_challanging,
            avgEffortHours:
              avg_effort && avg_effort >= 0
                ? Math.round((avg_effort / 10) * 2) / 2 - 1
                : undefined,
            avgAttendance: avg_attendance,
            avgAssignments: avg_asssignments,
          };

          new_course_page_data = { ...new_course_page_data, ...new_dd_data };

          this.course.setCoursePageData(new_course_page_data as CoursePageData);
        }
      );
    });
  }

  /**
   * Retrieves professor page data by ID, processes it, and updates the Professor Service.
   * @param id - The ID of the professor.
   */
  getProfilePageData() {
    this.getProfileData().subscribe((profile_data) => {
      if (profile_data) {
        this.profile.setProfilePageData(profile_data);
        this.getUsersComments().subscribe((user_comments) => {
          if (user_comments) {
            this.profile.setComments(user_comments);
          }
        });
      }
    });
  }
}
