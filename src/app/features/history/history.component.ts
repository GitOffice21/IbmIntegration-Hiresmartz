

import { Component, OnInit} from '@angular/core';
import {  Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgClass, NgFor } from '@angular/common';
import { CommonService } from '../../core/Services/common.service';
import { LoaderComponent } from '../loader/loader.component';
import { Subject, takeUntil } from 'rxjs';

interface ResumeData{
  resume_id:string,
  resume_url:string,
  score:{
    name:string,
    email:string,
    phone:string,
    score:string,
    explanation:string
  }
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [RouterOutlet,
    NgClass,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTabsModule,
    MatListModule,
    MatCardModule,
    MatProgressBarModule,
    NgFor,
    LoaderComponent
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  loading: boolean = false;
  Jd_Questions:any={};
  selectedJdId: string = '';
  activeTabIndex: number = 0;
  selectedjob:any;
  ActivetabIndex:number=0;
  private destroy$ = new Subject<void>();
  ResumeData:Array<ResumeData>=[]
  menuItems = [
    { icon: 'description', label: 'Job Description', route: '/history/job-description' },
    {
      icon: 'question_answer',
      label: 'AI Generated Questions',
      route: `/history/job-questions`,
    },
    { icon: 'credit_score', label: 'CV Listing', route: '/history/list_resume' },
  ];
   jdlist!:any;
  
  constructor(private router:Router,private commonservice:CommonService) { }
  
  ngOnInit() {
    // Initialize with the first job title
    const payload={
    user_id: localStorage.getItem('user_id')
    }

    this.getCvScore();

    this.loading=true;

    this.commonservice.getjoblist(payload).subscribe({
      next:(data:any)=>{
        if(data.jd_list.length)
        {
          this.jdlist=data.jd_list

        this.selectedJdId=this.jdlist[0].jd_id;
        this.selectedjob=this.jdlist[0];

          
        }
      
    
           this.commonservice.setJobDetails(this.selectedjob);  
            
            this.router.navigate(['/history/job-description']);

            this.UpdateIndex(0);
            this.loading=false;
         
      }
    })

    this.commonservice.ResumeUploaded.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        
      if(res.length)
      {
        this.ResumeData=res;
      }
                   
              },
              (err) => {
                console.error(err);
              },
              () => {
               
              }
            );
          }
        
  
  selectJobTitle(job:any): void {
    if(this.selectedJdId!==job.jd_id)
    {
      this.selectedjob=job;
      this.selectedJdId = job.jd_id;
      this.commonservice.setJobDetails(this.selectedjob);

    }
 
  }
  
  getCvScore()
  {
 
    // this.loading=true;

    this.commonservice.jobDetailsSubject.pipe(takeUntil(this.destroy$)).subscribe((selectedjob:any)=>
    {
      if(selectedjob)
      {
        const payload:{jd_id:string}={
          jd_id:this.selectedjob.jd_id
        }
        this.commonservice.getcvscore(payload).subscribe((res:any)=>
        { 
          if(Array.isArray(res.resumes))
          {
  
            
            this.ResumeData=res.resumes;
            this.Jd_Questions=res.questions;

         

            const selectedRoute = this.menuItems[this.ActivetabIndex].route;


       if(selectedRoute.toLocaleLowerCase()=='/history/list_resume')
      {
       
        const data={
          jd_id:this.selectedJdId,
          resume_id:this.ResumeData
        }

        this.router.navigate([selectedRoute], { state: { data } });
        this.commonservice.UpdateResumeList.next(data);
      }

      else if(selectedRoute.toLowerCase()=='/history/job-questions')
      {
        const questions=this.Jd_Questions;
        this.router.navigate([`/history/job-questions/${this.selectedJdId}`], { state: { questions } });
        this.commonservice.UpdateQuestionsList.next(questions!==null ? questions : {});

      }
          }

          else
          {
            this.commonservice.UpdateQuestionsList.next({});
            this.commonservice.UpdateResumeList.next([]);
            this.Jd_Questions={};
            this.ResumeData=[];
          }
        },err=>
      {
             console.error(err);
      },()=>
      {
        
        // this.loading=false;
      })

      }
    })
    
  }



  onTabChange(event: any) {
     
    this.ActivetabIndex=event.index;
    
    const selectedRoute = this.menuItems[this.ActivetabIndex].route;
    if(selectedRoute.toLocaleLowerCase()=='/history/list_resume')
    {
      let resumeData = this.ResumeData; 
      const data={
        jd_id:this.selectedJdId,
        resume_id:resumeData
      }
      this.router.navigate([selectedRoute], { state: { data } });
   
      this.commonservice.UpdateResumeList.next(data);
    }

    else if(selectedRoute.toLowerCase()=='/history/job-questions')
      {

        const questions=this.Jd_Questions;
      
        this.router.navigate([`/history/job-questions/${this.selectedJdId}`], { state: { questions } });

        this.commonservice.UpdateQuestionsList.next(questions);
      }


    else
    {
      this.router.navigate([selectedRoute]);
    }
    // this.commonservice.setJobDetails(this.selectedjob);
  }

  UpdateIndex(index:number)
  {
    if(index)
    {
      this.ActivetabIndex=index;
    }
  }
  goBack() {
    this.router.navigate(['/job-form']); 
  }

  ngOnDestroy()
  {
    this.ActivetabIndex=0;
    this.commonservice.ResumeUploaded.next(null); 

    this.commonservice.UpdateQuestionsList.next(null);
    this.commonservice.UpdateResumeList.next(null);

    // this.commonservice.jobDetailsSubject.complete();
    this.destroy$.next();
    this.destroy$.complete();
    
  }

}