
// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../auth/auth.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (!authService.isLoggedIn()) {
//     router.navigate(['/login'])
//   }
//   //  if(authService.isLoggedIn()&&router.url.includes('/login')){
//   //   router.navigate(['/job-form'])
//   //  }
//   if (state.url === '/login') {
//     router.navigate(['/job-form']); 
//     return false;
//   }
  
//   return true;
// };



import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn(); // should check cookies/token here
  console.log(isLoggedIn);
  
  // If not logged in, redirect to /login
  if (!isLoggedIn) {
    // router.navigate(['/login']);
    return false;
  }

  // If logged in and trying to go to login, redirect to default route
  if (isLoggedIn && state.url === '/login') {
    router.navigate(['/job-form']);
    return false;
  }

  // Otherwise allow access
  return true;
};
