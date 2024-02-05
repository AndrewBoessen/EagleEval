import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataClassComponent } from './no-data-class.component';

describe('NoDataClassComponent', () => {
  let component: NoDataClassComponent;
  let fixture: ComponentFixture<NoDataClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoDataClassComponent]
    });
    fixture = TestBed.createComponent(NoDataClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
