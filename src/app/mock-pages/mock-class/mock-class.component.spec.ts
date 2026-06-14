import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockClassComponent } from './mock-class.component';

describe('MockClassComponent', () => {
  let component: MockClassComponent;
  let fixture: ComponentFixture<MockClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockClassComponent]
    });
    fixture = TestBed.createComponent(MockClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
