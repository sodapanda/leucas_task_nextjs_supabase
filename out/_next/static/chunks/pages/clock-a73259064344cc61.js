(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[672],{5783:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/clock",function(){return s(8906)}])},8906:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return w}});var l=s(5893),n=s(7294),a=s(5117),o=s(9834),i=s(2167),r=s(4053),c=s(3751),u=s(3991);let d="runing",f="stoped",m="disabled",h="clickRun",_="clickStop",g=s(7177);function w(){let e=(0,r.useSupabaseClient)(),t=(0,r.useUser)(),[s,w]=(0,n.useState)([]),[x,k]=(0,n.useState)("00:00:00"),[p,v]=(0,n.useState)(!1),b=(0,i.Z)(new Date,"yyyy/MM/dd"),j=(0,n.useRef)(0),y=(0,n.useRef)(),[N,S]=(0,n.useState)({}),[E,M]=(0,n.useState)({}),{days:C,hours:z,minutes:A,seconds:D,isRunning:O,start:R,pause:q,reset:H}=(0,c.useStopwatch)({autoStart:!1});function J(){let e=function(){let e=new Date;console.log(e.getHours()),console.log(e.getMinutes());let t=(1-(60*e.getHours()+e.getMinutes())/1440)*100;return console.log(t),Math.floor(t)}();S({width:"".concat(e,"%")})}async function P(s){var l,n;j.current=0;let a=await (null===(l=window.versions)||void 0===l?void 0:l.screenshot());a||(a="empty");let o=JSON.parse(JSON.stringify(s));o.map(e=>(e.status=void 0,e.clickDuration=void 0,e)),await e.from("screen_shot").insert([{date:b,file_name:a,user_id:null==t?void 0:t.id}]),await e.from("task_history").upsert(o,{onConflict:"id"}),null===(n=y.current)||void 0===n||n.play()}function Q(){e.from("task_history").select("*").eq("task_date",b).then(e=>{let{error:t,data:s}=e;!t&&s.length>0&&(s.map(e=>(e.status="stoped",e)),w(s))})}async function T(){let{data:s,error:l}=await e.from("tasks").select("*");if(l||!s||0==s.length){console.log("no data");return}s.map(e=>e.status="stoped"),function(e){for(let t=e.length-1;t>0;t--){let s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}}(s);let n=s.slice(),a=[];for(let e=0;e<3;e++){let e=n.reduce((e,t)=>e+t.power,0),t=Math.random()*e,s=0;for(let e of n)if((s+=e.power)>=t){a.push(e),n.splice(n.indexOf(e),1);break}}let o=[];for(let e of a)o.push({task_date:b,task_id:e.id,task_category:e.category_name,task_name:e.task_name,duration:"00:00:00",user_id:null==t?void 0:t.id});let i=await e.from("task_history").insert(o);i.error&&console.log(i.error),Q()}function X(e,t){let l=s.slice(),n=l.find(t=>t.id===e);n&&(t===h?(n.status=d,n.clickDuration=g.toS(n.duration),H()):t===_&&(n.status=f,q()));let a=l.some(e=>e.status===d);if(a)for(let e of l)e.status!==d&&(e.status=m);else for(let e of l)e.status=f;w(l)}return(0,n.useEffect)(()=>(y.current=new Audio("/interface-soft-abbreviated-click-131438.mp3"),Q(),J(),e.from("daily_product_count").select("*").eq("task_date",b).then(e=>{let{error:t,data:s}=e;!t&&s.length>0&&k(s[0].total_count)}),()=>{O&&q()}),[]),(0,n.useEffect)(()=>{j.current=j.current+1;let e=s.slice(),t=e.find(e=>e.status===d);if(t){let s=t.clickDuration+(3600*z+60*A+D);t.duration=g.fromS(s,"hh:mm:ss");let l=0;for(let t of e)l+=g.toS(t.duration);k(g.fromS(l,"hh:mm:ss")),j.current>=10&&P(e)}w(e),J()},[D]),(0,n.useEffect)(()=>{(function(e){let t=g.toS(e);M({width:"".concat(Math.round((28800-t)*100/86400),"%")})})(x)},[x]),(0,n.useEffect)(()=>{s&&s.length>0?v(!1):v(!0)},[s]),(0,l.jsxs)("div",{className:"w-full",children:[(0,l.jsxs)("div",{className:"w-full flex flex-row items-center justify-around bg-blue-50",children:[(0,l.jsx)("h4",{children:b}),(0,l.jsx)(a.x,{c:"blue",fz:"lg",fw:700,children:x}),p&&(0,l.jsx)(o.A,{color:"blue",variant:"filled",onClick:T,children:(0,l.jsx)(u.Iwv,{size:18})})]}),(0,l.jsx)("div",{className:"h-8 bg-red-50",style:N}),(0,l.jsx)("div",{className:"h-8 bg-green-50",style:E}),s.length>0&&s.map(e=>(0,l.jsxs)("div",{className:"flex flex-col mb-4 mt-2",children:[(0,l.jsx)(a.x,{fw:500,className:"ml-2",children:e.task_category}),(0,l.jsx)(a.x,{className:"ml-2",size:"sm",children:e.task_name}),(0,l.jsxs)("div",{className:"flex flex-row justify-between items-center mt-1 bg-blue-50",children:[(0,l.jsx)(a.x,{fw:700,c:"blue",className:"ml-2",children:e.duration}),e.status===f&&(0,l.jsx)(o.A,{className:"mr-2",color:"blue",variant:"filled",onClick:()=>{var t;console.log("start"),X(e.id,h),null===(t=y.current)||void 0===t||t.play()},children:(0,l.jsx)(u.Qig,{size:18})}),e.status===d&&(0,l.jsx)(o.A,{className:"mr-2",color:"blue",variant:"filled",onClick:()=>{console.log("start"),X(e.id,_)},children:(0,l.jsx)(u.z8K,{size:18})}),e.status===m&&(0,l.jsx)(o.A,{disabled:!0,className:"mr-2",color:"blue",variant:"filled",onClick:()=>{console.log("start")},children:(0,l.jsx)(u.Qig,{size:18})})]})]},e.id))]})}}},function(e){e.O(0,[584,491,774,888,179],function(){return e(e.s=5783)}),_N_E=e.O()}]);