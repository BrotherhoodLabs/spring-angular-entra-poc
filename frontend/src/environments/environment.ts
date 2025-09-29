export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: 'your-client-id-here',
      authority: 'https://login.microsoftonline.com/your-tenant-id-here',
      redirectUri: 'http://localhost:4200/auth/callback',
      postLogoutRedirectUri: 'http://localhost:4200/'
    },
    cache: {
      cacheLocation: 'memory',
      storeAuthStateInCookie: false
    }
  },
  apiConfig: {
    scopes: ['openid', 'profile', 'email'],
    uri: 'http://localhost:8080'
  }
};
