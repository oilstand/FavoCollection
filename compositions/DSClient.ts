import { Datastore } from '@google-cloud/datastore'
import { DSUser } from '~/class/models/DSUser'

export class DSClinet {
    ds:Datastore = null;
    constructor() {
        this.ds = new Datastore();
    }
    createUser() {

    }
    getUser(uid:string) {
        const key = this.ds.key(['user',uid])
        this.ds.get(key,(entity) => {
            console.log('recive entity')
            console.log(entity)
        })
    }
}

export const useDatastore = () => {
    const dsClient = new Datastore();
    return dsClient
}  