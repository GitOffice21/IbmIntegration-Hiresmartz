

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { NgForOf, NgIf } from '@angular/common';
import { CommonService } from '../../core/Services/common.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
interface JobDetails {
  job_title: string;
  location: string;
  type: string;
  overview: string;
  responsibilities: string[];
  qualifications: string[];
  niceToHave: string[];
  benefits: string[];
}

interface JobRequestPayload {
  user_id: string;
  job_title: string;
  experience: number;
  education_preference: string;
  communication_skills: string;
  mandatory_skills: string;
  optional_skills: string;
}

interface JobResponse {
  message: string;
  jd_id: string;
  job_description: string;
}

@Component({
  standalone: true,
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss'],
  imports: [NgForOf,LoaderComponent,NgIf]
})
export class JobDescriptionComponent implements OnInit {

  showButton: boolean = true;
  jobDetails: JobDetails = {
    job_title: '',
    location: '',  // Default value
    type: '',   // Default value
    overview: '',
    responsibilities: [],
    qualifications: [],
    niceToHave: [],
    benefits: []
  };
  sections:any=[];
  loading : boolean =  false;
  isHistoryRoute: boolean = false;
  error = '';
  jd_id!:any;
  jobData!:any;
  jobdetails!:any;
  currentJobTitle!:any;
  currentJobDesc!:any;
  constructor(private http: HttpClient,private service:CommonService,private router:Router,private cookieservice:CookieService) {
    this.router.events.subscribe(() => {
      this.isHistoryRoute = this.router.url.includes('/history');
    });
  
    this.jobData = this.router.getCurrentNavigation()?.extras?.state?.['data'];
  }

  ngOnInit(): void {

   this.service.jobDetailsSubject.subscribe({
      next:(data)=>{
        this.jobdetails=data;
        this.displaydetails(this.jobdetails);
        
      }
    });
    this.service.jobDesc.subscribe({
      next:(data:any)=>{
        this.currentJobDesc=data;
      }
    })
    this.service.jobTitle.subscribe({
      next:(data:any)=>{
        this.currentJobTitle=data;
      }
    })
    this.service.jdid.subscribe({
      next:(id:any)=>{
        this.jd_id=id;
      }
    })

    // If not navigating from form, fetch job details as usual
    if(this.jobData && !this.currentJobDesc && !this.currentJobTitle ){

      
      this.fetchJobDetails();
    }
    else{

      this.parseJobDescription(this.currentJobDesc, this.currentJobTitle);
      if (this.currentJobTitle && this.currentJobTitle.trim() !== '') {
        this.jobDetails.job_title = this.currentJobTitle;
      } else {
        // Fallback to extracting from the response
        const titleMatch = this.currentJobDesc.match(/# ([^\n]+)/);
        if (titleMatch) {
          this.jobDetails.job_title = titleMatch[1].trim();
        }
      }
    }

  }
  fetchJobDetails(): void {
    this.loading = true;

    const payload: JobRequestPayload = this.jobData
    const headers = new HttpHeaders({
      Authorization : `Bearer ${this.cookieservice.get('token')}`
    })
  this.http.post<JobResponse>(`${environment.apiUrl}/job_description/create_jd`, payload,{headers})
  .subscribe({
    next: (response) => {
    
        this.parseJobDescription(response.job_description, payload.job_title);
        this.service.setjobDesc(response.job_description);
        this.service.setjobTitle(payload.job_title);
        this.loading=false
      
      
      this.jd_id = response.jd_id;
      this.service.setJdId(response.jd_id);
     
      if (payload.job_title && payload.job_title.trim() !== '') {
        this.jobDetails.job_title = payload.job_title;
      } else {
        // Fallback to extracting from the response
        const titleMatch = response.job_description.match(/# ([^\n]+)/);
        if (titleMatch) {
          this.jobDetails.job_title = titleMatch[1].trim();
        }
      }
      
      this.loading = false;
      Swal.fire({
        icon: 'success',
        title: 'Job Description Generated',
        text: 'Job description fetched successfully!',
   
        showConfirmButton: true,
          confirmButtonColor: '#F58220'
      });
    },
    
    error: (err) => {
      this.error = 'Failed to fetch job details';
      this.loading = false;
      console.error('Error fetching job details:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch job details!',
         confirmButtonColor: '#F58220', // Change this to your desired color
  confirmButtonText: 'OK'
      });
    
    }
  });
  }
  
  generateQuestions(): void {
    this.loading = true;
    this.service.generateQuestions(this.jd_id).subscribe(
      (response) => {
        this.router.navigate([`/job-questions/${this.jd_id}`], { state: { questions: response.questions } });
        this.loading=false
        Swal.fire({
          icon: 'success',
          title: response.message,
          // text: response.message ,
          
          showConfirmButton: true,
          confirmButtonColor: '#F58220'
        });
      },
      
      (error) => {
        console.log('Error generating questions:', error);
        this.loading=false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to generate questions!',
          confirmButtonColor:'#F58220'
        });
      
      }
    );
  }

  parseJobDescription(jobDescription: string, jobTitle: string): void {
    // Extract title (unchanged)
    const titleMatch = jobDescription.match(/# ([^\n]+)/);
    this.jobDetails.job_title = titleMatch ? titleMatch[1].trim() : jobTitle;
  
    const sectionRegex = /## (.+?)\n([\s\S]*?)(?=##|$)/g;
    
    const matches = [...jobDescription.matchAll(sectionRegex)];
  
    this.sections = matches.map(match => {
      const rawContent = match[2].trim();
      
      // Process content to separate bullet points
      const formattedContent = rawContent
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          // Standardize bullet points and ensure they are on separate lines
          if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
            line = '\n• ' + line.trim().substring(1).trim();
          } else {
            // Add newline before non-bullet content if it follows a bullet
            line = '\n' + line.trim();
          }
        
          line = line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        
          return line;
        })
        .join('') 
        .trim() 
        .replace(/\n{3,}/g, '\n\n'); 
  
      return {
        title: match[1].trim(),
        content: formattedContent
      };
    });


  }
  
  displaydetails(jobdetails:any){
    
    this.parseJobDescription(jobdetails.job_description,jobdetails.jd_parameters.job_title);
    this.jd_id = jobdetails.jd_id;
      
     
    if (jobdetails.jd_parameters.job_title && jobdetails.jd_parameters.job_title.trim() !== '') {
      this.jobDetails.job_title = jobdetails.jd_parameters.job_title;
    } else {
      // Fallback to extracting from the response
      const titleMatch = jobdetails.job_description.match(/# ([^\n]+)/);
      if (titleMatch) {
        this.jobDetails.job_title = titleMatch[1].trim();
      }
    }
  }
  
}
