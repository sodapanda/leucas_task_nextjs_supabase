(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[672],{5783:function(t,e,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/clock",function(){return s(8906)}])},8906:function(t,e,s){"use strict";s.r(e),s.d(e,{default:function(){return p}});var l=s(5893),o=s(7294),a=s(5117),n=s(9834),i=s(2167),r=s(4053),c=s(5217),u=s(3991);let d="runing",f="stoped",h="disabled",m="clickRun",_="clickStop",k=s(7177);function p(){let t=(0,r.useSupabaseClient)(),e=(0,r.useUser)(),[s,p]=(0,o.useState)([]),[x,g]=(0,o.useState)("00:00:00"),[j,w]=(0,o.useState)(!1),y=(0,i.Z)(new Date,"yyyy/MM/dd");(0,o.useEffect)(()=>(N(),t.from("daily_product_count").select("*").eq("task_date",y).then(t=>{let{error:e,data:s}=t;!e&&s.length>0&&g(s[0].total_count)}),()=>{b.stop()}),[]);let b=(0,c.Y)(()=>{p(e=>{let s=e.slice(),l=s.find(t=>t.status===d);if(l){l.duration=k.fromS(k.toS(l.duration)+1,"hh:mm:ss");let e=0;for(let t of s)e+=k.toS(t.duration);if(g(k.fromS(e,"hh:mm:ss")),e%60==0){let e=JSON.parse(JSON.stringify(s));e.map(t=>(t.status=void 0,t)),t.from("task_history").upsert(e,{onConflict:"id"}).then(t=>{console.log(t)})}}return s})},1e3);function N(){t.from("task_history").select("*").eq("task_date",y).then(t=>{let{error:e,data:s}=t;!e&&s.length>0&&(s.map(t=>(t.status="stoped",t)),p(s))})}async function v(){let{data:s,error:l}=await t.from("tasks").select("*");if(l||!s||0==s.length){console.log("no data");return}s.map(t=>t.status="stoped"),function(t){for(let e=t.length-1;e>0;e--){let s=Math.floor(Math.random()*(e+1));[t[e],t[s]]=[t[s],t[e]]}}(s);let o=s.slice(),a=[];for(let t=0;t<3;t++){let t=o.reduce((t,e)=>t+e.power,0),e=Math.random()*t,s=0;for(let t of o)if((s+=t.power)>=e){a.push(t),o.splice(o.indexOf(t),1);break}}let n=[];for(let t of a)n.push({task_date:y,task_id:t.id,task_category:t.category_name,task_name:t.task_name,duration:"00:00:00",user_id:null==e?void 0:e.id});let i=await t.from("task_history").insert(n);i.error&&console.log(i.error),N()}function S(t,e){let l=s.slice(),o=l.find(e=>e.id===t);o&&(e===m?(o.status=d,b.start()):e===_&&(o.status=f,b.stop()));let a=l.some(t=>t.status===d);if(a)for(let t of l)t.status!==d&&(t.status=h);else for(let t of l)t.status=f;p(l)}return(0,o.useEffect)(()=>{s&&s.length>0?w(!1):w(!0)},[s]),(0,l.jsxs)("div",{className:"w-full",children:[(0,l.jsxs)("div",{className:"w-full flex flex-row items-center justify-around bg-blue-50",children:[(0,l.jsx)("h4",{children:y}),(0,l.jsxs)(a.x,{children:["今日总时长",x]}),j&&(0,l.jsx)(n.A,{color:"blue",variant:"filled",onClick:v,children:(0,l.jsx)(u.Iwv,{size:18})})]}),s.length>0&&s.map(t=>(0,l.jsxs)("div",{className:"flex flex-row justify-between mb-2",children:[(0,l.jsxs)(a.x,{className:"ml-2",children:[t.task_category," ",t.task_name]}),(0,l.jsx)(a.x,{children:t.duration}),t.status===f&&(0,l.jsx)(n.A,{className:"mr-2",color:"blue",variant:"filled",onClick:()=>{console.log("start"),S(t.id,m)},children:(0,l.jsx)(u.Qig,{size:18})}),t.status===d&&(0,l.jsx)(n.A,{className:"mr-2",color:"blue",variant:"filled",onClick:()=>{console.log("start"),S(t.id,_)},children:(0,l.jsx)(u.z8K,{size:18})}),t.status===h&&(0,l.jsx)(n.A,{disabled:!0,className:"mr-2",color:"blue",variant:"filled",onClick:()=>{console.log("start")},children:(0,l.jsx)(u.Qig,{size:18})})]},t.id))]})}}},function(t){t.O(0,[584,104,774,888,179],function(){return t(t.s=5783)}),_N_E=t.O()}]);