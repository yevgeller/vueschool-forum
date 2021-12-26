import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import firebase from "firebase";
import firebaseConfig from "@/config/firebase";

// Import the functions you need from the SDKs you need
//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDSQJy7zSih4ab8L519pKhHXkabw_kaepI",
//   authDomain: "vue-school-forum-b3085.firebaseapp.com",
//   projectId: "vue-school-forum-b3085",
//   storageBucket: "vue-school-forum-b3085.appspot.com",
//   messagingSenderId: "9582836868",
//   appId: "1:9582836868:web:a37c4f3c44a231e13496d1",
// };

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

const forumApp = createApp(App);
forumApp.use(router);
forumApp.use(store);

const requireComponent = require.context(
  "./components",
  true,
  /App[A-Z]\w+\.(vue|js)$/
);
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName);
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig;
  const baseComponentName =
    baseComponentConfig.name ||
    fileName.replace(/^.+\//, "").replace(/\.\w+$/, "");
  forumApp.component(baseComponentName, baseComponentConfig);
});

forumApp.mount("#app");
