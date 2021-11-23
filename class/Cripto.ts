import Crypto from "crypto-js";

// default key
const EncryptKey = 'hIUkLE6WsflA2NGLIJl7mihfXlsoAuyHZA4nVqZBoCeBRsOiBJCRzfpzfooBjs5aH9Jt3SevlPbnEeDAmA5rnNzozi6iNVKFHC6Y60K5btLiK3UBJU5dGtXdilSBotG4uRJqAxLqSfiYkGdaAFtAp7TmjielxjfTUubxcaoayfq93EtBRYhajQsROYy6FpI0zIUkc2UaQ3YMYCjJf0dzt32JCgnQGAmZzMxGByprYV0xOmQhWN9IGyRz3zBoxDSu'

export class Cripto {
    key:string = null
    constructor(key?:string) {
        this.key = key ?? EncryptKey
    }
    encrypt(raw:string, salt:string = '') {
        return Crypto.AES.encrypt(raw, this.key+salt).toString()
    }
    decrypt(raw:string, salt:string = '') {
        return this.decode(Crypto.AES.decrypt(raw, this.key+salt))
    }
    decode(byte) {
        return byte.toString(Crypto.enc.Utf8)
    }
}