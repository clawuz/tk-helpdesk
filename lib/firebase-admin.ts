import admin from 'firebase-admin'

let app: admin.app.App

export function getAdminApp(): admin.app.App {
  if (!app) {
    app = admin.apps.length
      ? admin.apps[0]!
      : admin.initializeApp({
          credential: admin.credential.cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
          ),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        })
  }
  return app
}

export function getStorage() {
  return getAdminApp().storage().bucket()
}
