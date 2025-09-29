import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <header class="header">
        <h1>Spring Angular Entra PoC</h1>
        <div class="auth-section">
          <div *ngIf="isLoggedIn$ | async; else notLoggedIn">
            <span class="user-info">Connecté en tant que {{ (currentUser$ | async)?.name }}</span>
            <button class="btn btn-secondary" (click)="logout()">Déconnexion</button>
          </div>
          <ng-template #notLoggedIn>
            <button class="btn btn-primary" (click)="login()">Se connecter avec Microsoft</button>
          </ng-template>
        </div>
      </header>

      <main class="main-content">
        <div class="welcome-section">
          <h2>Bienvenue !</h2>
          <p>Cette application démontre l'intégration d'authentification hybride avec Microsoft Entra ID et des comptes locaux.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <h3>🔐 Authentification Microsoft</h3>
            <p>Connectez-vous avec votre compte Microsoft en utilisant OIDC PKCE.</p>
            <button 
              *ngIf="!(isLoggedIn$ | async)" 
              class="btn btn-primary" 
              (click)="login()">
              Se connecter avec Microsoft
            </button>
          </div>

          <div class="feature-card">
            <h3>👤 Comptes Locaux</h3>
            <p>Créez un compte local avec email et mot de passe sécurisé.</p>
            <a routerLink="/register" class="btn btn-outline">Créer un compte</a>
          </div>

          <div class="feature-card" *ngIf="isLoggedIn$ | async">
            <h3>📊 Profil Utilisateur</h3>
            <p>Consultez vos informations de profil et les claims du token.</p>
            <a routerLink="/profile" class="btn btn-outline">Voir le profil</a>
          </div>

          <div class="feature-card" *ngIf="isLoggedIn$ | async">
            <h3>🔒 Données Sécurisées</h3>
            <p>Accédez aux données protégées nécessitant une authentification.</p>
            <a routerLink="/secure" class="btn btn-outline">Accéder aux données</a>
          </div>
        </div>

        <div class="info-section">
          <h3>À propos de ce PoC</h3>
          <ul>
            <li><strong>Frontend :</strong> Angular 18 avec MSAL</li>
            <li><strong>Backend :</strong> Spring Boot 3.x avec OAuth2 Resource Server</li>
            <li><strong>Authentification :</strong> Microsoft Entra ID (OIDC PKCE)</li>
            <li><strong>Sécurité :</strong> JWT validation, CORS, BCrypt</li>
            <li><strong>Base de données :</strong> H2 (dev) / PostgreSQL (prod)</li>
          </ul>
        </div>
      </main>

      <footer class="footer">
        <p>&copy; 2025 BrotherhoodLabs - Spring Angular Entra PoC</p>
      </footer>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h1 {
      margin: 0;
      font-size: 2rem;
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      margin-right: 1rem;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .welcome-section h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .feature-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .feature-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }

    .feature-card h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .info-section {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .info-section h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .info-section ul {
      list-style: none;
      padding: 0;
    }

    .info-section li {
      margin-bottom: 0.5rem;
      color: #666;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      text-decoration: none;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .btn-outline {
      background-color: transparent;
      color: #007bff;
      border: 1px solid #007bff;
    }

    .btn-outline:hover {
      background-color: #007bff;
      color: white;
    }

    .footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 1rem;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<any>;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = new Observable(observer => {
      this.authService.currentUser$.subscribe(user => {
        observer.next(!!user);
      });
    });
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    // Handle redirect after Microsoft login
    this.authService.handleRedirectPromise().subscribe(success => {
      if (success) {
        console.log('Login successful');
      }
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
