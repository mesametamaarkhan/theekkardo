// firebase-config.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyB2YLa6MTzB9u2p33Ucx8NqW3UTWY9bC_U",
    authDomain: "theekkardo-notify.firebaseapp.com",
    projectId: "theekkardo-notify",
    messagingSenderId: "269934520164",
    appId: "1:269934520164:web:9ff86ccd7c25984500fc71",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
