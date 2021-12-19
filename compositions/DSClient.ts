import { Datastore } from '@google-cloud/datastore'
import { DSUser } from '~/class/models/DSUser'

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
}

export const useDatastore = () => {
    const dsClient = new Datastore();
    return dsClient
}  