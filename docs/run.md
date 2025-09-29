# Guide de Démarrage - Spring Angular Entra PoC

## 🚀 Démarrage Rapide

### Pré-requis

- **Java 21+** pour le backend
- **Node.js 18+** et npm pour le frontend
- **Docker** et **Docker Compose** (optionnel)
- **Compte Microsoft Azure** avec accès à Entra ID

### 1. Configuration Microsoft Entra ID

Avant de démarrer l'application, vous devez configurer Microsoft Entra ID :

1. Suivez le guide [Configuration Entra ID](entra-setup.md)
2. Récupérez votre `Client ID` et `Tenant ID`
3. Configurez les variables d'environnement

### 2. Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```bash
# Copiez le fichier d'exemple
cp env.example .env
```

Éditez le fichier `.env` avec vos valeurs :

```env
# Microsoft Entra ID Configuration
MSAL_CLIENT_ID=your-actual-client-id
MSAL_TENANT_ID=your-actual-tenant-id
JWT_ISSUER_URI=https://login.microsoftonline.com/your-tenant-id/v2.0

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:4200

# API Configuration
API_BASE_URL=http://localhost:8080
```

### 3. Démarrage avec Docker Compose (Recommandé)

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

**URLs disponibles :**
- Frontend : http://localhost:4200
- Backend API : http://localhost:8080
- Health Check : http://localhost:8080/actuator/health

### 4. Démarrage en Mode Développement

#### Backend (Spring Boot)

```bash
cd backend

# Installer les dépendances et démarrer
./mvnw spring-boot:run

# Ou avec Java directement
./mvnw clean package
java -jar target/*.jar
```

#### Frontend (Angular)

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer en mode développement
npm start

# Ou avec ng CLI
ng serve
```

## 🔧 Configuration Avancée

### Base de Données

#### H2 (Développement - Par défaut)
- URL : http://localhost:8080/h2-console
- JDBC URL : `jdbc:h2:mem:testdb`
- Username : `sa`
- Password : `password`

#### PostgreSQL (Production)

```bash
# Démarrer avec PostgreSQL
docker-compose --profile production up -d

# Variables d'environnement pour PostgreSQL
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/spring_angular_entra
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

### Profils Spring Boot

```bash
# Développement (H2)
./mvnw spring-boot:run -Dspring.profiles.active=dev

# Production (PostgreSQL)
./mvnw spring-boot:run -Dspring.profiles.active=prod

# Docker
./mvnw spring-boot:run -Dspring.profiles.active=docker
```

### Configuration Frontend

#### Variables d'environnement Angular

Créez `frontend/src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: 'your-client-id',
      authority: 'https://login.microsoftonline.com/your-tenant-id',
      redirectUri: 'http://localhost:4200/auth/callback',
      postLogoutRedirectUri: 'http://localhost:4200/'
    }
  },
  apiConfig: {
    scopes: ['openid', 'profile', 'email'],
    uri: 'http://localhost:8080'
  }
};
```

## 🧪 Tests

### Tests Backend

```bash
cd backend

# Tous les tests
./mvnw test

# Tests avec couverture
./mvnw test jacoco:report

# Tests d'intégration
./mvnw test -Dspring.profiles.active=test
```

### Tests Frontend

```bash
cd frontend

# Tests unitaires
npm run test

# Tests e2e
npm run e2e

# Linting
npm run lint
```

## 🔍 Débogage

### Logs Backend

```bash
# Activer les logs debug
export LOGGING_LEVEL_COM_BROTHERHOODLABS=DEBUG
export LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_SECURITY=DEBUG

./mvnw spring-boot:run
```

### Logs Docker

```bash
# Logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost:4200/health
```

## 🚨 Dépannage

### Erreurs Courantes

#### 1. Erreur CORS

```
Access to XMLHttpRequest at 'http://localhost:8080/api/me' from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solution :** Vérifiez que `CORS_ALLOWED_ORIGINS` inclut `http://localhost:4200`

#### 2. Token JWT Invalide

```
JWT token is invalid or expired
```

**Solution :** 
- Vérifiez que `JWT_ISSUER_URI` est correct
- Vérifiez que votre Client ID est correct
- Vérifiez que l'utilisateur est bien connecté

#### 3. Erreur de Connexion Microsoft

```
AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application
```

**Solution :** Vérifiez que l'URL de redirection dans Azure correspond à `http://localhost:4200/auth/callback`

#### 4. Erreur de Base de Données

```
Unable to connect to database
```

**Solution :**
- Vérifiez que PostgreSQL est démarré (si utilisé)
- Vérifiez les variables d'environnement de base de données
- Vérifiez les permissions de la base de données

### Commandes Utiles

```bash
# Nettoyer et reconstruire
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Vérifier les conteneurs
docker-compose ps

# Accéder au conteneur backend
docker-compose exec backend bash

# Voir les logs en temps réel
docker-compose logs -f --tail=100
```

## 📊 Monitoring

### Métriques Backend

- **Health Check** : http://localhost:8080/actuator/health
- **Info** : http://localhost:8080/actuator/info
- **Métriques** : http://localhost:8080/actuator/metrics

### Métriques Frontend

- **Health Check** : http://localhost:4200/health
- **Console DevTools** : F12 → Console

## 🔐 Sécurité

### Variables Sensibles

Ne jamais commiter :
- Fichiers `.env`
- Clés API
- Secrets JWT
- Mots de passe

### Bonnes Pratiques

1. **Utilisez HTTPS en production**
2. **Limitez les scopes Microsoft aux besoins**
3. **Configurez CORS strictement**
4. **Utilisez des secrets managers en production**
5. **Activez les logs de sécurité**

## 📚 Ressources

- [Documentation Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Documentation Angular](https://angular.io/docs)
- [Documentation MSAL](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [Documentation Docker](https://docs.docker.com/)
- [Configuration Entra ID](entra-setup.md)
- [Architecture](architecture.md)
- [API Endpoints](endpoints.md)
