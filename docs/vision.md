# Vision & Portée - Spring Angular Entra PoC

## 🎯 Vision

Démontrer l'intégration d'un système d'authentification moderne et sécurisé combinant l'authentification locale traditionnelle avec l'authentification fédérée Microsoft Entra ID, dans une architecture microservices avec Angular et Spring Boot.

## 🎪 Objectifs

### Objectif Principal
Permettre aux utilisateurs de s'authentifier de deux manières :

**(A) Comptes Locaux**
- Création de compte via formulaire web (email + password + profil minimal)
- Gestion sécurisée des mots de passe avec hash BCrypt
- Validation des emails uniques
- Interface utilisateur intuitive pour l'inscription

**(B) Authentification Microsoft Entra ID**
- Connexion via Microsoft (OpenID Connect / Entra ID)
- Implémentation côté Angular avec OIDC PKCE (Proof Key for Code Exchange)
- Intégration transparente avec l'écosystème Microsoft
- Single Sign-On (SSO) pour les organisations

**(C) API Sécurisée**
- Endpoints protégés côté Spring Boot (Resource Server JWT)
- Validation des tokens JWT Microsoft
- Accès aux données sensibles uniquement pour les utilisateurs authentifiés
- Architecture stateless et scalable

## 📏 Portée du PoC

### ✅ Dans le périmètre

#### Fonctionnalités Core
- **Validation de formulaire** complète (frontend + backend)
- **Hash sécurisé** des mots de passe (BCrypt avec salt)
- **Gestion des emails uniques** (contrainte base de données)
- **Login Microsoft** avec OIDC PKCE
- **Page profil** affichant les informations utilisateur
- **Endpoint sécurisé** accessible uniquement avec token valide

#### Sécurité
- **CORS** strictement configuré
- **Tokens JWT** stockés en mémoire uniquement
- **Scopes Microsoft** limités aux besoins essentiels
- **Validation** des données d'entrée (Bean Validation)

#### Architecture
- **Frontend Angular** avec MSAL
- **Backend Spring Boot** avec OAuth2 Resource Server
- **Base de données** H2 (dev) / PostgreSQL (optionnel)
- **Docker** pour la containerisation

### ❌ Hors périmètre

#### Fonctionnalités avancées
- **RBAC (Role-Based Access Control)** avancé
- **Vérification email** avec SMTP
- **MFA (Multi-Factor Authentication)**
- **Gestion des rôles** complexes
- **Audit trail** détaillé

#### Infrastructure production
- **Load balancing**
- **Monitoring** avancé (Prometheus, Grafana)
- **Logs centralisés** (ELK Stack)
- **Secrets management** (Azure Key Vault)
- **High availability**

## 🎭 Personas

### Utilisateur Final
- **Développeur** souhaitant comprendre l'intégration OIDC
- **Architecte** évaluant les solutions d'authentification
- **Étudiant** apprenant les concepts de sécurité modernes

### Utilisateur Technique
- **Développeur Full-Stack** implémentant l'authentification
- **DevOps** déployant l'infrastructure
- **Security Engineer** validant la sécurité

## 🎯 Critères de Succès

### Fonctionnels
- [ ] Création de compte local fonctionnelle
- [ ] Connexion Microsoft Entra ID opérationnelle
- [ ] Accès aux endpoints protégés avec token valide
- [ ] Interface utilisateur intuitive et responsive
- [ ] Gestion d'erreurs appropriée

### Techniques
- [ ] Architecture scalable et maintenable
- [ ] Code bien documenté et testé
- [ ] Sécurité conforme aux bonnes pratiques
- [ ] Déploiement Docker fonctionnel
- [ ] CI/CD pipeline opérationnel

### Qualité
- [ ] Documentation complète et à jour
- [ ] Tests unitaires et d'intégration
- [ ] Performance acceptable (< 2s de chargement)
- [ ] Accessibilité de base (WCAG 2.1 AA)

## 🚀 Valeur Business

### Démonstration
- **Proof of Concept** pour l'intégration Microsoft Entra ID
- **Référence** pour les futurs projets d'authentification
- **Base** pour la formation des équipes

### Apprentissage
- **Bonnes pratiques** de sécurité
- **Patterns** d'authentification moderne
- **Intégration** d'écosystèmes Microsoft

### Réutilisabilité
- **Template** pour les nouveaux projets
- **Composants** réutilisables
- **Documentation** de référence

## 🔮 Vision Future

### Court terme (3 mois)
- Tests automatisés complets
- Documentation technique détaillée
- Déploiement en environnement de staging

### Moyen terme (6 mois)
- Extension multi-tenant
- Support d'autres providers (Google, GitHub)
- Interface d'administration

### Long terme (1 an)
- Production ready
- Monitoring et observabilité
- Scaling horizontal
- Intégration avec d'autres services

## 📊 Métriques

### Adoption
- Nombre de connexions Microsoft vs locales
- Temps de connexion moyen
- Taux d'erreur d'authentification

### Performance
- Temps de réponse des API
- Utilisation des ressources
- Disponibilité du service

### Qualité
- Couverture de tests
- Nombre de bugs critiques
- Satisfaction utilisateur

## 🎪 Conclusion

Ce PoC vise à démontrer la faisabilité et la valeur d'une solution d'authentification hybride moderne, servant de fondation pour les futurs projets de l'organisation tout en fournissant une expérience d'apprentissage riche pour l'équipe.
