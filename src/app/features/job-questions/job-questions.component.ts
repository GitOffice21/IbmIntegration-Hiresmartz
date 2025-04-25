
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonService } from '../../core/Services/common.service';
import { LoaderComponent } from '../loader/loader.component';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-questions',
  standalone: true,
  imports: [MatIconModule,NgIf,NgFor,LoaderComponent,CommonModule],
  templateUrl: './job-questions.component.html',
  styleUrl: './job-questions.component.scss'
})

export class JobQuestionsComponent {
  competencyQuestionsExpanded = true;
  openEndedQuestionsExpanded = false;
  passFallQuestionsExpanded = false;
  loading :boolean=false;
  // isHistoryRoute: boolean = false;

  AllQuestData:Array<any>=[];

  competencyQuestions: any = {};
  openEndedQuestions: any= {};
  passFallQuestions: any = {};
jd_id!:any
  constructor(private router: Router,   private commonService: CommonService,private activatedRoute:ActivatedRoute,private sanitizer:DomSanitizer) {
    const navigation = this.router.getCurrentNavigation();
    
      if(navigation!==null)
      {

        const questions: any = navigation.extras.state?.['questions'] || null;

        if(questions!==null)
      {
       
        if(navigation.extras.state && Object.keys(navigation.extras.state['questions']).length>0) {
          const questions: any = navigation.extras.state['questions'];
        
          
          this.competencyQuestions = questions.competency_questions
            ?.split('\n')
            .filter((q: string) => q.trim() !== '').map((item:string)=> this.cleanQuestionNumbers(item));;
            
          this.openEndedQuestions = questions.openended_questions
            ?.split('\n')
            .filter((q: string) => q.trim() !== '').map((item:string)=> this.cleanQuestionNumbers(item));;
            
          this.passFallQuestions = questions.passfail_questions
            ?.split('\n')
            .filter((q: string) => q.trim() !== '').map((item:string)=> this.cleanQuestionNumbers(item));;
        }
  

      }

 
      else
      {
        this.competencyQuestions={};
        this.passFallQuestions={};
        this.openEndedQuestions={};
      }
      

    }
  
 
  }


  canUpload():boolean
  {
    if(this.router.url.includes('/history/job-questions')){
      return false;
    }

    return true
  }

 ngOnInit(){
  this.jd_id= this.activatedRoute.snapshot.paramMap.get('id');

  this.commonService.UpdateQuestionsList.subscribe((Questions:any)=>
  {
    
    if(Questions!==null && Object.keys(Questions).length>0)
    {

      const questions = Questions
      this.competencyQuestions = questions.competency_questions.split('\n').filter((q: string) => q.trim() !== '').map((item:string)=> this.cleanQuestionNumbers(item));
      this.openEndedQuestions = questions.openended_questions.split('\n').filter((q: string) => q.trim() !== '').map((item:string)=> this.cleanQuestionNumbers(item));;
      this.passFallQuestions = questions.passfail_questions.split('\n').filter((q: string) => q.trim() !== '').map((item:string)=> this.cleanQuestionNumbers(item));;
      
    }

    else if(Object.keys(Questions).length<=0 && Questions!==null)
    {
      this.competencyQuestions={};
      this.passFallQuestions={};
      this.openEndedQuestions={};
    }
    
  

   
  })

 if(!this.jd_id){
 }
 }
  toggleSection(section: string): void {
    switch(section) {
      case 'competency':
        this.competencyQuestionsExpanded = !this.competencyQuestionsExpanded;
        break;
      case 'openEnded':
        this.openEndedQuestionsExpanded = !this.openEndedQuestionsExpanded;
        break;
      case 'passFall':
        this.passFallQuestionsExpanded = !this.passFallQuestionsExpanded;
        break;
    }
  }

  cleanQuestionNumbers(input: string): string {
    return input
      .split('\n')
      .map(line => line.trim().replace(/^\d+\.\s*/, '')) 
      .filter(line => line.length > 0) 
      .join('\n');
  }
  

 
  userId: string = 'ca2';


  errorMessage: string | null = null;

  uploadCV(file: FormData): void {
    this.loading = true;

    
    this.commonService.uploadCV(this.userId, this.jd_id, file).subscribe(
      (response) => {
    
        
        this.commonService.setUploadedCVData(response);
        this.loading = false;
  
        Swal.fire({
          icon: 'success',
          title: response.message,
      
          confirmButtonColor: '#F58220'
        }).then(() => { 
          this.loading = true; 
      
            let navigationExtras: NavigationExtras = {
              queryParams: { jd_id: this.jd_id, resume_id: response.resume_ids }
            };
            this.router.navigate(['/list_resume'], navigationExtras).then(() => {
              this.loading = false; 
            });

        
        });
      },
      (error:any) => {
        this.loading = false;
     
        const errorMessage = error?.error?.detail || 'The uploaded PDF does not contain readable text.';

  
        Swal.fire({
          icon: 'error',
          title: errorMessage,
        
          confirmButtonColor: '#d33'
        }).then(() => { 
          this.loading = false; 
        });
      }
    );
  }
  
  isData():boolean
  {
    return (Object.keys(this.competencyQuestions).length || Object.keys(this.passFallQuestions).length || Object.keys(this.openEndedQuestions).length) ? true : false
  }

  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files;
      this.convertFilesToBinary(file);
    }
  }

  convertFilesToBinary(files: FileList): void {
    const formData = new FormData();
    formData.append('jd_id', this.jd_id);
    Array.from(files).forEach(file => {
      formData.append('files', file, file.name);
    });
  
    this.uploadCV(formData);
  }
}
