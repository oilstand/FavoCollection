//import { useNuxtApp } from '#app'
import { TwitterClient } from 'twitter-api-client';

export class appTwitterClient {
    tc:TwitterClient;
    constructor(token:string, secret:string) {
        const twitterConfig = {
            apiKey: process.env.TWITTER_API,
            apiSecret: process.env.TWITTER_API_SECRET,
            accessToken: token,
            accessTokenSecret: secret,  
        }
        this.tc = new TwitterClient(twitterConfig);
    }
}

export const useTwitter = (token, secret) => {
    const twitterConfig = {
        apiKey: process.env.TWITTER_API,
        apiSecret: process.env.TWITTER_API_SECRET,
        accessToken: token,
        accessTokenSecret: secret,  
    }

    return new TwitterClient(twitterConfig)

    /*let favs = await client.tweets.favoritesList()

    console.log(favs)

    return favs*/

    //const nuxtApp = useNuxtApp()
    /*if(!nuxtApp.$twitter) {
        
        nuxtApp.provide('twitter',twitterClient)
    }
    return {
        axios: nuxtApp.$twitter
    }*/
    //return { hoge:'huga' }
}  