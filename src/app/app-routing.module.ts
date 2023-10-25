import { NgModule } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';
import {ProfessorPageEntryComponent} from './professor-page-entry/professor-page-entry.component';
import {ClassrPageEntryComponent} from './classr-page-entry/classr-page-entry.component';
import {HomePageComponent} from './home-page/home-page.component';


const routes: Routes = [
{ path: '', component: HomePageComponent},
{ path: 'professor', component: ProfessorPageEntryComponent},
{ path: 'classes', component: ClassrPageEntryComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [HomePageComponent,ProfessorPageEntryComponent,ClassrPageEntryComponent];
