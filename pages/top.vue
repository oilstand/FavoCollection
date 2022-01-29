<template>
  <div>
    <NuxtLink to="/">link</NuxtLink>
  </div>
</template>

<script setup lang="ts">

declare const onMounted:(func:()=>void)=>void;

import { useNuxtApp } from '#app'
import { NuxtAppType } from '~/class/types/NuxtAppType'
import { METHOD_TYPE } from '~/class/types/FavoCollectionType'
const nuxtApp:NuxtAppType = useNuxtApp()

if(process.client) {
  const onMountedAction = ()=>{

    nuxtApp.$favo.usersRequest('stream', METHOD_TYPE.GET_STREAM, null, (data) => {
      console.log('stream',data)
    })
    /*fetch('/api/stream')
      // その body を ReadableStream として取得
      .then(response => {
        const reader = response.body.getReader();

        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                // データを消費する必要がなくなったら、ストリームを閉じます
                console.log("value",value)
                console.log("2str",String.fromCharCode(value[0]))
                for(let val of value) {
                  console.log("cnv:",String.fromCharCode(val))
                }
                if (done) {
                    controller.close();
                    return;
                }
                // 次のデータチャンクを対象のストリームのキューに入れます
                controller.enqueue(value);
                return pump();
              });
            }
          }
        })
      })
      .then(async stream =>await new Response(stream))
      .then(response=>{
        console.log("res",response)
        return true
      })*/
  }
  onMounted(onMountedAction);
}
</script>

<style>
</style>
