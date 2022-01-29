import { Datastore } from '@google-cloud/datastore'
import { DSEntityInterface } from './models/DSEntityBase';
import { DSUser } from '~/class/models/DSUser'
import { DSEntityBase } from './models/DSEntityBase';

export class DSClinet {
    ds:Datastore = null;
    constructor() {
        this.ds = new Datastore();
    }
    createUser() {

    }
    async getUser(uid:string) {
        const key = this.ds.key(['user',uid])
        return await this.ds.get(key)
            .then((entities) => {
                return entities && entities[0] ? entities[0] : false;
            })
    }
    async get(obj:DSEntityBase, key:string|number) {
        const dsKey = this.ds.key([obj.kind,key])
        return await this.ds.get(dsKey)
            .then((entities) => {
                if(entities && entities[0]) {
                    obj.setValues(entities[0], false)
                    obj.setDS(this.ds)
                    obj.setKey(entities[0][Datastore.KEY])
                    return obj;
                }
                return false;
            })
    }
}

export const useDatastore = () => {
    const dsClient = new Datastore();
    return dsClient
}  