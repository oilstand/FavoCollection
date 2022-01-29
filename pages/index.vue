<template>
  <div class="main">
    <div class="left-navigation">
      <ul class="list_menu">
        <li
          v-for="(cat, idx) in category_list"
          :key="idx"
          v-on:click="">
            <button
              :class="(cat.id == 0? 'focus_button':'') + (cat.loading ? ' loading':'')"
              :style="cat.color ? `background-color:${cat.color};`:``"
              >{{cat.name}}<div v-if="cat.loading" class="dot-flashing"></div></button></li>
      </ul>
      <div class="list_controll">
        <button
          v-on:click.stop="viewMode=VIEW_MODE.CREATE_LIST">作成</button>
      </div>
    </div>
    <div class="tweet_line" style="">
      <div class="tweet" v-for="tw in ftlist" :key="tw.id_str" :id="tw.id_str">
        <div v-if="tw.html" v-html="tw.html" v-on:hover="console.log('hover')"></div>
        <span v-else>
          {{'https://twitter.com/' + tw.user.screen_name + '/status/' + tw.id_str}}
        </span>
        <ul class="media_list" v-if="tw?.extended_entities?.media">
          <li
            v-for="media in tw.extended_entities.media"
            :key="media.id_str"
            v-on:click.stop="focusImgs=tw.extended_entities.media,focusCursor=0">
            <img :src="media.media_url_https">
          </li>
        </ul>
      </div>
      <div id="timeline_end_marker"></div>
    </div>
    <div class="right-navigation">
      <div>
        <ul 
          v-on:touchstart.prevent="controller?.controllerTouchStart"
          v-on:touchend.prevent="controller?.controllerTouchEnd"
          v-on:touchmove.prevent="controller?.controllerTouchMove"
          class="sp_controller">
          <li
            v-on:touchmove="()=>{}"
            class="controller_button"
            v-for="(cat, idx) in category_list"
            :key="idx"
            ><button :value="idx">{{cat.name}}</button></li>
          <li class="add_button_block">
            <button
              v-on:touchstart.stop=""
              v-on:touchend.stop=""
              v-on:touchmove.stop=""
              v-on:click.stop="viewMode=VIEW_MODE.CREATE_LIST">リスト作成</button>
          </li>
          <li
            v-on:touchstart.stop.prevent="controller?.positionUpdate"
            v-on:touchend.stop.prevent="controller?.positionUpdate"
            v-on:touchmove.stop.prevent="controller?.positionUpdate"
            class="controller_center">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z" /></svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="focusImgs.length>0" v-on:click="focusImgs=[]"
      class="overlay overlay_image"
      v-on:scroll.prevent=""
      v-on:wheel.prevent="">
      <img :src="focusImgs[focusCursor].media_url_https">
      <button class="control prev_button" v-on:click.stop="focusCursor=(focusCursor-1+focusImgs.length)%focusImgs.length">◀</button>
      <button class="control next_button" v-on:click.stop="focusCursor=(focusCursor+1)%focusImgs.length">▶</button>
    </div>
    <div
      class="overlay view_create_list"
      v-if="viewMode == VIEW_MODE.CREATE_LIST"
      v-on:click.stop="">

      <div>
        <h3>リストの作成</h3>
        <p>タイトルと色を設定してください</p>
        <p>
          <input
            v-on:click.stop=""
            id="list_title_input"
            type="text">
          <input
            id="list_color_input"
            v-on:click.stop=""
            type="color">
        </p>
        <div
          class="check_or_cancel">
          <button
            v-on:click="viewMode=VIEW_MODE.DEFAULT">×</button>
          <button
            v-on:click="submitCreateList">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.main {
  display:flex;
  flex-wrap: wrap;
  position:relative;
}
.left-navigation,
.right-navigation {
  width:calc((100% - 550px)/2);
}
.tweet_line {
  max-width:550px;
}

.list_menu {
  list-style: none;
  padding:0;
}
.list_menu button {
  position: relative;
  max-width:100%;
  height:100%;
  padding:4px 10px 0;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 5px 5px 0 0;
  border: solid 1px gray;
  border-bottom: 4px solid transparent;
  opacity:.7;
  font-weight: bold;
  text-shadow: 1px 1px 0 rgba(255,255,255,.5),
   -1px -1px 0 rgba(255,255,255,.5),
   -1px 1px 0 rgba(255,255,255,.5),
   1px  -1px 0 rgba(255,255,255,.5),
   0px  1px 0 rgba(255,255,255,.5),
   0    -1px 0 rgba(255,255,255,.5),
   -1px 0 0 rgba(255,255,255,.5),
   1px  0 0 rgba(255,255,255,.5);
}
.list_menu button.loading {
  padding-right:calc(6px + 1em);
}
.list_menu .focus_button {
  opacity: 1;
  border-bottom: 4px solid lightblue;
}
.tweet {
  opacity:.4;
  transition: .3s;
}
.focus_tweet {
  opacity: 1;
}
.overlay {
  position:fixed;
  align-items: center;
  left:0;top:0;
  width:100%;
  height:100vh;
  background-color:rgba(0,0,0,.7);
  transition:.5s;
}
.overlay_image {
  display:flex;
  justify-content: center;
  background-color:rgba(0,0,0,.7);
}
.view_create_list {
  color:white;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-color:rgba(0,0,0,.8);
}
.view_create_list > div {
  margin-bottom: 25%;
}
.check_or_cancel {
  display:flex;
  justify-content: space-around;
}
.view_create_list button {
  display:block;
  width: 15vw;
  aspect-ratio: 1;
  border-radius: 50%;
  border: none;
  background-color: rgba(0,0,0,.7);
  color:white;
  font-size:1.3em;
}
.overlay img {
  display:block;
  max-height:80%;
}

.overlay .next_button {
  right:0;
}
.overlay .prev_button {
  left:0;
}
.overlay .control {
  position:absolute;
  top:0;
  height:100%;
  border:none;
  background-color:rgba(0,0,0,.4);
}
.dot-flashing {
  position: absolute;
  right: 8px;
  top: 50%;
}
@media (max-width: 640px) {
  .tweet_line {
    width:100%;
    order:2;
  }
  .left-navigation {
    order:0;
    display:flex;
    padding-top:5px;
  }
  .left-navigation,
  .right-navigation {
    width:100%;
  }
  .right-navigation {
    order:1;
    position:fixed;
    top:0;left:0;
    background-color:rgba(0,0,0,.4);
    /**height:60px;*/
  }
  .right-navigation div {
    position: relative;
    /*width:100%;
    overflow-x:scroll;*/
  }
  .list_menu {
    width:80%;
    display:flex;
    overflow-x:scroll;
    margin:0;
  }
  .list_menu li {
    max-width:30%;
    flex-shrink: 0;
  }
  .list_menu button {
    white-space: nowrap;
    /*border-radius:50%;
    aspect-ratio: 1;
    border:none;
    font-size:1.2em;*/
  }
  .list_controll {
    width:20%;
  }
  .list_controll button {
    width:100%;
  }
  .overlay img {
    max-width:80%;
  }
  .overlay .control {
    width:10%;
  }
  .sp_controller {
    position: absolute;
    list-style: none;
    right: 0;
    top:0;
    padding: 0;
    margin:0;
  }
  .sp_controller li {
    aspect-ratio: 1;
    
    width:15vw;
    position:absolute;
    left:0;
    top:0;
    transform: translate(-50%,-50%);/**/

    vertical-align: middle;
  }
  .sp_controller li.controller_center {
    width:20vw;
  }
  li.controller_center button {
    background-color: black;
  }
  li.controller_center svg {
    fill:white;
  }
  .sp_controller button {
    width: 100%;
    height:100%;
    font-size: 12px;
    border-radius: 50%;
    border:solid 1px gray;
    padding:0;
    background-color: rgba(0,0,0,0.75);
    color: white;
    border-color: #2e2e2e;
  }
  li.add_button_block {
    width: 20vw;
    height: calc(80px/* + 10vw*/);
    overflow: hidden;
    transform: translate(-50%, 0);
  }
  li.add_button_block button {
    width: calc(160px /*+ 15vw*/);
    height: calc(160px /*+ 15vw*/);
    transform: translate(calc(-50% + 10vw), -50%);
    border: solid 1px lightgray;
    padding-top: calc((160px /*+ 15vw*/) * 0.70);
  }
}
@media (min-width: 641px) {
  .list {
    margin:16px 24px;
  }
  .list button {
    font-size:1.2em;
  }
  .overlay img {
    max-width:70%;
  }
  .overlay .control {
    width:5%;
  }
}



ul.media_list {
  list-style:none;
  padding:0;
  width:100%;
  display:flex;
}
ul.media_list li {
  width:calc(25% - 2px);
  /*aspect-ratio: 1;*/
  border:solid 1px transparent;
  transition:.3s;
  overflow: hidden;
}
ul.media_list li:hover {
  width:calc(25% - 2px);
  border-color:red;
}
ul.media_list img {
  max-width:100%;

}
</style>
<script lang="ts">
/*import { defineNuxtConfig } from "nuxt3";
export default defineNuxtConfig({

})*/
</script>
<script setup lang="ts">

import { useNuxtApp } from '#app'
import { useFetch } from 'nuxt3'
import { METHOD_TYPE } from '~/class/types/FavoCollectionType'
import { NuxtAppType } from '~/class/types/NuxtAppType'
import { RingController, TweetDisplayController } from '~/class/ClientUI'
import 'three-dots/dist/three-dots.min.css'
//import EventEmitter from 'events'

const enum VIEW_MODE {
  DEFAULT = 'default',
  CREATE_LIST = 'create_list',
}

const viewMode:VIEW_MODE = ref(VIEW_MODE.DEFAULT)

const nuxtApp:NuxtAppType = useNuxtApp()

const ftlist:object[] = ref([])
const focusImgs:object[] = ref([])
const focusCursor:number = ref(0)
const category_list:object[] = ref([
  {name:"未分類",id:0,loading:false},
  {name:"スキップ",id:1,loading:false},
])

let favobuffer:object[] = [];
let dispTweetNum:number = 5;

const eventDebuger = (e) => {
  console.log(e)
}

const twitterWidgetLoad = () => {
    if(!window.twttr) {
        window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {
                t._e.push(f);
            };

            return t;
        }(document, "script", "twitter-wjs"));
    } else if(window.twttr.widgets){
      console.log(window.twttr.widgets)
      window.twttr.widgets.load();
    }
}
const setDisplayTweet = () => {
  while (tweetLine.getTweetNum() < dispTweetNum && favobuffer.length > 0) {
    const tw = favobuffer.shift()
    tweetLine.setTweet(tw);
  }

  tweetLine.updateOembed();
}
const tryshift = () => {
  if(tweetLine.getTweetNum() > 0) {
    tweetLine.tryshift();
  }
  setDisplayTweet()
}

const addCategoryList = () => {
  category_list.value.push({
    name:'ボタン'+(category_list.value.length + 1)
  })
  setTimeout(()=>controller.settingController(),100);
}

const getElm = (id) => document.getElementById(id);

const submitCreateList = (e) => {
  let inputTitle = getElm('list_title_input')
  let inputColor = getElm('list_color_input')

  if(inputTitle && inputTitle.value != "") {
    category_list.value.splice(category_list.value.length - 1, 0,{
      name:inputTitle.value,
      color:inputColor.value,
      loading:true,
    })
    viewMode.value = VIEW_MODE.DEFAULT;
    setTimeout(()=>controller.settingController(),100);
    console.log(inputTitle.value,inputColor.value)
  } else e.preventDefault()
}

const controller = new RingController();
const tweetLine = new TweetDisplayController(
  ftlist,
  async (screen_name:string,tweetid:string)=>{
    return nuxtApp.$favo.getRequest('tweet', {user:screen_name,id:tweetid})
  },
  twitterWidgetLoad);

if(process.client) {
  nuxtApp.$favo.on('onAuthStateChanged',
    (data)=>{
      console.log('event callback(page)',data)
    })

  const onMountedAction = ()=>{
    console.log("onmounted action")
    nuxtApp.$favo.usersRequest('favos', METHOD_TYPE.GET, null, (data) => {
      console.log('favos',data)
      if(data.result == 'ok') {
        favobuffer = data.data
        setDisplayTweet()
        tweetLine.onScroll()
      }
    })

    window.addEventListener('scroll',(e)=>tweetLine.onScroll(e), {passive: true})

    controller.initialize((id)=>{
      tryshift();
      console.log('button touched:'+id)
    });

    tweetLine.tryFocus();
  }
  onMounted(onMountedAction);
}/**/


//const { result: status } = useLazyFetch(`/api/user/${userId}`, { default: defaultUser })
console.log("page")
//const { data } = await useAsyncData('count', () => $fetch('/api/count'),{lazy:true,default:()=>{return 888;},server:false})
//const nuxtApp = useNuxtApp()
//console.log(nuxtApp.$hello("testmsg")) // not typed
</script>

