import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataReviewsComponent } from './no-data-reviews.component';

describe('NoDataReviewsComponent', () => {
  let component: NoDataReviewsComponent;
  let fixture: ComponentFixture<NoDataReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoDataReviewsComponent]
    });
    fixture = TestBed.createComponent(NoDataReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
