import type { IncomingMessage, ServerResponse } from 'http'
import { useBody, createApp } from 'h3'
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { Cripto } from '~/class/Cripto'

import { useDatastore,DSClinet } from '~/class/DSClient';
import { DSUser } from '~/class/models/DSUser';
import { useTwitter } from '~/class/TwitterClient'
//import { TwitterClient } from 'twitter-api-client';
//import { TwitterApi } from 'twitter-api-v2';
import url from 'url';

declare module 'http' {
  interface IncomingMessage {
    verifyData:DecodedIdToken;
  }
}
const getFavoList = async (verifyData:DecodedIdToken,screen_name:string,id:string) => {
  const dsc = new DSClinet();
  const user = await dsc.getUser(verifyData.uid)

  if(user) {
    const cripto = new Cripto();
    let token = cripto.decrypt(user.token, verifyData.uid.slice(-10))
    let secret = cripto.decrypt(user.secret, verifyData.uid.slice(-10))

    let twclient = useTwitter(token, secret);
    return twclient.tweets.statusesOembed({
      url:'https://twitter.com/'+screen_name+'/status/'+id
    })
  }
  return false
}

export default (req: IncomingMessage, res: ServerResponse) => {

    if(req.method !== 'GET')return {result:'fail'}

    const queryObject = url.parse(req.url,true).query;
    console.log(queryObject)

    res.statusCode = 200

    console.log(req.url)

    return getFavoList(req.verifyData,queryObject.user,queryObject.id)
      .then(favos=>{
        return {result:'ok',data:favos}
      })
}/** */