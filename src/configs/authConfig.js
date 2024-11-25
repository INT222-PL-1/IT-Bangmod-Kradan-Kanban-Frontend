export const msalConfig = {
  auth: {
    clientId: '67fe1c4b-efd8-4f69-94d8-08e67f2c4c60',
    authority: 'https://login.microsoftonline.com/79845616-9df0-43e0-8842-e300feb2642a',
    redirectUri: window.location.origin + '/pl1/login',
    postLogoutUri: window.location.origin + '/pl1/login',
  },
  cache: {
    // cacheLocation: 'sessionStorage',
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  }
}

export const graphScopes = {
  scopes: ['User.ReadBasic.All', 'openid', 'offline_access', '67fe1c4b-efd8-4f69-94d8-08e67f2c4c60/access_as_user']
}
