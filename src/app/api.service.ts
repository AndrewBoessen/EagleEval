import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getSearchResults(query: string, url: string) {
    // Add safe, URL encoded search parameter if there is a search term
    const options = query
      ? { params: new HttpParams().set('name', query) }
      : {};

    // Send the POST request using the HttpClient's post method
    return this.http.get<any>(url, options);
  }

  getSearchById(id: string, url: string) {
    const options = id ? { params: new HttpParams().set('id', id) } : {};

    return this.http.get<any>(url, options);
  }

  deleteProfile(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }

  getUserData(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  deleteComment(id: string, url: string): Observable<any> {
    return this.http.delete<any>(`${url}/${id}`);
  }

  createComment(commentData: any, url: string): Observable<any> {
    return this.http.post<any>(url, commentData);
  }
}
