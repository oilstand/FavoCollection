import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth,
    signInWithRedirect,
    signInWithPopup,
    TwitterAuthProvider,
    reauthenticateWithCredential,
    onAuthStateChanged,
    reauthenticateWithPopup
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD_ohRLE6Ry-sUPvHV9BlrCTFq2oPzmx88",
    authDomain: "favocollection.firebaseapp.com",
    projectId: "favocollection",
    storageBucket: "favocollection.appspot.com",
    messagingSenderId: "140336621318",
    appId: "1:140336621318:web:fbb32ea68d484d384aa087",
    measurementId: "G-3RZ2NT81F4"
};
export const useFirebase = () => {
    
    return getApps().length == 0
        ? (()=>{ 
            let app = initializeApp(firebaseConfig)
            getAnalytics(app)
            return app;
            })()
        : getApp();
/*    if(getApps().length == 0) {
        console.log("initialize firebase")
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
    } else {
        console.log("already firebase initialized")
    }
    
    const provider = new TwitterAuthProvider();

    provider.setCustomParameters({
        'lang': 'ja'
      });

    const auth = getAuth();*/
    /*signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            const credential = TwitterAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const secret = credential.secret;

            // The signed-in user info.
            const user = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = TwitterAuthProvider.credentialFromError(error);
            // ...
        });*/

    /*return {
        //TwitterAuthProvider,
        signInWithPopup,
        reauthenticateWithCredential,
        onAuthStateChanged,
        signInWithRedirect,
        reauthenticateWithPopup,
        //provider,
        //auth
    }*/

}