import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockProfessorComponent } from './mock-professor.component';

describe('MockProfessorComponent', () => {
  let component: MockProfessorComponent;
  let fixture: ComponentFixture<MockProfessorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockProfessorComponent]
    });
    fixture = TestBed.createComponent(MockProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
