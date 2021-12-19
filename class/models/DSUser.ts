import { Datastore } from '@google-cloud/datastore'
import { DSEntityBase } from '~/class/models/DSEntityBase';

export class DSUser extends DSEntityBase {

    static KIND:string = "user"
    static TWITTER_ID:string = "twitterId"

    static TOKEN:string = "token"
    static SECRET:string = "secret"

    constructor(ds:Datastore, data?:object) {
        super(ds);
        this.kind = DSUser.KIND;

        this.noIndex = [
            DSUser.TOKEN,
            DSUser.SECRET,
        ]
    }
}