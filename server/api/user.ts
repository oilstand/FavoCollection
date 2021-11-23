import type { IncomingMessage, ServerResponse } from 'http'
import { useBody, createApp } from 'h3'
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Cripto } from '~/class/Cripto'

import { useDatastore } from '~/compositions/DSClient';
import { DSUser } from '~/class/models/DSUser';

/*
import { useTwitter } from '~/compositions/TwitterClient'
import { useDatastore } from '~/compositions/Datastore'

import { getApp } from '@firebase/app';
import {
  getEncryptedString,
  getDecriptedString,
  byteDecode
} from '~/compositions/Cripto'*/

//const app = createApp()
//app.use('/test', () => 'Hello world!')

export default async (req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200

  const body = await useBody(req)
  console.log(Object.keys(body))

  for (const [key, value] of Object.entries(body)) {
    console.log(`${key}: ${value}`);
  }

  console.log('here is server')

  //console.log(req.headers)
  let authHeader = req.headers.authorization
  if(req.headers.authorization && req.headers.authorization.indexOf('Bearer ') != -1) {
    const bearerToken = req.headers.authorization.slice(7)
    console.log(bearerToken)


    if(getApps().length === 0) {
      initializeApp({projectId:'favocollection'}/**/)
    }
    const auth = getAuth()
    const verifyData = await auth.verifyIdToken(bearerToken)
      .then((decodeToken) => {
        //console.log(decodeToken)
        return decodeToken
      })

    console.log(verifyData);

    if(body.token && body.secret) {
      const cripto = new Cripto();
      console.log('token:'+ cripto.decrypt(body.token, verifyData.uid.slice(-10)))
      console.log('secret:'+ cripto.decrypt(body.secret, verifyData.uid.slice(-10)))

      const ds = useDatastore();

      const user = new DSUser(ds)
      user.setKey(verifyData.uid)
      user.set(DSUser.TOKEN, body.token);
      user.set(DSUser.SECRET, body.secret);
      user.save();
  
    }



  }




  /*//console.log(req.headers)
  let authHeader = req.headers.authorization
  if(req.headers.authorization && req.headers.authorization.indexOf('Bearer ') != -1) {
    const bearerToken = req.headers.authorization.slice(7)
    //console.log(bearerToken)

    if(getApps().length === 0) {
      initializeApp({projectId:'tweetcollection'})
    }
    const auth = getAuth()
    const verifyData = await auth.verifyIdToken(bearerToken)
      .then((decodeToken) => {
        //console.log(decodeToken)
        return decodeToken
      })

    if(body.token1 && body.token2) {
      let token = byteDecode(getDecriptedString(body.token1))
      let secret = byteDecode(getDecriptedString(body.token2))

      let client = useDatastore()

      let key = client.key(['user',verifyData.uid])
    
      let entity = {
        key: key,
        data: { 
          'token1':body.token1,
          'token2':body.token2
        },
        excludeFromIndexes: ['token1','token2']
      }
    
      client.save(entity)
    

    } else {
      let client = useDatastore()
      let key = client.key(['user',verifyData.uid])
      client.get(key, (err, entity) => {
        useTwitter(
          byteDecode(getDecriptedString(entity.token1)),
          byteDecode(getDecriptedString(entity.token2))
        )
      })
    }

  }/** */

  //console.log(req.url)

  // ds test
  //let client = useDatastore()

  return {test:"hogehuga"}//body
}/**/