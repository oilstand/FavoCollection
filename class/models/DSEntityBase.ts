import { Datastore } from '@google-cloud/datastore'

export class DSEntityBase {

    static KIND = 'default'

    ds:Datastore;

    static CREATED_AT:string = "createdAt"
    static UPDATED_AT:string = "updatedAt"

    kind:string = null;
    private key:string = null;

    data:object = {};
    noIndex:string[] = [];

    constructor(ds:Datastore) {
        this.ds = ds
        this.data[DSEntityBase.CREATED_AT] = (new Date()).toISOString();
    }

    clear() {
        this.data = {}
    }

    set(key:string, value:any) {
        if(this.data[key] !== value) {
            this.data[key] = value;
            this.data[DSEntityBase.UPDATED_AT] = (new Date()).toISOString();
        }
    }

    setKey(key:string) {
        this.key = key
    }

    update() {
        this.ds.update([
            {
                key: this.getDSKey(),
                data: this.data,
                excludeFromIndexes: this.noIndex
            }
        ])
    }
    save() {
        this.ds.save([
            {
                key: this.getDSKey(),
                data: this.data,
                excludeFromIndexes: this.noIndex
            }
        ])
    }
    delete() {
        this.ds.delete(this.getDSKey())
    }
    getDSKey() {
        return this.key
            ? this.ds.key([this.kind, this.key])
            : this.ds.key([this.kind])
    }
}