(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[672],{5783:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/clock",function(){return s(8906)}])},8906:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return x}});var l=s(5893),a=s(7294),n=s(5117),i=s(9834),o=s(2167),r=s(4053),c=s(3751),u=s(3991);let d="runing",f="stoped",m="disabled",h="clickRun",_="clickStop",w=s(7177);function x(){let e=(0,r.useSupabaseClient)(),t=(0,r.useUser)(),[s,x]=(0,a.useState)([]),[k,g]=(0,a.useState)("00:00:00"),[p,v]=(0,a.useState)(!1),j=(0,o.Z)(new Date,"yyyy/MM/dd"),b=(0,a.useRef)(0),y=(0,a.useRef)(),[N,S]=(0,a.useState)({}),[E,C]=(0,a.useState)({}),{days:M,hours:z,minutes:A,seconds:D,isRunning:O,start:R,pause:q,reset:J}=(0,c.useStopwatch)({autoStart:!1});function P(){let e=function(){let e=new Date,t=24-e.getHours(),s=60-e.getMinutes();return Math.floor((60*t+s)/1440*100)}();S({width:"".concat(e,"%")})}async function Q(s){var l,a;b.current=0;let n=await (null===(l=window.versions)||void 0===l?void 0:l.screenshot()),i=JSON.parse(JSON.stringify(s));i.map(e=>(e.status=void 0,e.clickDuration=void 0,e)),await e.from("screen_shot").insert([{date:j,file_name:n,user_id:null==t?void 0:t.id}]),await e.from("task_history").upsert(i,{onConflict:"id"}),null===(a=y.current)||void 0===a||a.play()}function T(){e.from("task_history").select("*").eq("task_date",j).then(e=>{let{error:t,data:s}=e;!t&&s.length>0&&(s.map(e=>(e.status="stoped",e)),x(s))})}async function X(){let{data:s,error:l}=await e.from("tasks").select("*");if(l||!s||0==s.length){console.log("no data");return}s.map(e=>e.status="stoped"),function(e){for(let t=e.length-1;t>0;t--){let s=Math.floor(Math.random()*(t+1));[e[t],e[s]]=[e[s],e[t]]}}(s);let a=s.slice(),n=[];for(let e=0;e<3;e++){let e=a.reduce((e,t)=>e+t.power,0),t=Math.random()*e,s=0;for(let e of a)if((s+=e.power)>=t){n.push(e),a.splice(a.indexOf(e),1);break}}let i=[];for(let e of n)i.push({task_date:j,task_id:e.id,task_category:e.category_name,task_name:e.task_name,duration:"00:00:00",user_id:null==t?void 0:t.id});let o=await e.from("task_history").insert(i);o.error&&console.log(o.error),T()}function H(e,t){let l=s.slice(),a=l.find(t=>t.id===e);a&&(t===h?(a.status=d,a.clickDuration=w.toS(a.duration),J()):t===_&&(a.status=f,q()));let n=l.some(e=>e.status===d);if(n)for(let e of l)e.status!==d&&(e.status=m);else for(let e of l)e.status=f;x(l)}return(0,a.useEffect)(()=>(y.current=new Audio("/audio.wav"),T(),P(),e.from("daily_product_count").select("*").eq("task_date",j).then(e=>{let{error:t,data:s}=e;!t&&s.length>0&&g(s[0].total_count)}),()=>{O&&q()}),[]),(0,a.useEffect)(()=>{b.current=b.current+1;let e=s.slice(),t=e.find(e=>e.status===d);if(t){let s=t.clickDuration+(3600*z+60*A+D);t.duration=w.fromS(s,"hh:mm:ss");let l=0;for(let t of e)l+=w.toS(t.duration);g(w.fromS(l,"hh:mm:ss")),b.current>=10&&Q(e)}x(e),P()},[D]),(0,a.useEffect)(()=>{(function(e){let t=w.toS(e);C({width:"".concat(Math.round((28800-t)*100/86400),"%")})})(k)},[k]),(0,a.useEffect)(()=>{s&&s.length>0?v(!1):v(!0)},[s]),(0,l.jsxs)("div",{className:"w-full",children:[(0,l.jsxs)("div",{className:"w-full flex flex-row items-center justify-around bg-blue-50",children:[(0,l.jsx)("h4",{children:j}),(0,l.jsx)(n.x,{c:"blue",fz:"lg",fw:700,children:k}),p&&(0,l.jsx)(i.A,{color:"blue",variant:"filled",onClick:X,children:(0,l.jsx)(u.Iwv,{size:18})})]}),(0,l.jsx)("div",{className:"h-8 bg-red-50",style:N}),(0,l.jsx)("div",{className:"h-8 bg-green-50",style:E}),s.length>0&&s.map(e=>(0,l.jsxs)("div",{className:"flex flex-col mb-4 mt-2",children:[(0,l.jsx)(n.x,{fw:500,className:"ml-2",children:e.task_category}),(0,l.jsx)(n.x,{className:"ml-2",size:"sm",children:e.task_name}),(0,l.jsxs)("div",{className:"flex flex-row justify-between items-center mt-1 bg-blue-50",children:[(0,l.jsx)(n.x,{fw:700,c:"blue",className:"ml-2",children:e.duration}),e.status===f&&(0,l.jsx)(i.A,{className:"mr-2",color:"blue",variant:"filled",onClick:()=>{var t;console.log("start"),H(e.id,h),null===(t=y.current)||void 0===t||t.play()},children:(0,l.jsx)(u.Qig,{size:18})}),e.status===d&&(0,l.jsx)(i.A,{className:"mr-2",color:"blue",variant:"filled",onClick:()=>{console.log("start"),H(e.id,_)},children:(0,l.jsx)(u.z8K,{size:18})}),e.status===m&&(0,l.jsx)(i.A,{disabled:!0,className:"mr-2",color:"blue",variant:"filled",onClick:()=>{console.log("start")},children:(0,l.jsx)(u.Qig,{size:18})})]})]},e.id))]})}}},function(e){e.O(0,[584,491,774,888,179],function(){return e(e.s=5783)}),_N_E=e.O()}]);