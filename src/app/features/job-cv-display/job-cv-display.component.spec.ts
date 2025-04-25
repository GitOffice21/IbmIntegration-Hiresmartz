import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCVDisplayComponent } from './job-cv-display.component';

describe('JobCVDisplayComponent', () => {
  let component: JobCVDisplayComponent;
  let fixture: ComponentFixture<JobCVDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCVDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCVDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
