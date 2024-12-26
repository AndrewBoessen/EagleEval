import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorPageEntryComponent } from './professor-page-entry/professor-page-entry.component';
import { ClassrPageEntryComponent } from './class-page-entry/class-page-entry.component';
import { HomePageComponent } from './HomePageComponets/home-page/home-page.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { PrivacyComponent } from './privacy/privacy.component';

const routes: Routes = [
  { path: 'professor/:profId', component: ProfessorPageEntryComponent },
  { path: 'class/:classId', component: ClassrPageEntryComponent },
  { path: 'profile', component: UserprofileComponent },
  { path: 'privacy', component: PrivacyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const routingComponents = [
  HomePageComponent,
  ProfessorPageEntryComponent,
  ClassrPageEntryComponent,
  UserprofileComponent,
  PrivacyComponent,
];
