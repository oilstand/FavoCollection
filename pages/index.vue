<template>
  <div class="main">
    <div
      v-if="false"
      :style="'width:10px;height:10px;background-color:red;position:absolute;top:'+debugNumA+'px'">
    </div>
    <div class="left-navigation">
      <NuxtLink to="/dummy">dummy</NuxtLink>

      <button v-on:click="tryshift">shift</button>
      <ul class="list_menu">
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
          v-on:touchstart.stop="controller.controllerTouchStart"
          v-on:touchend.stop="controller.controllerTouchEnd"
          v-on:touchmove.stop="controller.controllerTouchMove"
          class="sp_controller">
          <li
            v-on:touchmove="()=>{}"
            class="controller_button"
            v-for="(cat, idx) in category_list"
            :key="idx"
            v-on:click="tryshift"><button>{{cat.name}}</button></li>
          <li
            v-on:touchstart.stop.prevent="controller.positionUpdate"
            v-on:touchend.stop.prevent="controller.positionUpdate"
            v-on:touchmove.stop.prevent="controller.positionUpdate"
            class="controller_center">
            <button
              v-on:click.stop="addCategoryList">add</button>
          </li>
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

.list_menu {
  list-style: none;
  padding:0;
}
.list_menu button {
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
    width:100%;
    display:flex;
    overflow-x:scroll;
  }
  .list_menu li {
    width:25%;
    flex-shrink: 0;
  }
  .list_menu button {
    /*border-radius:50%;
    aspect-ratio: 1;
    border:none;
    font-size:1.2em;*/
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
  }
  .sp_controller li.controller_center {
    width:20vw;
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
  {name:"ジャンル1"},
  {name:"ジャンル2"},
  {name:"ジャンル3"},
  {name:"ジャンル4"},
  {name:"ジャンル5"},
  {name:"ジャンル6"},
  {name:"ジャンル7"},
  {name:"ジャンル8"},
])

let favobuffer:object[] = [];
let dispTweetNum:number = 5;

const eventDebuger = (e) => {
  console.log(e)
}

type Position = {x:number, y:number};
type TouchInfo = {pos:Position, timestamp:number}
class RingController {
  pos:Position;
  touchInfo:TouchInfo;
  offsetRadian:number = 0;
  controllerR:number = 80;
  speed:number = 0;
  timeoutId:any = undefined;
  element:object;

  constructor() {
    this.pos = {x:0,y:0}
    this.touchInfo = {pos:{x:0,y:0},timestamp:0}
  }
  initialize() {
    this.element = document.getElementsByClassName('sp_controller')[0];
    this.pos.y = Math.floor(window.innerHeight * 0.75)
    this.pos.x = Math.floor(window.innerWidth * 0.9);
    this.updatePosition();
  }
  updatePosition() {
    this.element.setAttribute('style',`left:${this.pos.x}px;top:${this.pos.y}px;`)
  }
  positionUpdate(e) {
    this.pos.x = e?.changedTouches[0]?.pageX ?? this.pos.x;
    this.pos.y = e?.changedTouches[0]?.pageY - window.scrollY ?? this.pos.y;
    this.updatePosition();
  }
  controllerTouchStart(e) {
    this.touchInfo.pos.x = e?.changedTouches[0]?.pageX;
    this.touchInfo.pos.y = e?.changedTouches[0]?.pageY;
    this.touchInfo.timestamp = e?.timeStamp
  }
  getVector(x, y) {
    let dx = x - this.touchInfo.pos.x;
    let dy = y - this.touchInfo.pos.y;
    let porm = 1
    if((y - window.scrollY) > this.pos.y) {
      if(x < this.pos.x) {
        if(dx > 0 || dy > 0)porm = -1
      } else {
        if(dx > 0 || dy < 0)porm = -1
      }
    } else {
      if(x < this.pos.x) {
        if(dx < 0 || dy > 0)porm = -1
      } else {
        if(dx < 0 || dy < 0)porm = -1
      }
    }
    return Math.sqrt(dx*dx + dy*dy) * porm;
  }
  controllerTouchMove(e) {
    let vector = this.getVector(e?.changedTouches[0]?.pageX, e?.changedTouches[0]?.pageY)

    /*let deg = vector / (2 * Math.PI * this.controllerR) * 360
    let red = deg * Math.PI / 180;
    this.offsetRadian+=red;
    this.settingController();

    */
    let dt = e?.timeStamp - this.touchInfo.timestamp;
    let speed = vector / dt * 500;

    this.speed = Math.abs(speed) > Math.abs(this.speed) || speed * this.speed < 0 ? speed : this.speed;
    this.setMoveAnimation()

    this.controllerTouchStart(e)
  }
  controllerTouchEnd(e) {
    let vector = this.getVector(e?.changedTouches[0]?.pageX, e?.changedTouches[0]?.pageY)
    let dt = e?.timeStamp - this.touchInfo.timestamp;
    let speed = vector / dt * 1000;

    this.speed = speed;
    this.setMoveAnimation()
  }
  setMoveAnimation() {
    if(!this.timeoutId) {
      this.timeoutId = setTimeout(()=>this.updateControllerPosition(), 17)
    }
  }
  updateControllerPosition() {
    let deg = (this.speed * 17 / 1000) / (2 * Math.PI * this.controllerR) * 360
    let red = deg * Math.PI / 180;
    this.offsetRadian+=red;
    this.settingController();

    this.speed *= 0.9;
    if(Math.abs(this.speed) > 1) {
      this.timeoutId = setTimeout(()=>this.updateControllerPosition(), 17)
    } else {
      this.timeoutId = undefined
    }
  }
  settingController() {
    let elms = document.getElementsByClassName('controller_button');
    let deg = 360 / elms.length
    let red = deg * Math.PI / 180
    for(let i = 0; i < elms.length; i++) {
      let x = Math.cos(red * i + this.offsetRadian) * this.controllerR
      let y = Math.sin(red * i + this.offsetRadian) * this.controllerR
      elms[i].setAttribute('style','left:'+x+'px;top:'+y+'px;')
    }
  }
}
const controller = new RingController();


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
        onScroll()
      }
    })

    window.addEventListener('scroll',onScroll, {passive: true})
    controller.initialize();
    controller.settingController();
    
  }
  onMounted(onMountedAction);
}


//const { result: status } = useLazyFetch(`/api/user/${userId}`, { default: defaultUser })
console.log("page")
//const { data } = await useAsyncData('count', () => $fetch('/api/count'),{lazy:true,default:()=>{return 888;},server:false})
//const nuxtApp = useNuxtApp()
//console.log(nuxtApp.$hello("testmsg")) // not typed
</script>

