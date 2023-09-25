var Te=Object.defineProperty;var Ae=(n,e,t)=>e in n?Te(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var l=(n,e,t)=>(Ae(n,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerpolicy&&(i.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?i.credentials="include":o.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=t(o);fetch(o.href,i)}})();var W=function(n,e){return W=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])},W(n,e)};function A(n,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");W(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}function z(n){var e=typeof Symbol=="function"&&Symbol.iterator,t=e&&n[e],r=0;if(t)return t.call(n);if(n&&typeof n.length=="number")return{next:function(){return n&&r>=n.length&&(n=void 0),{value:n&&n[r++],done:!n}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function R(n,e){var t=typeof Symbol=="function"&&n[Symbol.iterator];if(!t)return n;var r=t.call(n),o,i=[],s;try{for(;(e===void 0||e-- >0)&&!(o=r.next()).done;)i.push(o.value)}catch(c){s={error:c}}finally{try{o&&!o.done&&(t=r.return)&&t.call(r)}finally{if(s)throw s.error}}return i}function M(n,e,t){if(t||arguments.length===2)for(var r=0,o=e.length,i;r<o;r++)(i||!(r in e))&&(i||(i=Array.prototype.slice.call(e,0,r)),i[r]=e[r]);return n.concat(i||Array.prototype.slice.call(e))}function S(n){return typeof n=="function"}function me(n){var e=function(r){Error.call(r),r.stack=new Error().stack},t=n(e);return t.prototype=Object.create(Error.prototype),t.prototype.constructor=t,t}var Q=me(function(n){return function(t){n(this),this.message=t?t.length+` errors occurred during unsubscription:
`+t.map(function(r,o){return o+1+") "+r.toString()}).join(`
  `):"",this.name="UnsubscriptionError",this.errors=t}});function X(n,e){if(n){var t=n.indexOf(e);0<=t&&n.splice(t,1)}}var L=function(){function n(e){this.initialTeardown=e,this.closed=!1,this._parentage=null,this._finalizers=null}return n.prototype.unsubscribe=function(){var e,t,r,o,i;if(!this.closed){this.closed=!0;var s=this._parentage;if(s)if(this._parentage=null,Array.isArray(s))try{for(var c=z(s),a=c.next();!a.done;a=c.next()){var u=a.value;u.remove(this)}}catch(h){e={error:h}}finally{try{a&&!a.done&&(t=c.return)&&t.call(c)}finally{if(e)throw e.error}}else s.remove(this);var v=this.initialTeardown;if(S(v))try{v()}catch(h){i=h instanceof Q?h.errors:[h]}var p=this._finalizers;if(p){this._finalizers=null;try{for(var b=z(p),y=b.next();!y.done;y=b.next()){var g=y.value;try{fe(g)}catch(h){i=i??[],h instanceof Q?i=M(M([],R(i)),R(h.errors)):i.push(h)}}}catch(h){r={error:h}}finally{try{y&&!y.done&&(o=b.return)&&o.call(b)}finally{if(r)throw r.error}}}if(i)throw new Q(i)}},n.prototype.add=function(e){var t;if(e&&e!==this)if(this.closed)fe(e);else{if(e instanceof n){if(e.closed||e._hasParent(this))return;e._addParent(this)}(this._finalizers=(t=this._finalizers)!==null&&t!==void 0?t:[]).push(e)}},n.prototype._hasParent=function(e){var t=this._parentage;return t===e||Array.isArray(t)&&t.includes(e)},n.prototype._addParent=function(e){var t=this._parentage;this._parentage=Array.isArray(t)?(t.push(e),t):t?[t,e]:e},n.prototype._removeParent=function(e){var t=this._parentage;t===e?this._parentage=null:Array.isArray(t)&&X(t,e)},n.prototype.remove=function(e){var t=this._finalizers;t&&X(t,e),e instanceof n&&e._removeParent(this)},n.EMPTY=function(){var e=new n;return e.closed=!0,e}(),n}(),ge=L.EMPTY;function Se(n){return n instanceof L||n&&"closed"in n&&S(n.remove)&&S(n.add)&&S(n.unsubscribe)}function fe(n){S(n)?n():n.unsubscribe()}var q={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1},$={setTimeout:function(n,e){for(var t=[],r=2;r<arguments.length;r++)t[r-2]=arguments[r];var o=$.delegate;return o!=null&&o.setTimeout?o.setTimeout.apply(o,M([n,e],R(t))):setTimeout.apply(void 0,M([n,e],R(t)))},clearTimeout:function(n){var e=$.delegate;return((e==null?void 0:e.clearTimeout)||clearTimeout)(n)},delegate:void 0};function Ge(n){$.setTimeout(function(){throw n})}function de(){}var Pe=function(){return ee("C",void 0,void 0)}();function Be(n){return ee("E",void 0,n)}function De(n){return ee("N",n,void 0)}function ee(n,e,t){return{kind:n,value:e,error:t}}var U=null;function j(n){if(q.useDeprecatedSynchronousErrorHandling){var e=!U;if(e&&(U={errorThrown:!1,error:null}),n(),e){var t=U,r=t.errorThrown,o=t.error;if(U=null,r)throw o}}else n()}var te=function(n){A(e,n);function e(t){var r=n.call(this)||this;return r.isStopped=!1,t?(r.destination=t,Se(t)&&t.add(r)):r.destination=ke,r}return e.create=function(t,r,o){return new Z(t,r,o)},e.prototype.next=function(t){this.isStopped?Y(De(t),this):this._next(t)},e.prototype.error=function(t){this.isStopped?Y(Be(t),this):(this.isStopped=!0,this._error(t))},e.prototype.complete=function(){this.isStopped?Y(Pe,this):(this.isStopped=!0,this._complete())},e.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,n.prototype.unsubscribe.call(this),this.destination=null)},e.prototype._next=function(t){this.destination.next(t)},e.prototype._error=function(t){try{this.destination.error(t)}finally{this.unsubscribe()}},e.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},e}(L),xe=Function.prototype.bind;function H(n,e){return xe.call(n,e)}var Ie=function(){function n(e){this.partialObserver=e}return n.prototype.next=function(e){var t=this.partialObserver;if(t.next)try{t.next(e)}catch(r){k(r)}},n.prototype.error=function(e){var t=this.partialObserver;if(t.error)try{t.error(e)}catch(r){k(r)}else k(e)},n.prototype.complete=function(){var e=this.partialObserver;if(e.complete)try{e.complete()}catch(t){k(t)}},n}(),Z=function(n){A(e,n);function e(t,r,o){var i=n.call(this)||this,s;if(S(t)||!t)s={next:t??void 0,error:r??void 0,complete:o??void 0};else{var c;i&&q.useDeprecatedNextContext?(c=Object.create(t),c.unsubscribe=function(){return i.unsubscribe()},s={next:t.next&&H(t.next,c),error:t.error&&H(t.error,c),complete:t.complete&&H(t.complete,c)}):s=t}return i.destination=new Ie(s),i}return e}(te);function k(n){Ge(n)}function Ue(n){throw n}function Y(n,e){var t=q.onStoppedNotification;t&&$.setTimeout(function(){return t(n,e)})}var ke={closed:!0,next:de,error:Ue,complete:de},je=function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"}();function we(n){return n}function Re(n){return n.length===0?we:n.length===1?n[0]:function(t){return n.reduce(function(r,o){return o(r)},t)}}var pe=function(){function n(e){e&&(this._subscribe=e)}return n.prototype.lift=function(e){var t=new n;return t.source=this,t.operator=e,t},n.prototype.subscribe=function(e,t,r){var o=this,i=$e(e)?e:new Z(e,t,r);return j(function(){var s=o,c=s.operator,a=s.source;i.add(c?c.call(i,a):a?o._subscribe(i):o._trySubscribe(i))}),i},n.prototype._trySubscribe=function(e){try{return this._subscribe(e)}catch(t){e.error(t)}},n.prototype.forEach=function(e,t){var r=this;return t=he(t),new t(function(o,i){var s=new Z({next:function(c){try{e(c)}catch(a){i(a),s.unsubscribe()}},error:i,complete:o});r.subscribe(s)})},n.prototype._subscribe=function(e){var t;return(t=this.source)===null||t===void 0?void 0:t.subscribe(e)},n.prototype[je]=function(){return this},n.prototype.pipe=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return Re(e)(this)},n.prototype.toPromise=function(e){var t=this;return e=he(e),new e(function(r,o){var i;t.subscribe(function(s){return i=s},function(s){return o(s)},function(){return r(i)})})},n.create=function(e){return new n(e)},n}();function he(n){var e;return(e=n??q.Promise)!==null&&e!==void 0?e:Promise}function Me(n){return n&&S(n.next)&&S(n.error)&&S(n.complete)}function $e(n){return n&&n instanceof te||Me(n)&&Se(n)}function Fe(n){return S(n==null?void 0:n.lift)}function ne(n){return function(e){if(Fe(e))return e.lift(function(t){try{return n(t,this)}catch(r){this.error(r)}});throw new TypeError("Unable to lift unknown Observable type")}}function re(n,e,t,r,o){return new Le(n,e,t,r,o)}var Le=function(n){A(e,n);function e(t,r,o,i,s,c){var a=n.call(this,t)||this;return a.onFinalize=s,a.shouldUnsubscribe=c,a._next=r?function(u){try{r(u)}catch(v){t.error(v)}}:n.prototype._next,a._error=i?function(u){try{i(u)}catch(v){t.error(v)}finally{this.unsubscribe()}}:n.prototype._error,a._complete=o?function(){try{o()}catch(u){t.error(u)}finally{this.unsubscribe()}}:n.prototype._complete,a}return e.prototype.unsubscribe=function(){var t;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var r=this.closed;n.prototype.unsubscribe.call(this),!r&&((t=this.onFinalize)===null||t===void 0||t.call(this))}},e}(te),qe=me(function(n){return function(){n(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}}),oe=function(n){A(e,n);function e(){var t=n.call(this)||this;return t.closed=!1,t.currentObservers=null,t.observers=[],t.isStopped=!1,t.hasError=!1,t.thrownError=null,t}return e.prototype.lift=function(t){var r=new ve(this,this);return r.operator=t,r},e.prototype._throwIfClosed=function(){if(this.closed)throw new qe},e.prototype.next=function(t){var r=this;j(function(){var o,i;if(r._throwIfClosed(),!r.isStopped){r.currentObservers||(r.currentObservers=Array.from(r.observers));try{for(var s=z(r.currentObservers),c=s.next();!c.done;c=s.next()){var a=c.value;a.next(t)}}catch(u){o={error:u}}finally{try{c&&!c.done&&(i=s.return)&&i.call(s)}finally{if(o)throw o.error}}}})},e.prototype.error=function(t){var r=this;j(function(){if(r._throwIfClosed(),!r.isStopped){r.hasError=r.isStopped=!0,r.thrownError=t;for(var o=r.observers;o.length;)o.shift().error(t)}})},e.prototype.complete=function(){var t=this;j(function(){if(t._throwIfClosed(),!t.isStopped){t.isStopped=!0;for(var r=t.observers;r.length;)r.shift().complete()}})},e.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(e.prototype,"observed",{get:function(){var t;return((t=this.observers)===null||t===void 0?void 0:t.length)>0},enumerable:!1,configurable:!0}),e.prototype._trySubscribe=function(t){return this._throwIfClosed(),n.prototype._trySubscribe.call(this,t)},e.prototype._subscribe=function(t){return this._throwIfClosed(),this._checkFinalizedStatuses(t),this._innerSubscribe(t)},e.prototype._innerSubscribe=function(t){var r=this,o=this,i=o.hasError,s=o.isStopped,c=o.observers;return i||s?ge:(this.currentObservers=null,c.push(t),new L(function(){r.currentObservers=null,X(c,t)}))},e.prototype._checkFinalizedStatuses=function(t){var r=this,o=r.hasError,i=r.thrownError,s=r.isStopped;o?t.error(i):s&&t.complete()},e.prototype.asObservable=function(){var t=new pe;return t.source=this,t},e.create=function(t,r){return new ve(t,r)},e}(pe),ve=function(n){A(e,n);function e(t,r){var o=n.call(this)||this;return o.destination=t,o.source=r,o}return e.prototype.next=function(t){var r,o;(o=(r=this.destination)===null||r===void 0?void 0:r.next)===null||o===void 0||o.call(r,t)},e.prototype.error=function(t){var r,o;(o=(r=this.destination)===null||r===void 0?void 0:r.error)===null||o===void 0||o.call(r,t)},e.prototype.complete=function(){var t,r;(r=(t=this.destination)===null||t===void 0?void 0:t.complete)===null||r===void 0||r.call(t)},e.prototype._subscribe=function(t){var r,o;return(o=(r=this.source)===null||r===void 0?void 0:r.subscribe(t))!==null&&o!==void 0?o:ge},e}(oe),Ne=function(n){A(e,n);function e(t){var r=n.call(this)||this;return r._value=t,r}return Object.defineProperty(e.prototype,"value",{get:function(){return this.getValue()},enumerable:!1,configurable:!0}),e.prototype._subscribe=function(t){var r=n.prototype._subscribe.call(this,t);return!r.closed&&t.next(this._value),r},e.prototype.getValue=function(){var t=this,r=t.hasError,o=t.thrownError,i=t._value;if(r)throw o;return this._throwIfClosed(),i},e.prototype.next=function(t){n.prototype.next.call(this,this._value=t)},e}(oe);function Ee(n,e){return ne(function(t,r){var o=0;t.subscribe(re(r,function(i){r.next(n.call(e,i,o++))}))})}function B(n,e){return ne(function(t,r){var o=0;t.subscribe(re(r,function(i){return n.call(e,i,o++)&&r.next(i)}))})}function ie(n,e){return e===void 0&&(e=we),n=n??Ve,ne(function(t,r){var o,i=!0;t.subscribe(re(r,function(s){var c=e(s);(i||!n(o,c))&&(i=!1,o=c,r.next(s))}))})}function Ve(n,e){return n===e}const F=class{constructor(){l(this,"map",new Map);l(this,"_events",new oe);l(this,"events$",this._events.asObservable());l(this,"name",crypto.randomUUID())}static incSeq(){this._SEQ++}static get SEQ(){return this._SEQ}on(e,t){this.map.set(e,t)}log(...e){F.incSeq(),console.log(`${F.SEQ}.`,...e)}};let C=F;l(C,"_SEQ",0);class Qe extends C{constructor(){super();l(this,"provider",new WebSocket("wss://gateway.p2p.works"));console.log(this.provider),this.provider.onopen=t=>console.log(t),this.provider.onmessage=({data:t})=>{if(t){const{type:r,name:o,payload:i}=JSON.parse(t)??{};if(r&&o!==this.name){const s=this.map.get(r);s&&this._events.next(new s(i))}}}}onOpen(t){this.provider.onopen=t}emit(t,r){const o={payload:r,name:this.name,type:t};this.provider.readyState===this.provider.OPEN&&this.provider.send(JSON.stringify(o))}}const He=["have-remote-offer","have-local-pranswer"],Ye=n=>He.includes(n);function Ke(n,e=1){const t=parseInt(n.slice(1,3),16),r=parseInt(n.slice(3,5),16),o=parseInt(n.slice(5,7),16);return`rgba(${t},${r},${o},${e})`}const Je=(n,{color:e,opacity:t}={color:"black",opacity:1})=>{const r=document.createElement("canvas"),o=new AudioContext,i=r.getContext("2d");i.fillStyle=Ke(e,t);const s=o.createMediaStreamSource(n),c=o.createAnalyser();s.connect(c);const a=c.frequencyBinCount,u=new Uint8Array(a);let v,p,b,y;const{width:g,height:h}=r,_=()=>{if(i&&n){i.clearRect(0,0,g,h),v=g;for(let m=0;m<v;m++)b=g/v,p=m*(b+2),y=-u[m]/1.6,i.fillRect(p,h,b,y)}};let w=-1;const E=()=>{w=requestAnimationFrame(E),c.getByteFrequencyData(u),_()};return{canvas:r,renderLoop:E,animationFrame:w,disable:()=>{n.getTracks().forEach(m=>m.enabled=!1),cancelAnimationFrame(w),o.suspend()}}},We=async(n,e)=>{const t=await n.createAnswer(e);return await n.setLocalDescription(t),t},_e=()=>{const n=document.createElement("audio");return n.controls=!1,n.autoplay=!0,n},se=async(n,e)=>{const t=await n.createOffer(e);return await n.setLocalDescription(t),t};function ce(...n){const e=t=>!!n.find(r=>t instanceof r);return t=>t.pipe(B(e))}function ze(n=-3,e=3){return Math.random()*(e-n)+n}const Xe=n=>navigator.mediaDevices.getUserMedia(n||{audio:!0});function be(n,e,t,r){const o=e*n.sampleRate,i=(e-2*t)*n.sampleRate,s=o+i,c=n.createBuffer(1,s,n.sampleRate),a=c.getChannelData(0);for(let u=0;u<o;++u)r?a[u]=(o-u)/s:a[u]=u/o;for(let u=o;u<s;++u)a[u]=0;return c}function Ze(n,e,t){const r=e*n.sampleRate,o=(e-2*t)*n.sampleRate,i=r+o,s=n.createBuffer(1,i,n.sampleRate),c=s.getChannelData(0),a=t*n.sampleRate,u=a,v=r-a;for(let p=0;p<r;++p){let b;p<u?b=Math.sqrt(p/a):p>=v?b=Math.sqrt(1-(p-v)/a):b=1,c[p]=b}for(let p=r;p<i;++p)c[p]=0;return s}class et{constructor(e,t=.1,r=.05,o=.1){l(this,"input");l(this,"output");l(this,"shiftDownBuffer");l(this,"shiftUpBuffer");l(this,"mod1");l(this,"mod2");l(this,"mod1Gain");l(this,"mod2Gain");l(this,"mod3Gain");l(this,"mod4Gain");l(this,"modGain1");l(this,"modGain2");l(this,"fade1");l(this,"fade2");l(this,"mix1");l(this,"mix2");l(this,"delay1");l(this,"delay2");this.context=e,this.bufferTime=t,this.fadeTime=r,this.delayTime=o;const i=e.createGain(),s=e.createGain();this.input=i,this.output=s;const c=e.createBufferSource(),a=e.createBufferSource(),u=e.createBufferSource(),v=e.createBufferSource();this.shiftDownBuffer=be(e,t,r,!1),this.shiftUpBuffer=be(e,t,r,!0),c.buffer=this.shiftDownBuffer,a.buffer=this.shiftDownBuffer,u.buffer=this.shiftUpBuffer,v.buffer=this.shiftUpBuffer,c.loop=!0,a.loop=!0,u.loop=!0,v.loop=!0;const p=e.createGain(),b=e.createGain(),y=e.createGain();y.gain.value=0;const g=e.createGain();g.gain.value=0,c.connect(p),a.connect(b),u.connect(y),v.connect(g);const h=e.createGain(),_=e.createGain(),w=e.createDelay(),E=e.createDelay();p.connect(h),b.connect(_),y.connect(h),g.connect(_),h.connect(w.delayTime),_.connect(E.delayTime);const O=e.createBufferSource(),m=e.createBufferSource(),le=Ze(e,t,r);O.buffer=le,m.buffer=le,O.loop=!0,m.loop=!0;const G=e.createGain(),P=e.createGain();G.gain.value=0,P.gain.value=0,O.connect(G.gain),m.connect(P.gain),i.connect(w),i.connect(E),w.connect(G),E.connect(P),G.connect(s),P.connect(s);const I=e.currentTime+.05,V=I+t-r;c.start(I),a.start(V),u.start(I),v.start(V),O.start(I),m.start(V),this.mod1=c,this.mod2=a,this.mod1Gain=p,this.mod2Gain=b,this.mod3Gain=y,this.mod4Gain=g,this.modGain1=h,this.modGain2=_,this.fade1=O,this.fade2=m,this.mix1=G,this.mix2=P,this.delay1=w,this.delay2=E,this.setDelay(o)}setDelay(e){this.modGain1.gain.setTargetAtTime(.5*e,0,.01),this.modGain2.gain.setTargetAtTime(.5*e,0,.01)}setPitchOffset(e){e>0?(this.mod1Gain.gain.value=0,this.mod2Gain.gain.value=0,this.mod3Gain.gain.value=1,this.mod4Gain.gain.value=1):(this.mod1Gain.gain.value=1,this.mod2Gain.gain.value=1,this.mod3Gain.gain.value=0,this.mod4Gain.gain.value=0),this.setDelay(this.delayTime*Math.abs(e))}}const tt=n=>{const e=new AudioContext,t=e.createMediaStreamSource(n),r=e.createDelay();r.delayTime.value=0,t.connect(r);const o=new et(e);o.setPitchOffset(1.6),r.connect(o.input);const i=e.createMediaStreamDestination();o.output.connect(i);const s=document.createElement("input");return s.type="range",s.min="-3",s.max="3",s.value=String(ze(-3,3)),s.oninput=()=>{o.setPitchOffset(s.valueAsNumber)},{input:s,destination:i}};class ae extends RTCSessionDescription{constructor(e){super(e)}}class ue extends RTCIceCandidate{constructor(e){super(e)}}const Oe=new Map;function nt(n,e){Oe.set(n,e)}function rt(n){const e=Oe.get(n);if(!e)throw new Error(`O tipo ${n.name} não está registrado`);return new e}class D extends RTCSessionDescription{constructor(e){super(e)}}const ot=n=>{const e=new Ne(n),t=()=>e.getValue();return{value$:e.asObservable(),select:a=>e.asObservable().pipe(Ee(u=>a(u)),ie()),value:t,patch:a=>{e.next({...t(),...a})},update:(a,u)=>{e.next({...t(),[a]:u})},set:a=>e.next(a)}};nt(C,Qe);const f=rt(C);f.on("offer",D);f.on("answer",ae);f.on("candidate",ue);const it=document,K=new MediaStream,T=_e(),J=_e(),Ce=it.createElement("output");document.body.appendChild(Ce);const d=new RTCPeerConnection;d.onicecandidate=n=>{if(n.candidate){const e=new ue(n.candidate);f.emit("candidate",e),f.log("Enviei meus candidatos")}};const x=ot({signaling:"closed",connection:"new",iceConnection:"closed",iceGathering:"new"});d.onsignalingstatechange=()=>{x.update("signaling",d.signalingState)};d.oniceconnectionstatechange=()=>{x.update("iceConnection",d.iceConnectionState)};d.onconnectionstatechange=()=>{x.update("connection",d.connectionState),Ce.innerText=d.connectionState};d.onicegatheringstatechange=()=>{x.update("iceGathering",d.iceGatheringState)};f.events$.pipe(ce(D),Ee(async n=>(f.log("Recebi uma oferta"),await d.setRemoteDescription(n),f.log("Configurei uma descrição remota"),n))).subscribe(async n=>{if(await n,Ye(d.signalingState)){f.log("Aceitei uma oferta");const e=await We(d);f.log("Configurei uma descrição local"),f.emit("answer",new ae(e)),f.log("Enviei uma resposta")}});f.events$.pipe(ce(ae)).subscribe(async n=>{f.log("Recebi uma resposta"),d.setRemoteDescription(n),f.log("Configurei uma descrição remota")});f.events$.pipe(ce(ue)).subscribe(async n=>{d.remoteDescription&&await d.addIceCandidate(n)});d.onnegotiationneeded=async()=>{f.log("Vamos negociar"),f.onOpen(async()=>{const n=await se(d);f.emit("offer",new D(n)),f.log("Enviei uma oferta")})};const N=x.select(n=>n.connection),st=N.pipe(B(n=>n==="connected")),ct=N.pipe(B(n=>n==="disconnected"),ie((n,e)=>n!=="disconnected"&&e==="connecting")),at=N.pipe(B(n=>n==="disconnected"),ie((n,e)=>n!=="disconnected"&&e==="disconnected")),ut=N.pipe(B(n=>n==="disconnected"));st.subscribe(()=>{document.body.appendChild(T),T.paused&&T.play()});ut.subscribe(()=>{T.remove()});ct.subscribe(async()=>{const n=await se(d);f.emit("offer",new D(n)),f.log("Fomos desconectados, enviei uma nova oferta")});at.subscribe(async()=>{const n=await se(d);f.emit("offer",new D(n)),f.log("Fomos desconectados, enviei uma nova oferta")});d.ontrack=({track:n})=>{if(n){K.addTrack(n),T.srcObject=K,T.autoplay=!0;const{canvas:e,renderLoop:t}=Je(K);document.body.appendChild(e),t()}};Xe().then(n=>{J.srcObject=n,J.muted=!0,document.body.appendChild(J);const{input:e,destination:t}=tt(n),[r]=t.stream.getAudioTracks();d.addTrack(r);const o=document.createElement("h2");o.innerText="🧌",o.ariaLabel="Monstro",o.title="Monstro";const i=document.createElement("h2");i.innerText="🐩",i.ariaLabel="Poodle",i.title="Poodle";const s=document.createElement("section");s.appendChild(o),s.appendChild(e),s.appendChild(i),document.body.appendChild(s);const c=document.createElement("input");c.type="checkbox",c.onchange=a=>{if(console.log(a),c.checked){const[u]=n.getAudioTracks();ye(u)}else{const[u]=t.stream.getAudioTracks();ye(u)}},document.body.appendChild(c)});const ye=n=>{const e=d.getSenders().find(({track:t})=>t&&t.kind==="audio");e==null||e.replaceTrack(n)};