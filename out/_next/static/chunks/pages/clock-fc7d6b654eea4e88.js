(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[672],{5783:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/clock",function(){return s(8906)}])},8906:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return _}});var l=s(5893),a=s(7294),n=s(5117),i=s(9834),o=s(2167),r=s(4053),c=s(3751),u=s(3991);let f="runing",d="stoped",h="disabled",m="clickRun",x="clickStop",k=s(7177);function _(){let e=(0,r.useSupabaseClient)(),t=(0,r.useUser)(),[s,_]=(0,a.useState)([]),[p,w]=(0,a.useState)("00:00:00"),[g,j]=(0,a.useState)(!1),b=(0,o.Z)(new Date,"yyyy/MM/dd"),v=(0,a.useRef)(0),y=(0,a.useRef)(),[N,S]=(0,a.useState)({}),[z,C]=(0,a.useState)({}),[E,M]=(0,a.useState)(!1),{days:A,hours:D,minutes:O,seconds:q,isRunning:R,start:J,pause:K,reset:P}=(0,c.useStopwatch)({autoStart:!1});function Q(){let e=function(){let e=new Date,t=(1-(60*e.getHours()+e.getMinutes())/1440)*100;return Math.floor(t)}();S({width:"".concat(e,"%")})}async function T(t){v.current=0;let s=JSON.parse(JSON.stringify(t));if(s.map(e=>(e.status=void 0,e.clickDuration=void 0,e)),await e.from("task_history").upsert(s,{onConflict:"id"}),!E){var l;null===(l=y.current)||void 0===l||l.play()}}function X(){e.from("task_history").select("*").eq("task_date",b).then(e=>{let{error:t,data:s}=e;!t&&s.length>0&&(s.map(e=>(e.status="stoped",e)),_(s))})}async function H(){let{data:s,error:l}=await e.from("tasks").select("*").eq("active",!0);if(l||!s||0==s.length){console.log("no data");return}s.map(e=>e.status="stoped"),function(e){for(let t=e.length-1;t>0;t--){let s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}}(s);let a=s.slice(),n=[];for(let e=0;e<3;e++){let e=a.reduce((e,t)=>e+t.power,0),t=Math.random()*e,s=0;for(let e of a)if((s+=e.power)>=t){n.push(e),a.splice(a.indexOf(e),1);break}}let i=[];for(let e of n)i.push({task_date:b,task_id:e.id,task_category:e.tasktype,task_name:e.task_name,duration:"00:00:00",user_id:null==t?void 0:t.id});let o=await e.from("task_history").insert(i);o.error&&console.log(o.error),X()}function I(e,t){let l=s.slice(),a=l.find(t=>t.id===e);a&&(t===m?(a.status=f,a.clickDuration=k.toS(a.duration),P()):t===x&&(a.status=d,K()));let n=l.some(e=>e.status===f);if(n)for(let e of l)e.status!==f&&(e.status=h);else for(let e of l)e.status=d;_(l)}return(0,a.useEffect)(()=>(y.current=new Audio("/interface-soft-abbreviated-click-131438.mp3"),X(),Q(),e.from("daily_product_count").select("*").eq("task_date",b).then(e=>{let{error:t,data:s}=e;!t&&s.length>0&&w(s[0].total_count)}),()=>{R&&K()}),[]),(0,a.useEffect)(()=>{v.current=v.current+1;let e=s.slice(),t=e.find(e=>e.status===f);if(t){let s=t.clickDuration+(3600*D+60*O+q);t.duration=k.fromS(s,"hh:mm:ss");let l=0;for(let t of e)l+=k.toS(t.duration);w(k.fromS(l,"hh:mm:ss")),v.current>=10&&T(e)}_(e),Q()},[q]),(0,a.useEffect)(()=>{(function(e){let t=k.toS(e);C({width:"".concat(Math.round((28800-t)*100/86400),"%")})})(p)},[p]),(0,a.useEffect)(()=>{s&&s.length>0?j(!1):j(!0)},[s]),(0,l.jsxs)("div",{className:"w-full",children:[(0,l.jsxs)("div",{className:"w-full flex flex-row items-center justify-around bg-blue-50",children:[(0,l.jsx)("h4",{children:b}),(0,l.jsx)(n.x,{c:"blue",fz:"lg",fw:700,children:p}),g&&(0,l.jsx)(i.A,{color:"blue",variant:"filled",onClick:H,children:(0,l.jsx)(u.Iwv,{size:18})}),(0,l.jsx)(i.A,{color:"blue",variant:"filled",onClick:()=>{M(!E)},children:E?(0,l.jsx)(u.d2K,{size:18}):(0,l.jsx)(u.Am6,{size:18})})]}),(0,l.jsx)("div",{className:"h-8 bg-red-50",style:N}),(0,l.jsx)("div",{className:"h-8 bg-green-50",style:z}),s.length>0&&s.map(e=>(0,l.jsxs)("div",{className:"flex flex-col mb-4 mt-2",children:[(0,l.jsx)(n.x,{size:"xs",className:"ml-2",children:e.task_category}),(0,l.jsx)(n.x,{className:"ml-2",fw:500,children:e.task_name}),(0,l.jsxs)("div",{className:"flex flex-row justify-between items-center mt-1 bg-blue-50",children:[(0,l.jsx)(n.x,{fw:700,c:"blue",className:"ml-2",children:e.duration}),e.status===d&&(0,l.jsx)(i.A,{className:"mr-2",color:"blue",variant:"filled",onClick:()=>{var t;console.log("start"),I(e.id,m),null===(t=y.current)||void 0===t||t.play()},children:(0,l.jsx)(u.Qig,{size:18})}),e.status===f&&(0,l.jsx)(i.A,{className:"mr-2",color:"blue",variant:"filled",onClick:()=>{console.log("start"),I(e.id,x)},children:(0,l.jsx)(u.z8K,{size:18})}),e.status===h&&(0,l.jsx)(i.A,{disabled:!0,className:"mr-2",color:"blue",variant:"filled",onClick:()=>{console.log("start")},children:(0,l.jsx)(u.Qig,{size:18})})]})]},e.id))]})}}},function(e){e.O(0,[584,491,774,888,179],function(){return e(e.s=5783)}),_N_E=e.O()}]);