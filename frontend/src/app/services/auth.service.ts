import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AccountInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private msalService: MsalService) {
    this.msalService.instance.addEventCallback((event) => {
      if (event.eventType === 'msal:loginSuccess') {
        this.currentUserSubject.next(event.payload?.account || null);
      } else if (event.eventType === 'msal:logoutSuccess') {
        this.currentUserSubject.next(null);
      }
    });

    // Check if user is already logged in
    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      this.currentUserSubject.next(accounts[0]);
    }
  }

  login(): void {
    this.msalService.loginRedirect({
      scopes: environment.apiConfig.scopes
    });
  }

  logout(): void {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri
    });
  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getAllAccounts().length > 0;
  }

  getAccessToken(): string | null {
    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      // In a real implementation, you would get the access token here
      // For now, we'll use the ID token
      return localStorage.getItem('msal.idtoken');
    }
    return null;
  }

  getCurrentUser(): AccountInfo | null {
    return this.currentUserSubject.value;
  }

  handleRedirectPromise(): Observable<boolean> {
    return new Observable(observer => {
      this.msalService.handleRedirectObservable().subscribe({
        next: (result) => {
          if (result) {
            this.currentUserSubject.next(result.account);
            observer.next(true);
          } else {
            observer.next(false);
          }
          observer.complete();
        },
        error: (error) => {
          console.error('Redirect error:', error);
          observer.error(error);
        }
      });
    });
  }
}
