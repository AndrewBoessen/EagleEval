import { Component, OnInit } from '@angular/core';
import {
  ClassService,
  ProfTableData

} from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-professor-table-for-classpg',
  templateUrl: './professor-table-for-classpg.component.html',
  styleUrls: ['./professor-table-for-classpg.component.css']
})
export class ProfessorTableForClasspgComponent implements OnInit{

  classScoreForProfOvl: number | undefined = 50;
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
      return "";
    }
     





}
