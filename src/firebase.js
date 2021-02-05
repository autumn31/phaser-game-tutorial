import firebase from "firebase/app";
import "firebase/database";

var firebaseConfig = {
  apiKey: "AIzaSyC_gXJRF52IfHKx91UONw9rjcHr0xt3NYM",
  authDomain: "my-first-fire-base-2757a.firebaseapp.com",
  databaseURL: "https://my-first-fire-base-2757a.firebaseio.com",
  projectId: "my-first-fire-base-2757a",
  storageBucket: "my-first-fire-base-2757a.appspot.com",
  messagingSenderId: "908783027938",
  appId: "1:908783027938:web:bc2a1f7099d9f130f700bb",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export var database = firebase.database();
