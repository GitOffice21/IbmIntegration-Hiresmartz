

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from '../loader/loader.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from '../../core/Services/common.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
interface ResumeListing
{
   Name:string,
   Email:string,
   Phone:string,
   Score:string
}

@Component({
  selector: 'app-resume-listing',
  standalone: true,
  imports: [MatTableModule,CommonModule,MatPaginatorModule,MatIconModule,MatTooltipModule,MatSortModule,LoaderComponent,MatProgressSpinnerModule],
  templateUrl: './resume-listing.component.html',
  styleUrl: './resume-listing.component.scss'
})
export class ResumeListingComponent implements OnInit {
  loading :boolean=false;
  ResumeIds:Array<string>=[];
  user_id:string ='';
  jd_id:string='';
  expliicit_loader:boolean=false;
  dataSource:MatTableDataSource<ResumeListing>=new MatTableDataSource<ResumeListing>([]);

  @ViewChild(MatPaginator,{static:false}) paginator!: MatPaginator;
  @ViewChild(MatSort,{static:false})sort!:MatSort;
  private apiQueue = new Subject<any>();

  userId: string = 'ca2';

  displayedColumns:Array<string>=[
    'SNo',
    'CandidateName',
    'Email',
    'PhoneNumber',
    'CVScore',
    'ViewDetails'
  ];

  ColumnMapping:{[Key:string]:string}={
    SNo:'S.No',
    CandidateName:'Candidate Name',
    Email:'Email',
    CVScore:'CV Score',
    PhoneNumber:'Phone Number',
    ViewDetails: 'View Details'
    
  }

  dataMapping:{[key:string]:string}={
    CandidateName:'name',
    Email:'email',
    PhoneNumber:'phone',
    CVScore:'score'


  }

constructor(private cokkie:CookieService,private commonser:CommonService,private activatedRoute:ActivatedRoute,private router:Router){}

  GetResumeData()
  {

  }
  get isListResumeRoute(): boolean {
    return this.router.url.startsWith('/list_resume');
  }
  
  async ngOnInit()
  {
  
    this.commonser.UpdateResumeList.subscribe((res:any)=>
      {

      

        if(res)
        {
          this.jd_id=res.jd_id;
          if(res!==undefined && res.resume_id.length>0)
            {
              this.dataSource.data = [...res.resume_id];
              setTimeout(() => {
                this.dataSource.paginator=this.paginator;
              }, 10);
            }

            else
            {
              this.dataSource.data=[];
            }
        }
      })
    
    const data=history.state.resumeData;
       
  
    if(data!==undefined && data.length>0)
    {
      this.dataSource.data = [...data];
    

      setTimeout(() => {
        this.dataSource.paginator=this.paginator;
      }, 10);


    
    }

    else
    {
      
     this.activatedRoute.queryParams.subscribe((params:any) => {    

      if(Object.keys(params).length>0)
      {
     
        if(Array.isArray(params['resume_id']))
        {
           this.ResumeIds=[...params['resume_id']];
        }

        else
        {

          this.ResumeIds=[params['resume_id']];
        }
        
        this.jd_id=params['jd_id'];



       if(this.ResumeIds.length)
       {

       
          this.getlistResume(this.ResumeIds);
           
       }

      }
      // this.jd_id = params['jd_id'];
      // this.resume_id = params['resume_id'];
      // console.log('JD ID:', this.jd_id);
      // console.log('Resume ID:', this.resume_id);


    });

    }
  }


  updateHistoryData(newData: any) {
    const updatedState = { ...history.state, resumeData: newData };
    history.replaceState(updatedState, '');
    console.log("History state updated:", history.state);
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
  
    // Call API to upload files
    this.uploadCV(formData);
  }
  

    uploadCV(file: FormData): void {
      this.loading = true;
  
      
      this.commonser.uploadCV(this.userId, this.jd_id, file).subscribe(
        (response) => {
      
          this.loading = false;
    
          Swal.fire({
            icon: 'success',
            title: response.message,
        
            confirmButtonColor: '#F58220'
          }).then(()=>
          {
            if(response.resume_ids.length>0)
              {
                 this.ResumeIds=response.resume_ids;
                 this.getlistResume(this.ResumeIds);
              }
          })

          
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
  

   async getlistResume(ResumeIds:Array<string>)
  {
    
     const list : any[] = []
    this.ResumeIds;
    if(!this.dataSource.data.length)
    { 
       this.loading=true;
    }
    for(let i = 0 ; i<this.ResumeIds.length; i++)
      {
        this.expliicit_loader=true;
        const payload:{
          jd_id:string, 
          resume_id:string}={
            jd_id:this.jd_id,
          resume_id:this.ResumeIds[i]
        }

        try
        {
          const res = await this.commonser.ScoreResume(payload).toPromise();
          this.dataSource.data = [...this.dataSource.data, res];

          if(this.router.url=='/history/list_resume')
            {
              this.commonser.ResumeUploaded.next(this.dataSource.data);
              const payload_data:any={
                jd_id:this.jd_id,
                resume_id:[...this.dataSource.data]
              }
              this.commonser.UpdateResumeList.next(payload_data);
            }
        }

        catch
        {
          this.expliicit_loader=false;
         
        }

        finally
        {
            this.expliicit_loader=false;
            this.loading=false;
        }
      }

      // this.dataSource.data=this.sortByScoreNumber();


        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;

  }

  ngAfterViewChecked()
  {
    // this.dataSource.data=this.sortByScoreNumber();
  }

  isSort(columnName: string): boolean {
    if (columnName && columnName.trim() !== '') { 
      switch (columnName.toLowerCase()) {
        // case 'sno':
        case 'viewdetails':
          return false;
  
        default:
          return true;
      }
    } else {
      return false;
    }
  }
  

  sortByScoreNumber(order:string='dsc'): ResumeListing[] {
    console.log("sorting by");
    return this.dataSource.data.sort((a:any, b:any) => {
      return order === 'asc' ? a.Score - b.Score : b.Score - a.Score;
    });
  }

  getColorforScore(Score:string):string
  {
     if(Score!=='')
     {
       const score=parseInt(Score);

       if(score<=30)
       {
         return 'red'
       }

       else if(score>=31 && score<=60)
       {
          return 'orange' 
       }

       else
       {
        return 'green'
       }
     }

     return 'red';
  }


  ViewDetails(ResumeData:{score:{
    name:string,
    email:string,
    phone:string,
    score:string,
    explanation:string
  },
  resume:string
})
  {
  
    const title = this.router.url;
   

    if(title!=='' && title=='/history/list_resume')
    {

         this.router.navigate(['/history/jobCV-display'],{state:ResumeData})

    }

    else
    {
        this.router.navigate(['/jobCV-display'], {state:ResumeData}).then(() => {
                this.loading = false; 
              });
    }
    // console.log("activated route is",this.router.)

    
            
  }


  ngOnDestroy()
  {
    // this.commonser.UpdateResumeList.complete();

    this.ResumeIds=[];
  }


}
