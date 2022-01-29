import { Datastore, Key } from '@google-cloud/datastore'
import { DSClinet } from '~/class/DSClient';

export interface DSEntityInterface {
    kind:string
}
export class DSEntityBase implements DSEntityInterface {

    private ds:Datastore;

    static CREATED_AT:string = "createdAt"
    static UPDATED_AT:string = "updatedAt"

    PROPERTIES:string[] = [
        DSEntityBase.CREATED_AT,
        DSEntityBase.UPDATED_AT,
    ]

    get EXPANSION_PROPERTIES() {
        return []
    }

    get DEFAULT_VALUES() {
        return {}
    }

    get kind() {
        return undefined
    }

    get noIndex() {
        return []
    }

    private key:string = null;

    data:object = {};

    constructor(dsc?:DSClinet, data?:object) {
        if(dsc)this.ds = dsc.ds
        this.PROPERTIES.push(...this.EXPANSION_PROPERTIES)
        this.setValues(this.DEFAULT_VALUES)
        this.data[DSEntityBase.CREATED_AT] = (new Date()).toISOString();
        if(data)this.setValues(data)
    }

    /*addProperties(expansionProperties:string[]) {
        this.PROPERTIES.push(...expansionProperties)
    }*/

    setDS(ds:Datastore) {
        this.ds = ds
    }

    clear() {
        this.data = {}
    }

    set(key:string, value:any, updateDate:boolean = true) {
        if(this.data[key] !== value) {
            if(updateDate)this.data[DSEntityBase.UPDATED_AT] = (new Date()).toISOString();
            this.data[key] = value;
        }
    }

    get(key:string) {
        return this.data[key]
    }

    setValues(values:object, updateDate:boolean = true) {
        for(let key of Object.keys(values)) {
            if(this.PROPERTIES.indexOf(key) != -1) {
                this.set(key, values[key], updateDate)
            }
        }
    }

    setKey(key:string|Key) {
        if(typeof(key) == 'string') {
            this.key = key
        }
        if(typeof(key) == 'object') {
            this.key = key.name
        }
    }

    update() {
        return this.ds.update([
            {
                key: this.createKey(),
                data: this.data,
                excludeFromIndexes: this.noIndex
            }
        ])
    }
    save() {
        return this.ds.save([
            {
                key: this.createKey(),
                data: this.data,
                excludeFromIndexes: this.noIndex
            }
        ])
    }
    delete() {
        return this.ds.delete(this.createKey())
    }
    createKey() {
        return this.key
            ? this.ds.key([this.kind, this.key])
            : this.ds.key([this.kind])
    }
}