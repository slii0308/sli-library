// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCx59Zz_qCJyFREnOREjhJzYJxssELCB3I',
  authDomain: 'sli-library.firebaseapp.com',
  projectId: 'sli-library',
  storageBucket: 'sli-library.firebasestorage.app',
  messagingSenderId: '768078067361',
  appId: '1:768078067361:web:ee2ba5e20ff7fd6baf22e0',
}

// Initialize Firebase
initializeApp(firebaseConfig)
const db = getFirestore()
export default db
