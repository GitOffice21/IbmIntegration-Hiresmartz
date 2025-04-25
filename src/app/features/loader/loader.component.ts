import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports:[NgIf],
  template: `
    <div class="overlay" *ngIf="isLoading">
      <div class="spinner-border" role="status">
        <span class="sr-only"></span>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      backdrop-filter: blur(3px);
    }
    
    .spinner-border {
      width: 3rem;
      height: 3rem;
      border: 0.25em solid  #F58320;
      // border-top: 0.25em solid #F58320;
      border-top: 0.25em solid  #f3f3f3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  @Input() isLoading: boolean|null = false;
  
}
