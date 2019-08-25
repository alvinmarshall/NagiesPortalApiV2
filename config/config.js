if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

module.exports = {
  dbConfig: {
    host: process.env.HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USR,
    password: process.env.DB_PWD
  },
  jwtConfig: {
    secret: process.env.JWT_KEY
  },

  serviceKey: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_URL
  }
};
