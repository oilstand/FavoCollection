import { Datastore } from '@google-cloud/datastore'
import { DSEntityBase } from '~/class/models/DSEntityBase';

export class DSTweet extends DSEntityBase {

    static KIND:string = "tweet"
    //static TWITTER_ID:string = "twitterId"

    static HTML:string = "html"
    //static SECRET:string = "secret"

    constructor(ds:Datastore, key:string, data?:object) {
        super(ds);
        this.setKey(key)

        this.kind = DSTweet.KIND;

        this.noIndex = [
            DSTweet.HTML,
            //DSTweet.SECRET,
        ]
    }
}