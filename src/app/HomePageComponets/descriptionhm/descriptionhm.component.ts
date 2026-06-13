import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-descriptionhm',
  templateUrl: './descriptionhm.component.html',
  styleUrls: ['./descriptionhm.component.css'],
})
export class DescriptionhmComponent {
  inputValue: string = '';

  countReviews: number | undefined = 32614;
  countCourses: number | undefined = 5271;
  countProfs: number | undefined = 3828;

}
