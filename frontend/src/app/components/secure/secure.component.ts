import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService, SecureData } from '../../services/api.service';

@Component({
  selector: 'app-secure',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="secure-container">
      <header class="header">
        <h1>Données Sécurisées</h1>
        <div class="nav-links">
          <a routerLink="/" class="btn btn-outline">Accueil</a>
          <a routerLink="/profile" class="btn btn-outline">Profil</a>
        </div>
      </header>

      <main class="main-content">
        <div *ngIf="secureData; else loading" class="secure-card">
          <div class="secure-header">
            <h2>🔒 Accès aux données protégées</h2>
            <p class="success-message">Vous avez accès aux données sécurisées !</p>
          </div>

          <div class="data-section">
            <h3>Informations de la requête</h3>
            <div class="data-item">
              <label>Message :</label>
              <span>{{ secureData.message }}</span>
            </div>
            <div class="data-item">
              <label>Timestamp :</label>
              <span>{{ secureData.timestamp | date:'medium' }}</span>
            </div>
          </div>

          <div *ngIf="secureData.user" class="user-section">
            <h3>Informations utilisateur</h3>
            <div class="user-info">
              <div class="user-detail">
                <label>ID :</label>
                <span>{{ secureData.user.id }}</span>
              </div>
              <div class="user-detail">
                <label>Email :</label>
                <span>{{ secureData.user.email }}</span>
              </div>
              <div class="user-detail">
                <label>Nom d'affichage :</label>
                <span>{{ secureData.user.displayName }}</span>
              </div>
              <div class="user-detail">
                <label>Fournisseur :</label>
                <span class="provider-badge" [class.microsoft]="secureData.user.provider === 'MICROSOFT'" [class.local]="secureData.user.provider === 'LOCAL'">
                  {{ secureData.user.provider === 'MICROSOFT' ? 'Microsoft' : 'Local' }}
                </span>
              </div>
            </div>
          </div>

          <div class="permissions-section">
            <h3>Données protégées</h3>
            <div class="data-item">
              <label>Secret :</label>
              <span class="secret">{{ secureData.data.secret }}</span>
            </div>
            <div class="data-item">
              <label>Permissions :</label>
              <div class="permissions">
                <span *ngFor="let permission of secureData.data.permissions" class="permission-badge">
                  {{ permission }}
                </span>
              </div>
            </div>
            <div class="data-item">
              <label>Expiration :</label>
              <span>{{ secureData.data.expiresAt | date:'medium' }}</span>
            </div>
          </div>

          <div class="actions">
            <button class="btn btn-primary" (click)="refreshData()">
              Actualiser les données
            </button>
            <button class="btn btn-secondary" (click)="logout()">
              Déconnexion
            </button>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading">
            <div class="spinner"></div>
            <p>Chargement des données sécurisées...</p>
          </div>
        </ng-template>

        <div *ngIf="errorMessage" class="error-message">
          <h3>❌ Erreur d'accès</h3>
          <p>{{ errorMessage }}</p>
          <div class="error-actions">
            <a routerLink="/" class="btn btn-primary">Retour à l'accueil</a>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .secure-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .header {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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

    .secure-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .secure-header {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .secure-header h2 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    .success-message {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .data-section,
    .user-section,
    .permissions-section {
      padding: 2rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .permissions-section:last-of-type {
      border-bottom: none;
    }

    .data-section h3,
    .user-section h3,
    .permissions-section h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.2rem;
    }

    .data-item {
      margin-bottom: 1rem;
    }

    .data-item label {
      display: block;
      font-weight: bold;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .data-item span {
      color: #666;
      word-break: break-all;
    }

    .secret {
      background: #f8f9fa;
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
      font-family: monospace;
    }

    .user-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .user-detail {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .user-detail label {
      display: block;
      font-weight: bold;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .user-detail span {
      color: #666;
      word-break: break-all;
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

    .permissions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .permission-badge {
      background: #007bff;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: bold;
    }

    .actions {
      padding: 2rem;
      display: flex;
      gap: 1rem;
      background: #f8f9fa;
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
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid #f5c6cb;
      text-align: center;
    }

    .error-message h3 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    .error-actions {
      margin-top: 1.5rem;
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
      color: #dc3545;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .user-info {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class SecureComponent implements OnInit {
  secureData: SecureData | null = null;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadSecureData();
  }

  loadSecureData() {
    this.apiService.getSecureData().subscribe({
      next: (data) => {
        this.secureData = data;
        this.errorMessage = '';
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Vous devez être connecté pour accéder à ces données.';
        } else {
          this.errorMessage = 'Erreur lors du chargement des données: ' + (error.error?.message || error.message);
        }
      }
    });
  }

  refreshData() {
    this.loadSecureData();
  }

  logout() {
    this.authService.logout();
  }
}
