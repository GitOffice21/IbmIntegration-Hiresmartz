import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobQuestionsComponent } from './job-questions.component';

describe('JobQuestionsComponent', () => {
  let component: JobQuestionsComponent;
  let fixture: ComponentFixture<JobQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
