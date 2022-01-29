//import {EventEmitter} from 'events'

type Position = {x:number, y:number};
type TouchInfo = {pos:Position, timestamp:number}
export class RingController /*extends EventEmitter*/ {
  pos:Position;
  firstTouchInfo:TouchInfo;
  touchInfo:TouchInfo;
  offsetRadian:number = Math.PI;
  controllerR:number = 80;
  speed:number = 0;
  timeoutId:any = undefined;
  element:object;
  clickcb:(id:number)=>void;

  constructor() {
    //super()
    this.pos = {x:0,y:0}
    this.touchInfo = {pos:{x:0,y:0},timestamp:0}
    this.firstTouchInfo = {pos:{x:0,y:0},timestamp:0}
  }
  private initializeWorks() {
    console.log('set elm')
    let tmpElm = document.getElementsByClassName('sp_controller');
    if(tmpElm.length != 0) {
      this.element = tmpElm[0];
      this.pos.y = Math.floor(window.innerHeight * 0.75)
      this.pos.x = Math.floor(window.innerWidth * 0.9);
      this.updatePosition();
      this.settingController();
    }
    else setTimeout(()=>this.initializeWorks(), 100)
  }
  initialize(cb:(id:number)=>void) {
    this.clickcb = cb;

    this.initializeWorks();
  }
  updatePosition() {
    if(this.element)this.element.setAttribute('style',`left:${this.pos.x}px;top:${this.pos.y}px;`)
  }
  positionUpdate(e) {
    this.pos.x = e?.changedTouches[0]?.pageX ?? this.pos.x;
    this.pos.y = e?.changedTouches[0]?.pageY - window.scrollY ?? this.pos.y;
    this.updatePosition();
  }
  controllerTouchStart(e) {
    this.setTouchInfo(this.firstTouchInfo, e)
    this.setTouchInfo(this.touchInfo, e)
  }
  setTouchInfo(target, e) {
    target.pos.x = e?.changedTouches[0]?.pageX;
    target.pos.y = e?.changedTouches[0]?.pageY;
    target.timestamp = e?.timeStamp
  }
  getVector(touchInfo,x, y) {
    let dx = x - touchInfo.pos.x;
    let dy = y - touchInfo.pos.y;
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
    let vector = this.getVector(this.touchInfo, e?.changedTouches[0]?.pageX, e?.changedTouches[0]?.pageY)

    /*let red = (vector / (2 * Math.PI * this.controllerR) * 360) * Math.PI / 180;
    this.offsetRadian+=red;
    this.settingController();*/
    
    let dt = e?.timeStamp - this.touchInfo.timestamp;
    let speed = vector / dt * 1000;

    this.speed = Math.abs(speed) > Math.abs(this.speed) || speed * this.speed < 0 ? speed : this.speed;
    this.setMoveAnimation()

    this.setTouchInfo(this.touchInfo, e)
  }
  controllerTouchEnd(e) {
    let move = this.getVector(this.firstTouchInfo, e?.changedTouches[0]?.pageX, e?.changedTouches[0]?.pageY)
    if(e?.timeStamp - this.firstTouchInfo.timestamp < 250 && Math.abs(move) < 10) {
      if(e.srcElement.tagName == 'BUTTON') {
        this.clickcb(e.srcElement.value);
      }
    }/**/

    let vector = this.getVector(this.touchInfo, e?.changedTouches[0]?.pageX, e?.changedTouches[0]?.pageY)

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
    let deg = 360 / (elms.length < 6 ? 6 : elms.length)
    let red = deg * Math.PI / 180
    for(let i = 0; i < elms.length; i++) {
      let x = Math.cos(red * i + this.offsetRadian) * this.controllerR
      let y = Math.sin(red * i + this.offsetRadian) * this.controllerR
      elms[i].setAttribute('style','left:'+x+'px;top:'+y+'px;')
    }
  }
}

const getElm = (id) => document.getElementById(id);

export class TweetDisplayController {
  scrollCheckCounter:number = 0;
  preMakerPosition:number = 0;
  preCheckPos:number = 0;
  ftlist:object[];

  focusIdx:number = -1;
  focusTimeoutId:any = undefined;

  cb_getOembed:(screen_name:string,tweetid:string)=>object = null;
  cb_onReciveOembed:(object)=>void = null;

  constructor(_ftlist:any, getOembedFunction:(screen_name:string,tweetid:string)=>Promise<object>,onReciveOembed:(object)=>void) {
    this.ftlist = _ftlist.value;
    this.cb_getOembed = getOembedFunction;
    this.cb_onReciveOembed = onReciveOembed;
  }
  getTweetNum() {return this.ftlist.length}
  tryshift() {
//    this.ftlist.shift();
    this.ftlist.splice(this.focusIdx,1)
    this.focusOut();
    this.resetRect();
    this.tryFocus();
  }

  updateOembed() {
    for(let tw of this.ftlist) {
      if(tw.html || tw.html === false)continue;
      tw.html = false
      if(this.cb_getOembed) {
        this.cb_getOembed(tw.user.screen_name,tw.id_str)
          .then((data)=>{
            console.log(data)
            tw.html = data.data.html
            if(this.cb_onReciveOembed)this.cb_onReciveOembed(tw);
          })
      }
    }
  }

  onScroll(e) {
    if(Math.floor(window.scrollY / 20) == this.preCheckPos){
      return true;
    }
    else {
      this.preCheckPos = Math.floor(window.scrollY / 20);
    }

    let updateRect = false;

    this.scrollCheckCounter++;
    if(this.scrollCheckCounter%15 == 0) {
      let tmpRect = getElm('timeline_end_marker')?.getBoundingClientRect();
      if(tmpRect && Math.floor(tmpRect.top + window.scrollY) != this.preMakerPosition) {
        console.log('updateRect')
        this.preMakerPosition = Math.floor(tmpRect.top + window.scrollY)
        for(const tw of this.ftlist)tw.rect = false;
        updateRect = true
      }
    }
    this.focusTweet(updateRect);
  }
  tryFocus() {
    if(!this.focusTimeoutId) {
      this.focusTimeoutId = setTimeout(()=>this._tryFocus(),200);
    }
  }
  private _tryFocus() {
    if(!this.focusTweet(true)) {
      this.focusTimeoutId = setTimeout(()=>this._tryFocus(),200)
    }
    else {
      this.focusTimeoutId = undefined;
      this.resetRect()
    }
  }
  focusTweet(updateRect) {
    let pos = (window.innerHeight / 2) + window.scrollY

    let focusOnce = false;
    let index,idx,elm,rect;
    const chkTbl = [0,1,-1]
    for(index = 0; index < 3; index++) {

      idx = chkTbl[index] + (this.focusIdx < 0 ? 1 : this.focusIdx)
      if(idx < 0 || idx >= this.ftlist.length)continue;

      const tw = this.ftlist[idx]
      elm = null, rect = null;

      if(!tw.rect || updateRect) {
        if(!tw.elm)tw.elm = getElm(tw.id_str)
        if(!tw.elm)return false;
        rect = tw.elm.getBoundingClientRect();
        tw.rect = {
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY
        }
      }

      if(!focusOnce) {
        //rect = elm.getBoundingClientRect();
        if( (window.scrollY < 20 && idx == 0)
            || (window.scrollY >= 20 && tw.rect.top < pos + 16 && pos - 16 < tw.rect.bottom)) {
          if(this.focusIdx == idx && !updateRect)break;
          if(!tw.elm)tw.elm = getElm(tw.id_str)
          tw.elm.classList.add('focus_tweet')
          focusOnce = true;
          this.focusIdx = idx
        } else {
          if(this.focusIdx != idx)continue;
          if(!tw.elm)tw.elm = getElm(tw.id_str)
          tw.elm.classList.remove('focus_tweet')
        }
      } else {
        if(this.focusIdx != idx)continue;
        if(!tw.elm)tw.elm = getElm(tw.id_str)
        tw.elm.classList.remove('focus_tweet')
      }
    }/** */
    console.log("focus",focusOnce,this.focusIdx)
    return focusOnce
  }
  focusOut() {
    for(const tw of this.ftlist) {
      let elm = tw.elm ?? getElm(tw.id_str)
      if(elm)elm.classList.remove('focus_tweet')
    }
  }
  setTweet(tw) {
    this.ftlist.push(tw)
  }
  resetRect() {
    for(const tw of this.ftlist)tw.rect = false;
  }
}