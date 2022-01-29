import { Datastore } from '@google-cloud/datastore'
import { DSClinet } from '~/class/DSClient';
import { DSEntityBase } from '~/class/models/DSEntityBase';

export class DSUser extends DSEntityBase {

    get kind() {
        return "user"
    }

    static TWITTER_ID:string = "twitterId"

    static TOKEN:string = "token"
    static SECRET:string = "secret"

    static LOAD_INFO:string = "loadInfo"

    get EXPANSION_PROPERTIES() {
        return [
            DSUser.TWITTER_ID,
            DSUser.TOKEN,
            DSUser.SECRET,
            DSUser.LOAD_INFO,
        ]
    }

    get noIndex() {
        return [
            DSUser.TOKEN,
            DSUser.SECRET,
            DSUser.LOAD_INFO,
        ]
    }
}