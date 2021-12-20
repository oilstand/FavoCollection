<template>
  <div class="main">
    <div
      v-if="false"
      :style="'width:10px;height:10px;background-color:red;position:absolute;top:'+debugNumA+'px'">
    </div>
    <div class="left-navigation">
      <NuxtLink to="/dummy">dummy</NuxtLink>

      <button v-on:click="tryshift">shift</button>
      <ul class="list">
        <li
          v-for="(cat, idx) in category_list"
          :key="idx"
          v-on:click="tryshift"><button>{{cat.name}}</button></li>
        <li><button>add</button></li>
      </ul>
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
          v-on:touchstart.prevent="controllerTouchStart"
          v-on:touchend.prevent="controllerTouchEnd"
          v-on:touchmove.prevent="controllerTouchMove"
          class="sp_controller">
          <li
            v-on:touchmove="()=>{}"
            class="controller_button"
            v-for="(cat, idx) in category_list"
            :key="idx"
            v-on:click="tryshift"><button>{{cat.name}}</button></li>
          <li><button v-on:click.stop="addCategoryList">add</button></li>
        </ul>
      </div>
    </div>
    <div v-if="focusImgs.length>0" v-on:click="focusImgs=[]"
      class="overlay"
      v-on:scroll.prevent=""
      v-on:wheel.prevent="">
      <img :src="focusImgs[focusCursor].media_url_https">
      <button class="control prev_button" v-on:click.stop="focusCursor=(focusCursor-1+focusImgs.length)%focusImgs.length">◀</button>
      <button class="control next_button" v-on:click.stop="focusCursor=(focusCursor+1)%focusImgs.length">▶</button>
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

.list {
  list-style: none;
  padding:0;
}
.list button {
  width:100%;
  display: block;
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
  display:flex;
  align-items: center;
  justify-content: center;
  left:0;top:0;
  width:100%;
  height:100vh;
  background-color:rgba(0,0,0,.4);
  transition:.5s;
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
@media (max-width: 640px) {
  .tweet_line {
    width:100%;
    order:2;
  }
  .left-navigation {
    order:0;
  }
  .left-navigation,
  .right-navigation {
    width:100%;
  }
  .right-navigation {
    order:1;
    position:fixed;
    bottom:0;left:0;
    background-color:rgba(0,0,0,.4);
    /**height:60px;*/
  }
  .right-navigation div {
    width:100%;
    /*overflow-x:scroll;*/
  }
  .list {
    width:100%;
    display:flex;
    overflow-x:scroll;
  }
  .list li {
    width:25%;
    flex-shrink: 0;
  }
  .list button {
    border-radius:50%;
    aspect-ratio: 1;
    border:none;
    font-size:1.2em;
  }
  .overlay img {
    max-width:80%;
  }
  .overlay .control {
    width:10%;
  }
  .sp_controller {
    position: relative;
    list-style: none;
    padding: 0;
    margin:0;
  }
  .sp_controller li {
    aspect-ratio: 1;
    
    width:15%;
    position:absolute;
    right:0;
    bottom:0;
    /*transform: translate(-50%,-50%);*/
  }
  .sp_controller button {
    width: 100%;
    height:100%;
    font-size: 12px;
    border-radius: 50%;
    border:solid 1px gray;
    padding:0;
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

<script setup lang="ts">

import { useNuxtApp } from '#app'
import { useFetch } from 'nuxt3'
import { METHOD_TYPE } from '~/class/types/FavoCollectionType'
import { NuxtAppType } from '~/class/types/NuxtAppType'
const nuxtApp:NuxtAppType = useNuxtApp()

const ftlist:object[] = ref([])
const overlay:boolean = ref(false)
const focusTweetIdx:number = ref(-1)
const focusImgs:object[] = ref([])
const focusCursor:number = ref(0)
const debugNumA:number = ref(0)
const category_list:object[] = ref([
  {name:"イラスト"},
  {name:"スキップ"},
  {name:"スキップ"},
  {name:"スキップ"},
  {name:"スキップ"},
  {name:"スキップ"},
  {name:"スキップ"},
  {name:"スキップ"},
  {name:"スキップ"},
  {name:"スキップ"},
  {name:"スキップ"},
  {name:"スキップ"},
])

let favobuffer:object[] = [];
let dispTweetNum:number = 5;

const eventDebuger = (e) => {
  console.log(e)
}

let touchInfo = {x:0,y:0,timestamp:0}
const controllerTouchStart = (e) => {
  touchInfo.x = e?.changedTouches[0]?.screenX;
  touchInfo.y = e?.changedTouches[0]?.screenY;
  touchInfo.timestamp = e?.timeStamp
}
const controllerTouchMove = (e) => {
  let dx = e?.changedTouches[0]?.screenX - touchInfo.x;
  let dy = e?.changedTouches[0]?.screenY - touchInfo.y;
  let dr = Math.sqrt(dx*dx + dy*dy)
  let porm = 1
  if(dx < 0 || dy > 0)porm = -1

  let deg = porm * dr / (2 * Math.PI * controllerR) * 360
  let red = deg * Math.PI / 180;
  offsetRadian+=red;
  settingController();

  touchInfo.x = e?.changedTouches[0]?.screenX;
  touchInfo.y = e?.changedTouches[0]?.screenY;
  touchInfo.timestamp = e?.timeStamp
}
const controllerTouchEnd = (e) => {
  let dx = e?.changedTouches[0]?.screenX - touchInfo.x;
  let dy = e?.changedTouches[0]?.screenY - touchInfo.y;
  let dr = Math.sqrt(dx*dx + dy*dy)
  let dt = e?.timeStamp - touchInfo.timestamp;
  let speed = dr / dt * 1000;

  let porm = 1
  if(dx < 0 || dy > 0)porm = -1

//  console.log(dr * porm)
//  updateControllerPosition(dr * porm)
  updateControllerPosition(speed * porm)
}

const controllerR = 120;
let offsetRadian = 0;
const updateControllerPosition = (speed) => {
  let deg = (speed * 17 / 1000) / (2 * Math.PI * controllerR) * 360
  let red = deg * Math.PI / 180;
  offsetRadian+=red;
  settingController();
  if(Math.abs(speed) > 1)setTimeout(()=>updateControllerPosition(speed * 0.9), 17)
}

const settingController = () => {
  let elms = document.getElementsByClassName('controller_button');
  let deg = 360 / elms.length
  let red = deg * Math.PI / 180
  for(let i = 0; i < elms.length; i++) {
    let x = Math.cos(red * i + offsetRadian) * controllerR
    let y = Math.sin(red * i + offsetRadian) * controllerR
    elms[i].setAttribute('style','right:'+x+'px;bottom:'+y+'px;')
  }
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
  while (ftlist.value.length < dispTweetNum && favobuffer.length > 0) {
    const tw = favobuffer.shift()
    ftlist.value.push(tw)
  } 

  for(let tw of ftlist.value) {
    if(tw.html || tw.html === false)continue;
    tw.html = false
    nuxtApp.$favo.getRequest('tweet', {user:tw.user.screen_name,id:tw.id_str})
      .then((data)=>{
        console.log(data)
        tw.html = data.data.html
        twitterWidgetLoad();
      })
  }
}
const tryshift = () => {
  if(ftlist.value.length > 0) {
    ftlist.value.shift();

  }
  setDisplayTweet()
}

const addCategoryList = () => {
  category_list.value.push({
    name:'ボタン'+(category_list.value.length + 1)
  })
}

const getElm = (id) => document.getElementById(id);

let scrollCheckCounter:number = 0;
let preMakerPosition:number = 0;
let preCheckPos:number = 0;
const onScroll = (e) => {
  if(preMakerPosition < window.scrollY + window.innerHeight) {
    //dispTweetNum++;
    //setDisplayTweet()
  }

  if(Math.floor(window.scrollY / 20) == preCheckPos){
    return true;
  }
  else {
    preCheckPos = Math.floor(window.scrollY / 20);
  }

  let updateRect = false;

  scrollCheckCounter++;
  if(scrollCheckCounter%15 == 0) {
    let tmpRect = getElm('timeline_end_marker')?.getBoundingClientRect();
    if(tmpRect && Math.floor(tmpRect.top + window.scrollY) != preMakerPosition) {
      console.log('updateRect')
      preMakerPosition = Math.floor(tmpRect.top + window.scrollY)
      for(const tw of ftlist.value)tw.rect = false;
      updateRect = true
    }
  }

  let pos = (window.innerHeight / 2) + window.scrollY

  let focusOnce = false;
  let index,idx,elm,rect;
  const chkTbl = [0,1,-1]
  for(index = 0; index < 3; index++) {

    idx = focusTweetIdx.value + chkTbl[index]
    if(idx < 0 || idx >= ftlist.value.length)continue;

    const tw = ftlist.value[idx]
    elm = null, rect = null;

    if(!tw.rect || updateRect) {
      elm = getElm(tw.id_str)
      rect = elm.getBoundingClientRect();
      tw.rect = {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY
      }
    }

    if(!focusOnce) {
      //rect = elm.getBoundingClientRect();
      if(tw.rect.top < pos + 16 && pos - 16 < tw.rect.bottom) {
        if(focusTweetIdx.value == idx && !updateRect)break;
        if(!elm)elm = getElm(tw.id_str)
        elm.classList.add('focus_tweet')
        focusOnce = true;
        focusTweetIdx.value = idx
      } else {
        if(focusTweetIdx.value != idx)continue;
        if(!elm)elm = getElm(tw.id_str)
        elm.classList.remove('focus_tweet')
      }
    } else {
      if(focusTweetIdx.value != idx)continue;
      if(!elm)elm = getElm(tw.id_str)
      elm.classList.remove('focus_tweet')
    }
  }/** */
}

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
      }
    })

    window.addEventListener('scroll',onScroll, {passive: true})
    settingController();
  }
  onMounted(onMountedAction);
}


//const { result: status } = useLazyFetch(`/api/user/${userId}`, { default: defaultUser })
console.log("page")
//const { data } = await useAsyncData('count', () => $fetch('/api/count'),{lazy:true,default:()=>{return 888;},server:false})
//const nuxtApp = useNuxtApp()
//console.log(nuxtApp.$hello("testmsg")) // not typed
</script>

