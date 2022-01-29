import type { IncomingMessage, ServerResponse } from 'http'
import { useBody, createApp } from 'h3'
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { Cripto } from '~/class/Cripto'

import { useDatastore,DSClinet } from '~/class/DSClient';
import { DSUser } from '~/class/models/DSUser';
import { useTwitter } from '~/class/TwitterClient'
import { DSTwList } from '~/class/models/DSTwList';
import { DSTwContainer } from '~/class/models/DSTwContainer';
import { Datastore } from '@google-cloud/datastore';

declare module 'http' {
    interface IncomingMessage {
      verifyData:DecodedIdToken;
    }
  }

const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

/*const doubleWait = async () => {
    await wait(1000)
    await wait(2000)
}*/
const getFavoList = async (verifyData:DecodedIdToken) => {
    const dsc = new DSClinet();

    let user = await dsc.get(new DSUser(), verifyData.uid)
    let test = new DSTwList()

    console.log(test)
  
    if(typeof(user) == 'object') {
      const cripto = new Cripto();
      let token = cripto.decrypt(user.get(DSUser.TOKEN), verifyData.uid.slice(-10))
      let secret = cripto.decrypt(user.get(DSUser.SECRET), verifyData.uid.slice(-10))
  
      let twclient = useTwitter(token, secret);
      return twclient.tweets.favoritesList({
        count:200,
      })
      .then(async favs=>{
          if(favs.length > 0 && typeof(user) == 'object') {
            let twids = []
            for(let fav of favs)twids.push(fav.id_str)

            let twContainer = new DSTwContainer(dsc)
            twContainer.set(DSTwContainer.TWEET_IDS, twids)
            twContainer.set(DSTwContainer.UID, verifyData.uid)
            let containerid = await twContainer.save()
                .then(res=>{
                    console.log(res,res[0].mutationResults[0].key.path[0].id)
                    return res[0].mutationResults[0].key.path[0].id
                })
            
            let twList = new DSTwList(dsc)
            twList.set(DSTwList.UID, verifyData.uid)
            twList.set(DSTwList.CONTAINER_IDS, [containerid])
            twList.save()

            let head = {
                datetime: (new Date()).toISOString(),
                headId: favs[0].id_str,
            }
            let tail = {
                datetime: favs[favs.length - 1].created_at,
                tailId: favs[favs.length - 1].id_str,
            }
            user.set(DSUser.LOAD_INFO, {
                head,
                tail
            })
            user.save()
  
          }
          return favs
      })
    }
    return false
}
export default (req: IncomingMessage, res: ServerResponse) => {

    console.log('stream')
    if(req.method !== 'GET')return {result:'fail'}

    res.write(""+1)
    //await wait(3000);
    if(!req.verifyData) {
        res.statusCode = 401
        return {result:'request login'}
    }/**/

    res.write(""+2)
    res.write(""+0)

    //res.end("end");

     let data = getFavoList(req.verifyData)
        .then(favs=>{
            res.write(""+3)
            if(favs) {
                for(let fav of favs) {
                    console.log(fav.id_str);
                }
            }
            return favs;
        })

    let b = wait(3000)
        .then(r=>{
            res.write("4");
        })


    Promise.all([data,b]).then(values=>{
        console.log("stream end")
        res.end("all recived")
    })/***/
    //console.log('stream func end')
}/**/