# Configuration Microsoft Entra ID

Guide pas-à-pas pour configurer Microsoft Entra ID (Azure Active Directory) pour l'authentification OIDC PKCE.

## 🎯 Objectif

Configurer une App Registration dans Azure Portal pour permettre l'authentification Microsoft dans l'application Angular avec le flow OIDC PKCE.

## 📋 Pré-requis

- Compte Azure avec accès à Azure Portal
- Tenant Azure Active Directory
- Permissions pour créer des App Registrations

## 🔧 Configuration Azure Portal

### Étape 1 : Créer l'App Registration

1. **Accéder à Azure Portal**
   - URL : https://portal.azure.com
   - Se connecter avec votre compte Azure

2. **Naviguer vers Entra ID**
   - Rechercher "Entra ID" ou "Azure Active Directory"
   - Cliquer sur "Azure Active Directory"

3. **Créer une nouvelle App Registration**
   - Dans le menu de gauche, cliquer sur "App registrations"
   - Cliquer sur "New registration"

4. **Configurer l'App Registration**
   ```
   Name: spring-angular-entra-poc-SPA
   Supported account types: Accounts in this organizational directory only
   Redirect URI: 
     - Platform: Single-page application (SPA)
     - URI: http://localhost:4200/auth/callback
   ```

5. **Créer l'application**
   - Cliquer sur "Register"

### Étape 2 : Configurer les Redirect URIs

1. **Dans l'App Registration créée**
   - Aller dans "Authentication" (menu de gauche)

2. **Ajouter les Redirect URIs**
   ```
   Single-page application:
   - http://localhost:4200/auth/callback
   - http://localhost:4200/ (pour logout)
   
   (Optionnel pour production):
   - https://votre-domaine.com/auth/callback
   - https://votre-domaine.com/
   ```

3. **Configurer les Logout URLs**
   ```
   Front-channel logout URL: http://localhost:4200/
   ```

4. **Sauvegarder**
   - Cliquer sur "Save"

### Étape 3 : Configurer les Permissions API

1. **Aller dans "API permissions"**
   - Cliquer sur "Add a permission"

2. **Ajouter les permissions Microsoft Graph**
   ```
   Microsoft Graph:
   - Delegated permissions:
     * openid (Connect and sign in)
     * profile (View users' basic profile)
     * email (View users' email address)
   ```

3. **Accorder le consentement**
   - Cliquer sur "Grant admin consent" (si vous êtes admin)

### Étape 4 : Récupérer les Informations de Configuration

1. **Overview de l'App Registration**
   - Copier les informations suivantes :

2. **Informations à récupérer**
   ```
   Application (client) ID: [VOTRE_CLIENT_ID]
   Directory (tenant) ID: [VOTRE_TENANT_ID]
   Issuer URI: https://login.microsoftonline.com/[TENANT_ID]/v2.0
   ```

## 🔐 Variables d'Environnement

Créer un fichier `.env` dans le dossier `frontend/` :

```env
# Microsoft Entra ID Configuration
MSAL_CLIENT_ID=your_client_id_here
MSAL_TENANT_ID=your_tenant_id_here
MSAL_AUTHORITY=https://login.microsoftonline.com/your_tenant_id_here
MSAL_REDIRECT_URI=http://localhost:4200/auth/callback
MSAL_POST_LOGOUT_REDIRECT_URI=http://localhost:4200/

# API Configuration
API_BASE_URL=http://localhost:8080
```

## 🔧 Configuration Backend (Optionnel)

### Si vous voulez des scopes API personnalisés :

1. **Créer une seconde App Registration**
   ```
   Name: spring-angular-entra-poc-API
   Type: Web API
   ```

2. **Exposer une API**
   - Dans l'App Registration API
   - Aller dans "Expose an API"
   - Cliquer sur "Add a scope"
   - Configurer :
     ```
     Scope name: access_as_user
     Who can consent: Admins and users
     Admin consent display name: Access spring-angular-entra-poc-API
     Admin consent description: Allow the app to access spring-angular-entra-poc-API on behalf of the signed-in user.
     User consent display name: Access spring-angular-entra-poc-API
     User consent description: Allow the application to access spring-angular-entra-poc-API on your behalf.
     State: Enabled
     ```

3. **Configurer les permissions**
   - Dans l'App Registration SPA
   - Ajouter une permission pour l'API :
     ```
     My APIs > spring-angular-entra-poc-API > access_as_user
     ```

## ✅ Checklist de Validation

### Configuration SPA
- [ ] App Registration "spring-angular-entra-poc-SPA" créée
- [ ] Type "Single-page application" sélectionné
- [ ] Redirect URI `http://localhost:4200/auth/callback` configuré
- [ ] Logout URL `http://localhost:4200/` configuré
- [ ] Permissions Microsoft Graph ajoutées (openid, profile, email)
- [ ] Client ID et Tenant ID récupérés

### Variables d'Environnement
- [ ] Fichier `.env` créé dans `frontend/`
- [ ] Toutes les variables MSAL configurées
- [ ] URL de l'API backend configurée

### Test de Configuration
- [ ] Application Angular démarre sans erreur
- [ ] Bouton "Sign in with Microsoft" fonctionne
- [ ] Redirection vers Microsoft fonctionne
- [ ] Callback fonctionne après authentification
- [ ] Token JWT reçu et valide

## 🚨 Points d'Attention

### Sécurité
- **Ne jamais commiter** les fichiers `.env` avec les vraies clés
- Utiliser des variables d'environnement en production
- Limiter les scopes aux besoins minimums

### Développement
- Les redirect URIs doivent correspondre exactement
- Le tenant ID doit être correct
- Vérifier que les permissions sont accordées

### Production
- Configurer des URLs de production
- Utiliser HTTPS uniquement
- Configurer les CORS appropriés

## 🔍 Dépannage

### Erreurs Courantes

1. **"AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application"**
   - Vérifier que l'URL de redirection correspond exactement
   - S'assurer qu'il n'y a pas d'espaces ou de caractères spéciaux

2. **"AADSTS65001: The user or administrator has not consented to use the application"**
   - Accorder le consentement administrateur
   - Vérifier les permissions configurées

3. **"AADSTS700016: Application with identifier was not found in the directory"**
   - Vérifier le Client ID
   - S'assurer que l'App Registration est dans le bon tenant

### Logs et Debug
- Utiliser les outils de développement du navigateur
- Vérifier les logs dans Azure Portal > App registrations > Sign-in logs
- Utiliser MSAL.js en mode debug

## 📚 Ressources

- [Documentation MSAL.js](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications)
- [Guide OIDC PKCE](https://tools.ietf.org/html/rfc7636)
- [Azure Portal - App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)
- [Microsoft Graph Permissions](https://docs.microsoft.com/en-us/graph/permissions-reference)
