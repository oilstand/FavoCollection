import { Datastore } from '@google-cloud/datastore'
import { DSClinet } from '~/class/DSClient';
import { DSEntityBase } from '~/class/models/DSEntityBase';

export class DSTwContainer extends DSEntityBase {

    get kind() {
        return "twContainer"
    }

    static UID:string = "uid"
    static INDEX:string = "index"
    static TWEET_IDS:string = "tweetIds"

    get EXPANSION_PROPERTIES() {
        return [
            DSTwContainer.UID,
            DSTwContainer.INDEX,
            DSTwContainer.TWEET_IDS,
        ]
    }

    get DEFAULT_VALUES() {
        return {
            [DSTwContainer.INDEX]: 32768,
            [DSTwContainer.TWEET_IDS]: []    
        }
    }

    get noIndex() {
        return [
            DSTwContainer.TWEET_IDS,
        ]
    }
}