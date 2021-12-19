export const enum METHOD_TYPE {
    GET = "GET",
    POST = "POST",
}
export type APICALLBACK = (result:object|boolean)=>void;

export type FavoCollectionType = {
    on:(n:string, c:(data)=>void)=>void
    emit:(n:string, d?:object)=>void
    checkin:()=>void
    initFbEvents:()=>void
    signin:()=>void
    signout:()=>void
    postRequest:(endpoint:string, data:object)=>Promise<object>
    getRequest:(endpoint:string, data:any)=>Promise<object>
    initApi:()=>void
    usersRequest:(url:string, method:METHOD_TYPE, data:object|null, cb:APICALLBACK)=>void
    fetch:(url:string, data:any)=>Promise<object>
}
export type ApiTask = {
    url:string
    method:METHOD_TYPE
    data:object|null
    callback?:APICALLBACK
}
  
  