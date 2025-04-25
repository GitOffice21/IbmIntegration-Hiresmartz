
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, catchError, forkJoin, map, Observable, Subject, switchMap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient , private cookieService:CookieService) {
    const storedOrgs = this.cookieService.get('organisations');
    if (storedOrgs && storedOrgs!==undefined) {
      this.organisations = JSON.parse(storedOrgs);
    }
   }
    jobDetailsSubject = new BehaviorSubject<any>(null);
    jdid = new BehaviorSubject<any>(null);
    jobDesc = new BehaviorSubject<any>(null);
    jobTitle = new BehaviorSubject<any>(null);
     UpdateResumeList=new BehaviorSubject<any>(null);
     UpdateQuestionsList=new BehaviorSubject<any>(null);

    ResumeUploaded=new BehaviorSubject<any>(null);


   setJobDetails(details: any) {
     this.jobDetailsSubject.next(details);
   }
   setJdId(id: any) {
    this.jdid.next(id);
  }
   setjobDesc(data:any){
    this.jobDesc.next(data);
   }
   setjobTitle(data:any){
    this.jobTitle.next(data);
   }
  createJobDescription(jobData: any) {
    const headers = new HttpHeaders({
      Authorization : `Bearer ${this.cookieService.get('token')}`
    })
    console.log(headers);
    
    return this.http.post<any>(`${environment.apiUrl}/job_description/create_jd`, jobData,{headers});
  }

  generateQuestions(jobDescriptionId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization : `Bearer ${this.cookieService.get('token')}`
    })
    const requestBody = { job_description_id: jobDescriptionId };
    const url = `${environment.apiUrl}/questions/generate`;
    return this.http.post(url, requestBody,{headers});
  }

  private uploadedCVData: { resume_id: string } | null = null;
  uploadCV(userId: string, jdId: string, file: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization : `Bearer ${this.cookieService.get('token')}`
    })
    const url = `${environment.apiUrl}/resume/upload_resume`;

    return this.http.post(url, file,{headers});
  }

  // Store uploaded CV data
  setUploadedCVData(data: { resume_id: string }): void {
    this.uploadedCVData = data;
  }

  // Retrieve uploaded CV data
  getUploadedCVData(): { resume_id: string } | null {
    return this.uploadedCVData;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }


  
  private organisations: any[] = []; // Use Organisation[] instead of any[]

  private readonly apiUrl2: string = `${environment.apiUrl2}`;
  private readonly api=`${environment.apiUrl}`

  // Setter to store the organisation array
  setOrganisations(orgArray: any[]): void {
    this.organisations = orgArray;
    this.cookieService.set('organisations', JSON.stringify(orgArray)); // Save to cookies
  }

  // Getter to retrieve the organisation array
  getOrganisations() {
    const headers = new HttpHeaders({
      Authorization : `Bearer ${this.cookieService.get('token')}`
    })
    return this.http.get<any>(`${this.apiUrl2}/listorganizations`, {headers});
  }


 
    getsuborganizations(id:string):Observable<any>{
      const headers = new HttpHeaders({
        Authorization : `Bearer ${this.cookieService.get('token')}`
      })
     return this.http.get<any>(`${this.apiUrl2}/listsuborganizations?org_id=${id}`,{headers})
    }

// getusers(id:string){
//   const headers = new HttpHeaders({
//     Authorization : `Bearer ${this.cookieService.get('token')}`
//   })
//   return this.http.get<any>(`${this.apiUrl2}/users?sub_org_id=${id}`,{headers})
// }
   
    fetchdetails():Observable<any>{
      const headers = new HttpHeaders({
        Authorization : `Bearer ${this.cookieService.get('token')}`
      })
     return this.http.get<any>(`${this.apiUrl2}/fetch-details`,{headers});
    }


  

   // Clear organisations from cookies on logout
   clearOrganisations(): void {
    this.organisations = [];
    this.cookieService.delete('organisations'); // Remove from cookies on logout
  }

getAllOrganizationsWithSubOrganizations(): Observable<any[]> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.cookieService.get('token')}`,
  });

  return this.getOrganisations().pipe(
    switchMap((organizations: any[]) => {
      const subOrgRequests = organizations.map((org: any) =>
        this.getsuborganizations(org.org_id).pipe(
          map((subOrgs) => ({
            ...org,
            subOrganizations: subOrgs, // Attach sub-organizations to each organization
          }))
        )
      );

      // Combine all requests and return the final merged data
      return forkJoin(subOrgRequests);
    })
  );
}

currentOrgtype:BehaviorSubject<string>=new BehaviorSubject<string>('');
updatecurrentOrgtype(org_type:string)
{
  this.currentOrgtype.next(org_type);
}
getConversationList(): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.cookieService.get('token')}`
  });
  return this.http.get<any>(`${this.apiUrl2}/load/conversation/list`, { headers });
}
getjoblist(payload:any):Observable<any>{
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.cookieService.get('token')}`
  });
  return this.http.post<any>(`${this.api}/job_description/list_jd`,payload, { headers });
}
getcvscore(payload:any):Observable<any>{
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.cookieService.get('token')}`
  });
  return this.http.post<any>(`${this.api}/resume/return_score`,payload, { headers });
}


ScoreResume(payload:{jd_id:string,resume_id:string}):Observable<any>
{
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.cookieService.get('token')}`
  });
  return this.http.post(`${this.api}/resume/score_resume`,payload,{headers})
}

}

