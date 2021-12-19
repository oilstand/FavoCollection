<template>
  <div>
    top page<button v-on:click="trylogin" id="login">logintest</button>
    <NuxtLink to="/">link</NuxtLink>
    {{data}}
  </div>
</template>
<script lang="ts">
import { useNuxtApp } from '#app'
import { useFirebase } from '~/compositions/firebase'
import { useCripto } from '~/compositions/Cripto'

const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  head: {
    title: 'Test Title'
  },
  async setup() {

    const { data } = await useAsyncData('count', () => $fetch('/api/count'))
    console.log("waitend")
    /*await wait(1000);
    console.log("waitend")
    await wait(1000);
    console.log("waitend")
    await wait(1000);
    console.log("waitend")*/

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
