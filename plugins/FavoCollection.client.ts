import { defineNuxtPlugin } from '#app'
import { useFirebase } from '~/compositions/Firebase'
import { Cripto } from '~/class/Cripto'
import { ApiClient } from '~/class/ApiClient'
import EventEmitter from 'events'

import { METHOD_TYPE,APICALLBACK, FavoCollectionType, ApiTask } from '~/class/types/FavoCollectionType'

import { getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  TwitterAuthProvider,
  User
} from "firebase/auth";

declare module '#app' {
  interface NuxtApp {
    $favo:FavoCollectionType
//    $hello(message: string): void
  }
}

//const ApiRoot = process.env.API_ROOT
const ApiRoot = 'http://localhost:3000/api/'

class FavoCollection extends EventEmitter {
  private firebase:any = null
  private initialized:boolean = false
  cripto:any = null
  api:any = null

  private token:string = null
  private user:User = null

  private oauthSession = false
  isCheckIn:boolean = false

  usersTaskQueue:ApiTask[] = [];

  postHeader:HeadersInit = []
  getHeader:HeadersInit = []

  constructor( fb = null ) {
    super();
    this.firebase = fb
    this.cripto = new Cripto()
  }

  checkin(cnt = 0) {
    this.getRequest('checkin')
    .then(data => {
      console.log('Success:', data);
      if(data.result === 'request reauth') {
        if(this.oauthSession && cnt < 2) {
          cnt++
          setTimeout(()=>this.checkin(cnt),100*cnt)
        } else {
          this.emit('onRequestReAuth');
        }
      } else if(data.result === 'ok') {
        this.isCheckIn = true
        let task:ApiTask;
        while((task = this.usersTaskQueue.shift()) !== undefined) {
          this.executeApiTask(task)
        }
      }
    })
  }

  initFbEvents() {
    if(this.initialized)return;
    
    let auth = getAuth();
    onAuthStateChanged(auth, async (user) => {

      console.log('auth state changed', user)
      this.user = user

      if (user) {

          this.updateToken(await user.getIdToken())

          this.checkin()
          
      } else {
        this.token = null
      }

      this.emit('onAuthStateChanged', user);
    });
    this.initialized = true;
  }

  signin() {
    let auth = getAuth();
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
          this.oauthSession = true

          const credential = TwitterAuthProvider.credentialFromResult(result);

          const user = result.user;
          console.log('login success')

          this.updateToken(await user.getIdToken())

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

  signout() {
    let auth = getAuth();
    signOut(auth)
      .then((res)=>{
        console.log(res);
      }).catch((e)=>{
        console.log(e);
      })
  }

  private executeApiTask(task:ApiTask) {
    switch(task.method) {
      case METHOD_TYPE.GET:
        this.getRequest(task.url, task.data)
          .then(task.callback)
        break
      case METHOD_TYPE.POST:
        this.postRequest(task.url, task.data??{})
          .then(task.callback)
        break;
    }
  }

  usersRequest(url:string, method:METHOD_TYPE, data:object|null, cb:APICALLBACK) {
    if(this.isCheckIn) {
      this.executeApiTask({url,method,data,callback:cb})
    } else {
      this.usersTaskQueue.push({url,method,data,callback:cb})
    }
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

  getRequest(endpoint:string, data:any|boolean = false) {
    if(!this.user)alert('user notfound');
    if(!this.api)this.initApi();

    const query_params = data ? '?' +(new URLSearchParams(data)) : ''; 
    this.api.setHeaders(this.getHeader)
    return this.api.request(
      'GET',
      endpoint+query_params
    )
    .then(response => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
    
  }

  /*fetch(url:string, data:any = {}) {
    const query_params = data ? new URLSearchParams(data) : ''; 
    return fetch(
        url+'?'+query_params,
        {
            method:'GET',
            mode: 'cors',
            headers: {
              'Content-Type':'application/json',
              'Accept':'application/json',
              'Origin':
            }
        }
    )
    .then(response => response.json)
  }*/

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

  private updateToken(token:string) {
    this.token = token;
    this.postHeader['Authorization'] = 'Bearer ' + this.token
    this.getHeader['Authorization'] = 'Bearer ' + this.token
  }
} 
export default defineNuxtPlugin((nuxtApp) => {
    let fb:any = useFirebase();

    nuxtApp.provide('favo', new FavoCollection(fb))
//    nuxtApp.provide('hello', (msg) => `Hello ${msg}!`)
  })
