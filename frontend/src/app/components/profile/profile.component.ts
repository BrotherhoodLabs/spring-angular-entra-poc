import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService, User } from '../../services/api.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-container">
      <header class="header">
        <h1>Profil Utilisateur</h1>
        <div class="nav-links">
          <a routerLink="/" class="btn btn-outline">Accueil</a>
          <a routerLink="/secure" class="btn btn-outline">Données sécurisées</a>
        </div>
      </header>

      <main class="main-content">
        <div *ngIf="user; else loading" class="profile-card">
          <div class="profile-header">
            <div class="avatar">
              {{ user.displayName?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <div class="profile-info">
              <h2>{{ user.displayName }}</h2>
              <p class="email">{{ user.email }}</p>
              <span class="provider-badge" [class.microsoft]="user.provider === 'MICROSOFT'" [class.local]="user.provider === 'LOCAL'">
                {{ user.provider === 'MICROSOFT' ? 'Microsoft' : 'Local' }}
              </span>
            </div>
          </div>

          <div class="profile-details">
            <div class="detail-row">
              <label>ID Utilisateur :</label>
              <span>{{ user.id }}</span>
            </div>
            <div class="detail-row">
              <label>Email :</label>
              <span>{{ user.email }}</span>
            </div>
            <div class="detail-row">
              <label>Nom d'affichage :</label>
              <span>{{ user.displayName }}</span>
            </div>
            <div class="detail-row">
              <label>Fournisseur :</label>
              <span>{{ user.provider === 'MICROSOFT' ? 'Microsoft Entra ID' : 'Compte Local' }}</span>
            </div>
            <div class="detail-row">
              <label>Date de création :</label>
              <span>{{ user.createdAt | date:'medium' }}</span>
            </div>
          </div>

          <div *ngIf="user.claims" class="claims-section">
            <h3>Claims Microsoft Entra ID</h3>
            <div class="claims-grid">
              <div *ngFor="let claim of getClaimsArray(user.claims)" class="claim-item">
                <label>{{ claim.key }} :</label>
                <span>{{ claim.value }}</span>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="btn btn-primary" (click)="refreshProfile()">
              Actualiser le profil
            </button>
            <button class="btn btn-secondary" (click)="logout()">
              Déconnexion
            </button>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading">
            <div class="spinner"></div>
            <p>Chargement du profil...</p>
          </div>
        </ng-template>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </main>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: #f8f9fa;
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

    .nav-links {
      display: flex;
      gap: 1rem;
    }

    .main-content {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .avatar {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
    }

    .profile-info h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .email {
      margin: 0 0 1rem 0;
      opacity: 0.9;
    }

    .provider-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: bold;
    }

    .provider-badge.microsoft {
      background: #0078d4;
      color: white;
    }

    .provider-badge.local {
      background: #28a745;
      color: white;
    }

    .profile-details {
      padding: 2rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row label {
      font-weight: bold;
      color: #333;
      min-width: 150px;
    }

    .detail-row span {
      color: #666;
      word-break: break-all;
    }

    .claims-section {
      padding: 2rem;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
    }

    .claims-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .claims-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .claim-item {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .claim-item label {
      display: block;
      font-weight: bold;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .claim-item span {
      color: #666;
      word-break: break-all;
    }

    .actions {
      padding: 2rem;
      display: flex;
      gap: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #f5c6cb;
      margin-bottom: 1rem;
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
      color: white;
      border: 1px solid white;
    }

    .btn-outline:hover {
      background-color: white;
      color: #667eea;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.apiService.getMe().subscribe({
      next: (user) => {
        this.user = user;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du profil: ' + (error.error?.message || error.message);
      }
    });
  }

  refreshProfile() {
    this.loadProfile();
  }

  logout() {
    this.authService.logout();
  }

  getClaimsArray(claims: any): Array<{key: string, value: string}> {
    return Object.entries(claims).map(([key, value]) => ({
      key,
      value: String(value)
    }));
  }
}
