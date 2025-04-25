import { Component, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {  MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonService } from '../../core/Services/common.service';
import { LoaderComponent } from '../loader/loader.component';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';



export function onlyLettersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // Allow empty field (handled by 'required' validator)

    const hasNumbers = /[0-9]/.test(control.value);
    return hasNumbers ? { onlyLetters: true } : null;
  };
}

export function noSpecialCharsValidator(): ValidatorFn {
  // const specialCharPattern = /[!@#$%^&*()?"':{}|<>+-=_]/;
  const specialCharPattern = /[!@#$%^&*()?"':{}|<>+\-=_]/;



  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && specialCharPattern.test(value)) {
      return { specialCharsNotAllowed: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [LoaderComponent,MatExpansionModule,ReactiveFormsModule,CommonModule,FormsModule,MatInputModule,MatSelectModule,MatTabsModule,MatIconModule,MatButtonModule,NgIf,NgFor],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.scss'
})

export class JobFormComponent {
  jobForm!: FormGroup;
  loading: boolean = false;
  private organisations: any[] = [];
  experienceOptions = [0,1, 2, 3, 5,6, 7, 10, 15, 20];
  communicationLevels = ['Low', 'Medium', 'High', 'Expert'];
  educationOptions = ['High School', 'Associate', 'B.tech', 'Bachelor', 'Master', 'PhD'];
  vertical = [
    "Human Resources (HR)",
    "Information Technology (IT)",
    "Finance and Accounting",
    "Marketing",
    "Sales",
    "Operations Management",
    "Customer Support",
    "Research and Development (R&D)",
    "Legal",
    "Administrative Support",
    "Product Management",
    "Design",
    "Quality Assurance (QA)",
    "Purchasing and Procurement",
    "Security",
    "Others"
  ];
  role: string = '';
  organisationsWithSubOrgs: any[] = [];
  orgControl: FormControl = new FormControl();

  currentorganisationId: string = '';
  currentSuborganisationId: string = '';
  newItemEvent = new EventEmitter<string>();
  newItemEvent2 = new EventEmitter<[string, string]>();
  selectedOrg: any = null;
  selectedSubOrg: any = null;
  users: any[] = [];
  parentOrgName: string = '';
  subOrgName: string = '';
  organisation: string = '';
  suborganisation: string = '';
  suborg: any = null;
  readonly panelOpenState = signal(false);
  user_id:any
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,private cookies:CookieService,
    private activatedroute:ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user_id=this.activatedroute.snapshot.queryParamMap.get('id')
    this.initForm();
    this.commonService.setJdId(null);
    this.commonService.setjobDesc(null);
    this.commonService.setjobTitle(null);
    if (this.role === 'superadmin') {
      // Fetch all organizations with their sub-organizations for superadmin
      this.commonService.getAllOrganizationsWithSubOrganizations().subscribe(
        (orgs) => {
          this.organisationsWithSubOrgs = orgs;
          this.orgControl?.patchValue(this.organisationsWithSubOrgs[0]?.org_id);
  
          this.onUserOrgSelection(this.orgControl.value)
        },
        (error) => {
          console.error('Error fetching organizations for superadmin:', error);
        }
      );
    }
  
    if (this.role === 'org') {
      // Fetch the organization and its sub-organizations for organization login
      this.commonService.fetchdetails().subscribe(
        (data) => {
          this.commonService.getsuborganizations(data.id).subscribe(
            (suborg) => {
              this.organisationsWithSubOrgs = [
                { org_name: data.name, org_id: data.id, subOrganizations: suborg },
              ];
              console.log(this.organisationsWithSubOrgs);
              this.orgControl?.patchValue(this.organisationsWithSubOrgs[0]?.org_id);
  
              this.onUserOrgSelection(this.orgControl.value)
            },
            (error) => {
              console.error('Error fetching sub-organizations for org:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching org details:', error);
        }
      );
    }
  
    if (this.role === 'sub_org') {
      // Fetch sub-organization users for sub-org role
      this.commonService.fetchdetails().subscribe(
        (data) => {
          // Fetch the users of the sub-organization
          const suborg=[{sub_org_id:data.id,sub_org_name:data.username}];
          this.organisationsWithSubOrgs = [
            { org_name: data.org_name, org_id: data.org_id, subOrganizations: suborg },
          ];
          this.orgControl?.patchValue(this.organisationsWithSubOrgs[0]?.org_id);
  
          this.onUserOrgSelection(this.orgControl.value)
        },
        (error) => {
          console.error('Error fetching sub-organization details:', error);
        }
        
      );
    }
    if(this.role=='user'){
      this.commonService.fetchdetails().subscribe(
        (data) => {
          // Fetch the users of the sub-organization
          const suborg=[{sub_org_id:data.sub_org_id,sub_org_name:data.sub_org_name}];
          this.organisationsWithSubOrgs = [
            { org_name: data.org_name, org_id: data.org_id, subOrganizations: suborg },
          ];
  
          this.orgControl?.patchValue(this.organisationsWithSubOrgs[0]?.org_id);
  
          this.onUserOrgSelection(this.orgControl.value)
  
          
         
        },
        (error) => {
          console.error('Error fetching sub-organization details:', error);
        }
      );
    }
  
 
  }

  initForm(): void {
    this.jobForm = this.fb.group({
      jobTitle: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        onlyLettersValidator(),
        noSpecialCharsValidator()
      ]],
      experience: [10, Validators.required],
      mandatorySkills: ['', [
        Validators.required,
        Validators.minLength(3),
        onlyLettersValidator(),
        noSpecialCharsValidator()
      ]],
      educationPreference: ['', [Validators.required, onlyLettersValidator(),noSpecialCharsValidator()]],
      communicationSkills: ['', Validators.required],
      optionalSkills: ['', [
        onlyLettersValidator(),
        noSpecialCharsValidator()
      ]],
      vertical: ['', Validators.required]
    });
  }
  


  onSubmit(): void {
    if (this.jobForm.valid) {
      this.loading = true;
      const jobData = {
        user_id: this.user_id, 
        job_title: this.jobForm.value.jobTitle,
        experience: this.jobForm.value.experience,
        education_preference: this.jobForm.value.educationPreference,
        communication_skills: this.jobForm.value.communicationSkills,
        mandatory_skills: this.jobForm.value.mandatorySkills,
        optional_skills: this.jobForm.value.optionalSkills,
        vertical:this.jobForm.value.vertical
      };
      let navigationExtras: NavigationExtras = {};
      navigationExtras.state = { data:jobData };
      this.router.navigate(['/job-description'], navigationExtras);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.jobForm.get(controlName);

    if (control?.hasError('required')) {
      return 'This field is required';
    }

    if (control?.hasError('minlength')) {
      return `Minimum ${control?.errors?.['minlength'].requiredLength} characters required`;
    }
    
    if (control?.hasError('onlyLetters')) {
      return 'Only characters are allowed';
    }

    if (control?.hasError('specialCharsNotAllowed')) {
      return 'Special characters are not allowed';
    }
    return '';
  }
  onUserOrgSelection(event:any){

   
    this.commonService.updatecurrentOrgtype('organization');
    
  
    // this.handleOrgSelection()
    this.currentorganisationId=event;
    if(this.currentorganisationId != this.currentSuborganisationId){
      this.newItemEvent.emit(this.currentorganisationId);
    }
  }
  OnUserSubOrgSelection(org:any,event:any){
    this.currentorganisationId=org;

    this.commonService.updatecurrentOrgtype('sub_organization');
   
    this.currentSuborganisationId=event;
    this.newItemEvent2.emit([this.currentorganisationId,this.currentSuborganisationId]);

  }
handleOrgSelection(event:any){
  // this.currentorganisationId=event;
 if(this.currentorganisationId != this.currentSuborganisationId){
      this.newItemEvent.emit(this.currentorganisationId);
    }
}

// Function to handle Organization selection
selectOrganization(org: any) {
  this.selectedOrg = org; // Store selected organization
  this.selectedSubOrg = null; // Reset sub-org selection
}

// Function to handle Sub-Organization selection
selectSubOrganization(subOrg: any) {
  this.selectedSubOrg = subOrg; // Store selected sub-organization
}
}
