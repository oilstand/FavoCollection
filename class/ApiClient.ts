export class ApiClient {
    headers:HeadersInit = {
    }
    apiRoute:string = null
    constructor(url) {
        this.apiRoute = url
    }
    clearHeader() {
        this.headers = {}
    }
    setHeader(key:string, value:string) {
        this.headers[key] = value
    }
    setHeaders(headers:HeadersInit) {
        this.headers = headers
    }
    request(method:string, endpoint:string, body?:BodyInit) {
        let params = {
            method,
            headers: this.headers,
        }

        if(body)params['body'] = JSON.stringify(body)

        return fetch(
            this.apiRoute+endpoint,
            params
        )
    }
}