import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export default async (req, res) => {
    const authHeader:string = req.headers.authorization
    if(authHeader && authHeader.indexOf('Bearer ') != -1) {
        const bearerToken = authHeader.slice(7)

        console.log("goto Bearer Verify")

        if(getApps().length === 0) {
            initializeApp({projectId:'favocollection'})
        }
        const auth = getAuth()
        const verifyData = await auth.verifyIdToken(bearerToken)
            .then((decodeToken) => {
            return decodeToken
            })

        if(verifyData) {
            console.log("recieve verifyData")
            const epoch = Math.floor(Date.now() / 1000);

            // 認証時間異常
            if(!(verifyData.auth_time <= epoch))return;
            console.log("auth time ok")

            // 発行時間異常
            if(!(verifyData.iat <= epoch))return;
            console.log("gen time ok")

            // 有効期限切れ
            if(!(verifyData.exp > epoch))return;
            console.log("limit time ok")    
        }
        console.log("Bearer Token Verify ok")

        req.verifyData = verifyData;
    }
}