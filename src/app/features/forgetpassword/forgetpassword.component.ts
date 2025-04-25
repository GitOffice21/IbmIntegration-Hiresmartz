import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [MatInputModule,
    MatFormFieldModule,CommonModule,MatProgressSpinnerModule, ReactiveFormsModule ,MatIconModule,LoaderComponent],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss'
})
export class ForgetpasswordComponent {
  forgotPasswordForm!: FormGroup;
  loading: boolean = false;

 constructor( private fb: FormBuilder,  private router: Router,private authService:AuthService){
 this.initForm();
 }
  
  
 onLogin(){
   this.router.navigate(['/login']);
 }
  
    initForm(): void {
       this.forgotPasswordForm = this.fb.group({
         email: [
           '',
         [Validators.required,
           Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]  
         ]});
     }
  
      onSubmit(): void {
        if (this.forgotPasswordForm.invalid) {
          this.forgotPasswordForm.markAllAsTouched(); // This will trigger validation messages
          return;
        }
      
        if (this.forgotPasswordForm.valid) {
          this.loading = true;
          const email = this.forgotPasswordForm.value.email;
      
          // Call the forgotPassword method from the service
          this.authService.forgotPassword(email).subscribe({
            next: (response: any) => {
              this.loading = false;
              Swal.fire({
                icon: 'success',
                title: 'Reset Link Sent!',
                text: `A password reset link has been sent to ${email}. Please check your email to reset your password.`,
                confirmButtonText: 'OK'
              });
            },
            error: (error: any) => {
              this.loading = false;
              let errorMessage = "No user found with this email.";
              
              // Optionally use error message from API response
              if (error?.error?.message) {
                errorMessage = error.error.message;
              }
              
              Swal.fire('Error', errorMessage, 'error');
            }
          });
        } else {
          this.forgotPasswordForm.markAllAsTouched(); // Mark all fields as touched to show validation messages
        }
      }
      
}
