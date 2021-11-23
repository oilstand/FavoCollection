import { useNuxtApp } from '#app'
import { Cripto } from '~/class/Cripto'

export const useCripto = () => {
    const nuxt = useNuxtApp()

    return nuxt.$cripto
        ? nuxt.$cripto
        : (()=>{
            const cripto = new Cripto()
            nuxt.provide('cripto', cripto)
            return cripto
        })()
}