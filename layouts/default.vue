<template>
  <div class="main-body">
    <header>
      <h1>FavoCollection</h1>
      <div class="uinfo">
        <h3>ログインテスト</h3>
        <p v-if="isLogin">ログイン中！<button v-on:click="nuxtApp.$favo.signout">ログアウト</button></p>
        <p v-else>ログアウト中<button v-on:click="nuxtApp.$favo.signin">ログイン</button></p>
      </div>
    </header>
    <slot />
  </div>
</template>

<style>
body {
  margin:0;
}
header {
  background-color: gray;
  display: flex;
  flex-wrap: wrap;
  padding:4px 16px;
}
header h1 {
  margin:0;
}
header .uinfo {
  margin-left:auto;
}
.uinfo {
  display:flex;
}
.uinfo p {
  padding:0 16px;
}
</style>
<script setup lang="ts">
console.log("layout")

import { useNuxtApp } from '#app'
import { NuxtAppType } from '~/class/types/NuxtAppType'
const nuxtApp:NuxtAppType = useNuxtApp()

const isLogin = ref(false);

if(process.client) {

  nuxtApp.$favo.on('onAuthStateChanged',
    (data)=>{
      console.log('event callback',data)
      isLogin.value = !!data;
    })

  nuxtApp.$favo.on('onRequestReAuth',
    ()=>{
      console.log('reauth required')
      nuxtApp.$favo.signout();
    })

  nuxtApp.$favo.initFbEvents()
}

</script>
<script lang="ts">
export default {
    htmlAttrs: {
        lang: 'ja',
        prefix: 'og: http://ogp.me/ns#'
    },
    head: {
        title: 'Nuxt3 default',
        script: []
    }
}
</script>
