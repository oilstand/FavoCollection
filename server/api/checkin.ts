import type { IncomingMessage, ServerResponse } from 'http'
import { useBody, createApp } from 'h3'
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { Cripto } from '~/class/Cripto'

import { useDatastore,DSClinet } from '~/class/DSClient';
import { DSUser } from '~/class/models/DSUser';

declare module 'http' {
    interface IncomingMessage {
      verifyData:DecodedIdToken;
    }
  }
  
export default async (req: IncomingMessage, res: ServerResponse) => {

    if(req.method !== 'GET')return {result:'fail'}

    if(!req.verifyData) {
        res.statusCode = 401
        return {result:'request login'}
    }

    res.statusCode = 200

    const dsc = new DSClinet();
    const user = await dsc.getUser(req.verifyData.uid)

    if(user) {
        return {result:"ok"}
    }

    return {result:"request reauth"}//body
}/**/