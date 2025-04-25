
// import { Component, inject, OnInit } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { Router } from '@angular/router';
// import { signal } from '@angular/core';
// import { NgFor, NgIf, NgStyle } from '@angular/common';
// import { MatCheckboxModule } from '@angular/material/checkbox';

// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import Swal from 'sweetalert2';
// import { MatDialog } from '@angular/material/dialog';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     MatInputModule,
//     MatFormFieldModule,
//     MatButtonModule,
//     MatIconModule,
//     ReactiveFormsModule,
//     NgFor,
//     NgIf,
//     MatCheckboxModule,
//     MatProgressSpinnerModule,
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
// })
// export class LoginComponent implements OnInit {
//   loginForm!: FormGroup;
//   hidePassword = true;
//   formSubmitted: boolean = false;
//   loading: boolean = false;

//   private _snackBar = inject(MatSnackBar);
//   readonly dialog = inject(MatDialog);
//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
  
//   ) {
//     this.initForm();
//   }
 
//   ngOnInit(): void {
//     const savedCredentials = this.getSavedCredentials();
//     if (savedCredentials) {
//       this.loginForm.patchValue({
//         email: savedCredentials.email,
//         password: savedCredentials.password,
//         rememberMe: true,
//       });
//     }
//   }
 
//   initForm() {
//     this.loginForm = this.fb.group({
//       email: [
//         '',
//         [
//           Validators.required,
//           Validators.pattern(
//             /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
//           ),
//         ],
//       ],
//       password: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(8), // Minimum length of 8 characters
//           Validators.pattern(
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/
//           ),
//         ],
//       ],
//       rememberMe: [false],
//     });
//   }
 
//   togglePasswordVisibility() {
//     this.hidePassword = !this.hidePassword;
//   }
 
//   onSubmit() {
//     this.formSubmitted = true;
 
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched(); // This will trigger validation messages
//       return;
//     }
 
//     if (this.loginForm.valid) {
//       const { email, password, rememberMe } = this.loginForm.value;
 
//       // Handle remember me functionality
//       if (rememberMe) {
//         this.saveCredentials(email, password);
//       } else {
//         this.clearSavedCredentials();
//       }
//       this.loading = true;
 
//       this.authService.login(email, password).subscribe({
//         next: (response: any) => {
//           this.loading = false;
//           this.authService.saveAuthData(response.access_token, response.role);
//           if (response.role == 'user') {
//             if (response.access_token) {
//               const decodedtoken = jwtDecode(response.access_token);
//               if (decodedtoken && decodedtoken.sub) {
//                 this.router.navigate([`/chatbots/${decodedtoken.sub}`]);
//               }
//             }
//           } else {
//             this.router.navigate(['/dashboard']);
//           }
//         },
//         error: (error: any) => {
//           this.loading = false;
//           const errorMessage = error.error?.detail;
//           Swal.fire('Error', errorMessage, 'error');
//         },
//       });
//     }
//   }
 
//   private saveCredentials(email: string, password: string) {
//     // Encrypt password before storing (basic encryption - you might want to use a more secure method)
//     const encodedPassword = btoa(password);
//     localStorage.setItem(
//       'rememberedCredentials',
//       JSON.stringify({
//         email,
//         password: encodedPassword,
//       })
//     );
//   }
 
//   private clearSavedCredentials() {
//     localStorage.removeItem('rememberedCredentials');
//   }
 
//   hide = signal(true);
//   clickEvent(event: MouseEvent) {
//     this.hide.set(!this.hide());
//   }
 
//   onForgotPassword() {
//     this.router.navigate(['/forget-password']);
//   }
 
//   showError(errorMessage: string) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Error!',
//       text: errorMessage,
//       confirmButtonColor: '#d33',
//     });
//   }
 
//   private getSavedCredentials(): { email: string; password: string } | null {
//     const savedCredentials = localStorage.getItem('rememberedCredentials');
//     if (savedCredentials) {
//       const credentials = JSON.parse(savedCredentials);
//       return {
//         email: credentials.email,
//         password: atob(credentials.password),
//       };
//     }
//     return null;
//   }
// }
 















import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationExtras, Router } from '@angular/router';
import { signal } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../core/auth/auth.service';
import { LoaderComponent } from '../loader/loader.component';
import { CommonService } from '../../core/Services/common.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    LoaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  formSubmitted: boolean = false;
  loading: boolean = false;

  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);


  tools : {tool_name : string, tool_id : string, description : string} [] = [
    {
      tool_id: "187ccc7d-a522-4f2b-bcfd-fc74c3acc2af",
      tool_name: "churn_rate",
      description: "churn_rate_tool"
    },
    {
      tool_id: "eb83707f-ca1d-4009-bfd5-629097650115",
      tool_name: "chatbot",
      description: "chatbot saas based app"
    },
    {
      tool_id: "10824250-6f08-4e80-a735-603764b2da23",
      tool_name: "UserTool1",
      description: "Description"
    },
    {
      tool_id: "1b044aaa-777c-4010-9046-c5b1dcbf2b20",
      tool_name: "Tool1",
      description: "Description for tool1"
    }
  ]
 
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService:AuthService,
    private commonService:CommonService,
    private cookies : CookieService
  
  ) {
    this.initForm();
  }
 
  ngOnInit(): void {
    const savedCredentials = this.getSavedCredentials();
    if (savedCredentials) {
      this.loginForm.patchValue({
        email: savedCredentials.email,
        password: savedCredentials.password,
        rememberMe: true,
      });
    }
    if(localStorage.getItem('authToken')){
      this.router.navigate(['/job-form'])
    }
  }
 
  initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // Minimum length of 8 characters
          // Validators.pattern(
          //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/
          // ),
        ],
      ],
      toolId: ['f5c29ba6-1cee-4a00-833c-6b24ae487d0e'],
      rememberMe: [false],
    });
  }
 
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  showErrorMessage: boolean = false; 
  // onSubmit() {
  //   this.formSubmitted = true;
 
  //   if (this.loginForm.invalid) {
  //     this.loginForm.markAllAsTouched(); // This will trigger validation messages
  //     return;
  //   }
    
 
  //   const toolId = this.loginForm.get('toolId')?.value || undefined;
  //   if (this.loginForm.valid) {
  //     const { email, password, rememberMe } = this.loginForm.value;
 
  //     // Handle remember me functionality
  //     if (rememberMe) {
  //       this.saveCredentials(email, password);
  //     } else {
  //       this.clearSavedCredentials();
  //     }
  //     this.loading = true;
 
  //     this.authService
  //   .login({
  //     email: this.loginForm.get('email')?.value,
  //     password: this.loginForm.get('password')?.value,
  //     tool_id: toolId, // Send tool_id only if it's provided
  //   })
  //   .subscribe({
  //     next: (response) => {
  //       console.log(response);
        
  //       if (response) {
  //         // Handle successful login
  //         this.authService.saveToken(response.access_token, this.loginForm.get('rememberMe')?.value);
  //         if (response.organizations && response.organizations.length > 0) {
  //           this.commonService.setOrganisations(response.organizations);
  //         }
  //         this.cookies.set("token", response.access_token);
  //             if(response.access_token ){
  //           this.commonService.fetchdetails().subscribe((result:any)=>{
  //             if(result.available_hits > 0 || result.role=='superadmin' ){
  //               localStorage.setItem('user_id',result.id)
  //               const navigationExtras: NavigationExtras = {
  //                 state: { role: response.user_role },  
  //                 queryParams: { id: result.id }     
  //               };
           
                
  //         this.router.navigate(['/job-form'],navigationExtras);
  //             }
  //             else{
  //               this.showError(" No hits available to process further");
  //             }
  //           })
  //         }
  //         else{
  //           this.showError("No token available to process further");
  //         }
   
  //       //   let navigationExtras: NavigationExtras = {};
  //       //   navigationExtras.state = { role:response.user_role };
  //       //   this.router.navigate(['/Chat'],navigationExtras);
  //       // } else {
  //       //   this.showErrorMessage('Invalid credentials. Please try again.');
  //       // }
  //       this.loading = false; // Stop the spinner
  //     }
  //   }});
  
  //   }
  // }

  onSubmit() {
    this.formSubmitted = true;
  
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // This will trigger validation messages
      return;
    }
  
    const toolId = this.loginForm.get('toolId')?.value || undefined;
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
  
      // Handle remember me functionality
      if (rememberMe) {
        this.saveCredentials(email, password);
      } else {
        this.clearSavedCredentials();
      }
      this.loading = true;
  
      this.authService
        .login({
          email: this.loginForm.get('email')?.value,
          password: this.loginForm.get('password')?.value,
          tool_id: toolId, // Send tool_id only if it's provided
        })
        .subscribe({
          next: (response) => {
            console.log(response);
  
            if (response) {
              // Handle successful login
              this.authService.saveToken(response.access_token, this.loginForm.get('rememberMe')?.value);
              if (response.organizations && response.organizations.length > 0) {
                this.commonService.setOrganisations(response.organizations);
              }
              this.cookies.set("token", response.access_token);
              if (response.access_token) {
                this.commonService.fetchdetails().subscribe((result: any) => {
                  if (result.available_hits > 0 || result.role == 'superadmin') {
                    localStorage.setItem('user_id', result.id);
                    const navigationExtras: NavigationExtras = {
                      state: { role: response.user_role },
                      queryParams: { id: result.id }
                    };
  
                    this.router.navigate(['/job-form'], navigationExtras);
                  } else {
                    this.showError(" No hits available to process further");
                  }
                });
              } else {
                this.showError("No token available to process further");
              }
  
              this.loading = false; // Stop the spinner
            }
          },
          error: (err) => {
            this.loading = false; // Stop the spinner
            if (err.error?.detail) {
              this.showError(err.error.detail); // Show the error message from the backend
            } else {
              this.showError("An error occurred. Please try again.");
            }
            // if (err.status === 401) {
            //   this.showError("Invalid credentials. Please check your email and password.");
            // } else if (err.status === 403) {
            //   this.showError("You do not have permission to access this resource.");
            // } else if (err.status === 500) {
            //   this.showError("Server error. Please try again later.");
            // } else {
            //   this.showError("An unexpected error occurred. Please try again.");
            // }
            
          }
        });
    }
  }
  
 
 private saveCredentials(email: string, password: string) {
    const encodedPassword = btoa(password);
    localStorage.setItem(
      'rememberedCredentials',
      JSON.stringify({
        email,
        password: encodedPassword,
      })
    );
  }
 
  private clearSavedCredentials() {
    localStorage.removeItem('rememberedCredentials');
  }
 
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
  }
 
  onForgotPassword() {
    this.router.navigate(['/forget-password']);
  }
 
  showError(errorMessage: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: errorMessage,
      confirmButtonColor: '#d33',
    });
  }
 
  private getSavedCredentials(): { email: string; password: string } | null {
    const savedCredentials = localStorage.getItem('rememberedCredentials');
    if (savedCredentials) {
      const credentials = JSON.parse(savedCredentials);
      return {
        email: credentials.email,
        password: atob(credentials.password),
      };
    }
    return null;
  }

  }

// export class LoginComponent implements OnInit {
//   loginForm!: FormGroup;
//   hidePassword = true;
//   formSubmitted: boolean = false;
//   loading: boolean = false;

//   private _snackBar = inject(MatSnackBar);
//   readonly dialog = inject(MatDialog);

//   tools: {tool_name: string, tool_id: string, description: string}[] = [
//     {
//       tool_id: "187ccc7d-a522-4f2b-bcfd-fc74c3acc2af",
//       tool_name: "churn_rate",
//       description: "churn_rate_tool"
//     },
//     {
//       tool_id: "eb83707f-ca1d-4009-bfd5-629097650115",
//       tool_name: "chatbot",
//       description: "chatbot saas based app"
//     },
//     {
//       tool_id: "10824250-6f08-4e80-a735-603764b2da23",
//       tool_name: "UserTool1",
//       description: "Description"
//     },
//     {
//       tool_id: "1b044aaa-777c-4010-9046-c5b1dcbf2b20",
//       tool_name: "Tool1",
//       description: "Description for tool1"
//     }
//   ];

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private authService: AuthService,
//     private cookies: CookieService
//   ) {
//     this.initForm();
//   }

//   ngOnInit(): void {
//     const savedCredentials = this.getSavedCredentials();
//     if (savedCredentials) {
//       this.loginForm.patchValue({
//         email: savedCredentials.email,
//         password: savedCredentials.password,
//         rememberMe: true,
//       });
//     }
//   }

//   initForm() {
//     this.loginForm = this.fb.group({
//       email: [
//         '',
//         [
//           Validators.required,
//           Validators.pattern(
//             /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
//           ),
//         ],
//       ],
//       password: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(8),
//           // Validators.pattern(
//           //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/
//           // ),
//         ],
//       ],
//       toolId: ['eb83707f-ca1d-4009-bfd5-629097650115', Validators.required],
//       rememberMe: [false],
//     });
//   }
//   onSubmit() {
//     this.formSubmitted = true;
  
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched();
//       return;
//     }
  
//     if (this.loginForm.valid) {
//       const { email, password, toolId, rememberMe } = this.loginForm.value;
  
//       // Handle remember me functionality
//       if (rememberMe) {
//         this.saveCredentials(email, password);
//       } else {
//         this.clearSavedCredentials();
//       }
  
//       this.loading = true;
  
//       this.authService.login({ email, password, tool_id: toolId })
//         .subscribe({
//           next: (response: any) => {
//             console.log('Login response:', response); // Keep for debugging
//             if (response?.access_token) {
//               this.authService.saveToken(response.access_token, rememberMe);
//               this.cookies.set('token', response.access_token);
              
//               // Navigate directly to job-form after successful login
//               let navigationExtras: NavigationExtras = {
//                 state: { role: response.user_role }
//               };
//               this.router.navigate(['/job-form'], navigationExtras);
//             } else {
//               this.showErrorMessage('Invalid credentials. Please try again.');
//             }
//             this.loading = false;
//           },
//           error: (err: any) => {
//             console.error('Login error:', err); // Keep for debugging
//             this.showErrorMessage(err.error?.detail || 'Login failed. Please try again.');
//             this.loading = false;
//           }
//         });
//     }
//   }

//   private saveCredentials(email: string, password: string) {
//     const encodedPassword = btoa(password);
//     localStorage.setItem(
//       'rememberedCredentials',
//       JSON.stringify({ email, password: encodedPassword })
//     );
//   }
//   hide = signal(true);
//     clickEvent(event: MouseEvent) {
//       this.hide.set(!this.hide());
//     }
//   private clearSavedCredentials() {
//     localStorage.removeItem('rememberedCredentials');
//   }

//   private getSavedCredentials(): { email: string; password: string } | null {
//     const savedCredentials = localStorage.getItem('rememberedCredentials');
//     if (savedCredentials) {
//       const credentials = JSON.parse(savedCredentials);
//       return {
//         email: credentials.email,
//         password: atob(credentials.password),
//       };
//     }
//     return null;
//   }

//   private showErrorMessage(message: string): void {
//     this._snackBar.open(message, 'Close', {
//       duration: 5000,
//       panelClass: ['error-snackbar']
//     });
//   }

//   togglePasswordVisibility() {
//     this.hidePassword = !this.hidePassword;
//   }

//   onForgotPassword() {
//     this.router.navigate(['/forget-password']);
//   }
// }