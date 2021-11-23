import { useNuxtApp } from '#app'
import { ApiClient } from '~/class/ApiClient'

export const useApi = (url:string) => {
    const nuxt = useNuxtApp()

    return nuxt.$api
        ? nuxt.$api
        : (()=>{
            const api = new ApiClient(url)
            nuxt.provide('api', api)
            return api
        })()
}