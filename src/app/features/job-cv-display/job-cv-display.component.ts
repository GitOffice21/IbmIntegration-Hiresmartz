
import { Component } from '@angular/core';
import { CommonModuleModule } from '../../core/common-module/common-module.module';
import { CommonService } from '../../core/Services/common.service';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoaderComponent } from '../loader/loader.component';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-job-cv-display',
  standalone: true,
  imports: [CommonModuleModule,NgIf,PdfViewerModule,NgxExtendedPdfViewerModule,LoaderComponent,MatIconModule],
  templateUrl: './job-cv-display.component.html',
  styleUrl: './job-cv-display.component.scss'
})
export class JobCVDisplayComponent {
  score: number = 0;
  explanation: string = '';

  file!:any;
  pdfSrc!:any;

    resumeId: string | null = null;

    jdId: string | null = null;
    loading: boolean = false;
    constructor(private commonService: CommonService,private router:Router,private sanitizer: DomSanitizer, private http: HttpClient,private cookieservice:CookieService
     , private activatedRoute: ActivatedRoute) {
        this.file=this.sanitizer.bypassSecurityTrustResourceUrl(localStorage.getItem('data')||'')
      console.log(this.file);
      if (this.file ) {
        this.pdfSrc=this.file;
 
      }
 
    }
  
    get isJobCVDisplayRoute(): boolean {
      return this.router.url === '/history/jobCV-display';
    }

    showBackButton():boolean
    {
      return this.router.url!=='' && this.router.url=='/history/jobCV-display' ? true : false;
    }
  
    ngOnInit(): void {
      this.loading=true;
      const uploadedCVData = this.commonService.getUploadedCVData();
      if (uploadedCVData) {
        this.resumeId = uploadedCVData.resume_id; // Retrieve the resume_id
      }

      if(history.state)
      {
        this.score = history.state.score.score; 
            this.explanation= history.state.score.explanation;

            const temp_url=this.sanitizer.bypassSecurityTrustResourceUrl(history.state.resume_url||history.state.resume || '')

                this.pdfSrc=temp_url
      }
this.loading=false;
      }
    
    fetchCVScore(): void {
      const headers = new HttpHeaders({
        Authorization : `Bearer ${this.cookieservice.get('token')}`
      })
      this.loading = true;
      const requestBody = {
        resume_id: this.resumeId,
        jd_id: this.jdId
      };
  
      this.http.post('https://hiresmartz.netsmartz.us/api/resume/score_resume', requestBody,{headers})
        .subscribe(
          (response: any) => {
            this.score = response.score; 
            this.explanation= response.explanation;
            this.loading = false;
        
          
          },
          (error) => {
            console.log('Error fetching CV score:', error);
            this.loading = false;
            // Fallback values if API fails
            this.score = 0;
            this.explanation = 'Could not fetch details. Please try again later.';
            Swal.fire({
              icon: 'error',
              title: error.error.detail,
           
              confirmButtonColor: '#d33'
            });
          
          }
        );
    }
  submitnav(){
    this.router.navigate(['/job-form'])
  }

  GoBack()
  {
    this.router.navigate(['/history/list_resume'])
  }
}
