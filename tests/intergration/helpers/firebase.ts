import * as firebase from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../../../firebase-config.json';

firebase.initializeApp(firebaseConfig);

export default firebase;
export const auth = getAuth();

export const signIn = () => {
  return signInWithEmailAndPassword(
    auth,
    process.env.TEST_ACCOUNT_EMAIL!,
    process.env.TEST_ACCOUNT_PASSWORD!,
  );
};

export const getIdToken = (): Promise<string> | undefined =>
  auth.currentUser?.getIdToken();
