import { defineNuxtPlugin } from '#app'
import { useFirebase } from '~/compositions/Firebase'
import { Cripto } from '~/class/Cripto'
import { ApiClient } from '~/class/ApiClient'

import { DSClinet } from '~/compositions/DSClient'

import { getAuth,
  signInWithPopup,
  onAuthStateChanged,
  TwitterAuthProvider,
  User
} from "firebase/auth";

declare module '#app' {
  interface NuxtApp {
    $hello(message: string): void
  }
}

//const ApiRoot = process.env.API_ROOT
const ApiRoot = 'http://localhost:3000/api/'

class FavoCollection {
  firebase:any = null
  initialized:boolean = false
  cripto:any = null
  api:any = null

  token:string = null
  user:User = null

  postHeader:HeadersInit = []
  getHeader:HeadersInit = []

  constructor( fb = null ) {
    this.firebase = fb
    this.cripto = new Cripto()
  }
  initFbEvents() {
    if(this.initialized)return;
    
    let auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      console.log('auth state changed', user)
      if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;

          console.log(uid)

          this.user = user

          this.token = await user.getIdToken()

          this.postRequest('user',{uid})
          .then(data => {
            console.log('Success:', data);
          })
          
          //const dsc = new DSClinet();
          //dsc.getUser(uid)
      

      } else {
        this.user = null
        this.token = null
          // User is signed out
          // ...
      }
    });
    this.initialized = true;
  }

  signin() {
    let auth = getAuth();
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          const credential = TwitterAuthProvider.credentialFromResult(result);
          //const token = credential.accessToken;
          //const secret = credential.secret;

          // The signed-in user info.
          const user = result.user;
          console.log('login success')

          this.token = await user.getIdToken()
          //console.log('token:'+credential.accessToken)
          //console.log('secret:'+credential.secret)

          this.postRequest('user',{
            token:this.cripto.encrypt(credential.accessToken, user.uid.slice(-10)),
            secret:this.cripto.encrypt(credential.secret, user.uid.slice(-10))
          })
          .then(data => {
            console.log('Success:', data);
          })
      }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = TwitterAuthProvider.credentialFromError(error);
          // ...
      });
  }

  postRequest(endpoint:string, data:object) {
    if(!this.user)alert('user notfound');
    if(!this.api)this.initApi();

    this.api.setHeaders(this.postHeader)
    return this.api.request(
      'POST',
      endpoint,
      data
    )
    .then(response => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
    
  }

  initApi() {
    if(this.api)return;
    this.api = new ApiClient(ApiRoot);

    this.postHeader = {}
    this.postHeader['Content-Type'] = 'application/json'
    this.postHeader['Accept'] = 'application/json'
    this.postHeader['Authorization'] = 'Bearer ' + this.token

    this.getHeader = {}
    this.getHeader['Accept'] = 'application/json'
    this.getHeader['Authorization'] = 'Bearer ' + this.token
  }
} 
export default defineNuxtPlugin((nuxtApp) => {

    console.log("this message logged from plugin favocollection")

    let fb:any = null;
    if(process.client) {
      fb = useFirebase()
    }

    nuxtApp.provide('favo', new FavoCollection(fb))
    nuxtApp.provide('hello', (msg) => `Hello ${msg}!`)
  })
