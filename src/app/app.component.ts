import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './features/header/header.component';
import { FooterComponent } from './features/footer/footer.component';
import { AsyncPipe, Location, NgIf } from '@angular/common';
import { filter, map, Observable } from 'rxjs';
import { LoaderService } from './core/Services/loader.service';
import { LoaderComponent } from './features/loader/loader.component';
import { AuthService } from './core/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FooterComponent,NgIf,AsyncPipe,LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'IBM';
  isJobFormRoute = false;
  showHeaderFooter: boolean = true;

  constructor(private router: Router,private loaderService: LoaderService, private authService: AuthService,private cookies:CookieService) {
    this.loading$ = this.loaderService.isLoading$.pipe(map(value => value ?? false));  
    this.router.events.subscribe(() => {
      this.showHeaderFooter = !['/login', '/forget-password'].includes(this.router.url);
    });
  }

  ngOnInit() {
    sessionStorage.setItem('authToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmNkNzYwMi1mOGJmLTQ0ZTItYTNhYS02NzU0YzJiM2RkNGMiLCJleHAiOjE3NDU1MzYzMzUsInJvbGUiOiJTdXBlckFkbWluIn0.w2k2Hmi9ZuKfZlFEdRkJl3wjl6aodleEaKONAP5DWi8');
    this.cookies.set("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmNkNzYwMi1mOGJmLTQ0ZTItYTNhYS02NzU0YzJiM2RkNGMiLCJleHAiOjE3NDU1MzYzMzUsInJvbGUiOiJTdXBlckFkbWluIn0.w2k2Hmi9ZuKfZlFEdRkJl3wjl6aodleEaKONAP5DWi8');
    localStorage.setItem('user_id','5fcd7602-f8bf-44e2-a3aa-6754c2b3dd4c');
    // this.disableBackNavigation()
  }
  loading$!: Observable<boolean|null>;  // Declare without initializing


  disableBackNavigation() {
      history.pushState(null, '', location.href);
      window.onpopstate = () => {
        history.pushState(null, '', location.href); // Prevent back button behavior
      };

      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log('Route changed:', history.state);
        history.pushState({...history.state.data, navigationId : 0}, '', location.href);
      });
  
    }
 
}
