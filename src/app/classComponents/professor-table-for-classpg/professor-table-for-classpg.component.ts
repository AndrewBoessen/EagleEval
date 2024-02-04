import { Component, OnInit } from '@angular/core';
import {
  ClassService,
  ProfTableData,


} from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-professor-table-for-classpg',
  templateUrl: './professor-table-for-classpg.component.html',
  styleUrls: ['./professor-table-for-classpg.component.css']
})
export class ProfessorTableForClasspgComponent implements OnInit{

  strokeColor: string = '#6d1f22';

  profArray: ProfTableData [] | undefined = undefined;

  halfLength: number = 0;


  constructor(
    private classservice: ClassService) {}


    ngOnInit() {
      this.classservice.getprofTableData().subscribe((data: ProfTableData[] | null) => {
        this.profArray = data || undefined;

          if (this.profArray) {
            this.halfLength = Math.ceil(this.profArray.length / 2);
          }
  
         });


    }


    getEncodedProfileImage(imageUrl: string | undefined): string {
      if (imageUrl) {
        return encodeURI(decodeURI(imageUrl));
      }
      return "/assets/profileImage.jpeg";
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
     



}
