import { Datastore } from '@google-cloud/datastore'
import { DSClinet } from '~/class/DSClient';
import { DSEntityBase } from '~/class/models/DSEntityBase';

export class DSTwList extends DSEntityBase {

    get kind() {
        return "twList"
    }

    static UID:string = "uid"
    static TITLE:string = "title"
    static SORT_ID:string = "sort"
    static CONTAINER_IDS:string = "containerIds"

    get EXPANSION_PROPERTIES() {
        return [
            DSTwList.UID,
            DSTwList.TITLE,
            DSTwList.SORT_ID,
            DSTwList.CONTAINER_IDS,
        ]
    }

    get DEFAULT_VALUES() {
        return {
            [DSTwList.TITLE]: 'notitle',
            [DSTwList.SORT_ID]: 0    
        }
    }

    get noIndex() {
        return [
            DSTwList.TITLE,
            DSTwList.SORT_ID
        ]
    }
}