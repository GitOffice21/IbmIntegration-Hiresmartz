import { ChangeDetectorRef, Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModuleModule } from '../../core/common-module/common-module.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../../core/Services/common.service';
import {MatMenuModule} from '@angular/material/menu';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs';
MatToolbarModule
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModuleModule,NgIf,MatToolbarModule,MatIconModule,MatMenuModule,NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isJobFormRoute:boolean = true;
  availableHits: number = 0;
  totalHits: number = 0;
  availableTokens: number = 0;
  totalTokens: number = 0;
  isLoading: boolean = true;

  isMobileMenuOpen: boolean = false;

  toggleMobileMenu() {
    // console.log("Clicked anywhere");
    
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  constructor( private cdr: ChangeDetectorRef,private router: Router,private commonservice:CommonService,private cookies : CookieService, private route: ActivatedRoute) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.updateTitle();
    });
 
  }

  ngOnInit(): void { 
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
  
      // Check if current URL contains 'job-form'
      const url = event.url;
      const restrictedRoutes = ['/job-form', '/login', '/forget-password', '/history'];
      
      const backButtonDisabled = restrictedRoutes.some(route => url.includes(route));
      // console.log(backButtonDisabled);
      
      this.isJobFormRoute=backButtonDisabled;
      this.cdr.detectChanges(); 
  
    });
    // this.fetchDetails();
  }

  fetchDetails(): void {
    this.isLoading = true;
    this.commonservice.fetchdetails().subscribe(
      (response) => {
        this.availableHits = response.available_hits;
        this.totalHits = response.allocated_hits;
        this.availableTokens = response.remaining_ai_tokens;
        this.totalTokens = response.allocated_ai_tokens;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching details:', error);
        this.isLoading = false;
     
      }
    );
  }

  logout() {
    console.log("Click logout",this);
    
    // Remove the token from local storage or cookies
    localStorage.removeItem('token'); 
    this.cookies.delete('token'); // If using cookies
    localStorage.removeItem('authToken'); 
    // Navigate back to the login page
    this.router.navigate(['/login']);
    sessionStorage.removeItem('authToken');
  }
  isJobFormPage(): boolean {
    return this.router.url.includes('/job-form'); // Ensures button is shown ONLY on /job-form
  }
  historypage(){
    this.isLoading=true;
    this.router.navigate(["/history/job-description"]);
    this.isLoading=false;
  }



  pageTitle: string = 'Job Description';
  updateTitle() {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/history/job-description')) {
      this.pageTitle = 'History';
    } else if (currentUrl.includes('/history/job-questions')) {
      this.pageTitle = 'History';
    } else if (currentUrl.includes('/history/jobCV-display')) {
      this.pageTitle = 'History';
    } else if (currentUrl.includes('/history')) {
      this.pageTitle = 'History';
    } else {
      this.pageTitle = 'Job Description';
    }
  }
}
