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
        return fetch(
            this.apiRoute+endpoint,
            {
                method,
                headers: this.headers,
                body:JSON.stringify(body)
            }
        )
    }
}