import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';

import ReduxSagaFirebase from 'redux-saga-firebase'

import { firebaseConfig } from '../constants/defaultValues';

const myFirebaseApp = firebase.initializeApp(firebaseConfig);

const reduxSagaFirebase = new ReduxSagaFirebase(myFirebaseApp)

const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();
const firestore = firebase.firestore();

export { auth, database, storage, firestore, reduxSagaFirebase };
