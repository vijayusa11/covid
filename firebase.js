import firebase from 'firebase';

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyCwfbuxtTfKlw98WbOBFSpjR2PoQ4ScaWw",
    authDomain: "covid-vijay.firebaseapp.com",
    projectId: "covid-vijay",
    storageBucket: "covid-vijay.appspot.com",
    messagingSenderId: "306674168205",
    appId: "1:306674168205:web:74847690dfa377dbea4dc4",
    measurementId: "G-HJSXE95XY6"
  });

  const db = firebaseApp.firestore();

  export default db;

  const auth = firebase.auth();

  const storage = firebase.storage();

  const provider = new firebase.auth.GoogleAuthProvider();

  export { auth, storage, provider };