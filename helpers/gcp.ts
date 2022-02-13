// # sourceMappingURL=gcp.js.map
import * as admin from 'firebase-admin';
import credential from '../firebase-admin-credential.json';

export const firebaseAdmin = (): admin.app.App => {
  if (admin.apps.length) {
    // @ts-ignore
    return admin;
  }
  admin.initializeApp({
    credential: admin.credential.cert(credential as admin.ServiceAccount),
  });
  // @ts-ignore
  return admin;
};

// Declared at cold-start, but only initialized if/when the function executes
let lazyFirestore: admin.firestore.Firestore;
export const firestore = (): admin.firestore.Firestore => {
  if (!lazyFirestore) {
    lazyFirestore = firebaseAdmin().firestore();
    return lazyFirestore;
  }
  return lazyFirestore;
};
