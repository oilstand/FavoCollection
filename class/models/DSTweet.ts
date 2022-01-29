import { Datastore } from '@google-cloud/datastore'
import { DSClinet } from '~/class/DSClient';
import { DSEntityBase } from '~/class/models/DSEntityBase';

export class DSTweet extends DSEntityBase {

    get kind() {
        return "tweet"
    }

    //static TWITTER_ID:string = "twitterId"

    static HTML:string = "html"
    //static SECRET:string = "secret"

    get noIndex() {
        return [
            DSTweet.HTML,
        ]
    }

    constructor(dsc?:DSClinet, data?:object, key?:string) {
        super(dsc, data)
        this.setKey(key)
    }
}