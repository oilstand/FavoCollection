<template>
  <div>
    top page<button v-on:click="trylogin" id="login">logintest</button>
    <NuxtLink to="/">link</NuxtLink>
  </div>
</template>
<script lang="ts">
import { useNuxtApp } from '#app'
import { useFirebase } from '~/compositions/firebase'
import { useCripto } from '~/compositions/Cripto'

export default {
  head: {
    title: 'Test Title'
  },
  setup() {
    const nuxtApp = useNuxtApp()
    //console.log("setup")
    if(process.client) {
      nuxtApp.$favo.initFbEvents()
    }
    //const favo = inject('favo')
    //console.log(Object.keys(nuxtApp))
    //nuxtApp.$hello("test");
    const onMountedAction = async () => {
      console.log("onmounted")
      nuxtApp.$hello("test2");

      let cri = useCripto()
    }
    onMounted(onMountedAction);

    return {
      trylogin: ()=>{
        nuxtApp.$favo.signin()
      }
    }
  }
}
</script>

<style>
</style>
