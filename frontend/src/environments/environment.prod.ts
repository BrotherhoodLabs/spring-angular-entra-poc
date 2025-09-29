export const environment = {
  production: true,
  msalConfig: {
    auth: {
      clientId: 'your-client-id-here',
      authority: 'https://login.microsoftonline.com/your-tenant-id-here',
      redirectUri: 'https://your-domain.com/auth/callback',
      postLogoutRedirectUri: 'https://your-domain.com/'
    },
    cache: {
      cacheLocation: 'memory',
      storeAuthStateInCookie: false
    }
  },
  apiConfig: {
    scopes: ['openid', 'profile', 'email'],
    uri: 'https://your-api-domain.com'
  }
};
