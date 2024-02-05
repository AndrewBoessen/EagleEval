import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataProfessorComponent } from './no-data-professor.component';

describe('NoDataProfessorComponent', () => {
  let component: NoDataProfessorComponent;
  let fixture: ComponentFixture<NoDataProfessorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoDataProfessorComponent]
    });
    fixture = TestBed.createComponent(NoDataProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
