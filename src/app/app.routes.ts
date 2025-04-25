// import { Routes } from '@angular/router';
// import { JobFormComponent } from './features/job-form/job-form.component';
// import { JobDescriptionComponent } from './features/job-description/job-description.component';
// import { JobQuestionsComponent } from './features/job-questions/job-questions.component';
// import { JobCVDisplayComponent } from './features/job-cv-display/job-cv-display.component';
// import { LoginComponent } from './features/login/login.component';
// import { ForgetpasswordComponent } from './features/forgetpassword/forgetpassword.component';
// import { HistoryComponent } from './features/history/history.component';
// import { ResumeListingComponent } from './features/resume-listing/resume-listing.component';

// export const routes: Routes = [
//     { path: 'login', component: LoginComponent},
//     { path: 'forget-password', component: ForgetpasswordComponent },
//     {path:'list_resume',component:ResumeListingComponent},
//     { path: '', redirectTo: '/login', pathMatch: 'full' },
//     { path: 'job-form', component: JobFormComponent },
//     { path: 'job-description', component: JobDescriptionComponent },
//     { path: 'job-questions/:id', component: JobQuestionsComponent },
//     { path: 'jobCV-display', component: JobCVDisplayComponent },
//     { path: 'history', component: HistoryComponent,children:[
//         { path: 'job-description', component: JobDescriptionComponent },
//         { path: 'job-questions', component: JobQuestionsComponent },
//         { path: 'jobCV-display', component: JobCVDisplayComponent },
//         {
//             path:'list_resume',component:ResumeListingComponent
//         }
//     ] },
    
// ];


import { Routes } from '@angular/router';
import { JobFormComponent } from './features/job-form/job-form.component';
import { JobDescriptionComponent } from './features/job-description/job-description.component';
import { JobQuestionsComponent } from './features/job-questions/job-questions.component';
import { JobCVDisplayComponent } from './features/job-cv-display/job-cv-display.component';
import { LoginComponent } from './features/login/login.component';
import { ForgetpasswordComponent } from './features/forgetpassword/forgetpassword.component';
import { HistoryComponent } from './features/history/history.component';
import { ResumeListingComponent } from './features/resume-listing/resume-listing.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // { path: 'login', component: LoginComponent },
    // { path: 'forget-password', component: ForgetpasswordComponent },
    // { path: '', redirectTo: '/login', pathMatch: 'full' },
       { path: '', redirectTo: '/job-form', pathMatch: 'full' },

    // Protected Routes
    { path: 'list_resume', component: ResumeListingComponent,canActivate: [authGuard]  },
    { path: 'job-form', component: JobFormComponent, canActivate: [authGuard] },
    { path: 'job-description', component: JobDescriptionComponent, canActivate: [authGuard] },
    { path: 'job-questions/:id', component: JobQuestionsComponent, canActivate: [authGuard] },
    { path: 'jobCV-display', component: JobCVDisplayComponent, canActivate: [authGuard] },
    
    { 
        path: 'history', component: HistoryComponent, canActivate: [authGuard], 
        children: [
            { path: 'job-description', component: JobDescriptionComponent },
            { path: 'job-questions/:id', component: JobQuestionsComponent },
            { path: 'jobCV-display', component: JobCVDisplayComponent },
            { path: 'list_resume', component: ResumeListingComponent }
        ] 
    },
];
