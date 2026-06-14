import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteStatsPageComponent } from './site-stats-page.component';

describe('SiteStatsPageComponent', () => {
  let component: SiteStatsPageComponent;
  let fixture: ComponentFixture<SiteStatsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteStatsPageComponent]
    });
    fixture = TestBed.createComponent(SiteStatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
