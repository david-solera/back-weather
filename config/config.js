


module.exports = {
  ENV: process.env.ENV,
  dbInstance: process.env.dbInstance,
  dbUser: process.env.dbUser,
  dbPassword: process.env.dbPassword,
  dbHost: process.env.dbHost,
  dbPort: process.env.dbPort,
  dbDialect: process.env.dbDialect,
  identityMetadata: process.env.identityMetadata,
  clientID: process.env.clientID,
  redirectUrl: process.env.redirectUrl,
  clientSecret: process.env.clientSecret,
  destroySessionUrl: process.env.destroySessionUrl,
  databaseUri: process.env.databaseUri,  
  creds:creds,
  useMongoDBSessionStore: useMongoDBSessionStore,
  mongoDBSessionMaxAge: mongoDBSessionMaxAge,
  mailServiceType: process.env.mailServiceType,
  mailHost: process.env.mailHost,
  mailPort: process.env.mailPort,
  mailUser: process.env.mailUser,
  mailPass: process.env.mailPass,
  mailFrom: process.env.mailFrom,
  mailAdmin: process.env.mailAdmin
};