import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ClassService,
  CoursePageData,
} from 'src/app/PageDataService/class.service';
import { CollectDataService } from '../collect-data/collect-data.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-class-page-entry',
  templateUrl: './class-page-entry.component.html',
  styleUrls: ['./class-page-entry.component.css'],
})
export class ClassrPageEntryComponent {
  courseCode: string | undefined = undefined;
  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
    private data: CollectDataService
  ) {}
  ngOnInit() {
    // Set prof data to null
    this.classService.setCoursePageData(null);
    this.classService.setprofTableData(null);

    // First get the product id from the current route.
    this.route.paramMap.subscribe((routeParams) => {
      // Set prof data to null
      this.classService.setCoursePageData(null);
      this.classService.setprofTableData(null);

      const id = String(routeParams.get('classId'));

      // Populate prof data
      this.data.getCoursePageData(id);
    });

    this.classService
      .getCoursePageData()
      .subscribe((data: CoursePageData | null) => {
        this.courseCode = data?.crs_code || undefined;
      });
  }
}
