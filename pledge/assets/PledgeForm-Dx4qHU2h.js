import{e as P,d as _,o as i,c as t,f as s,n as g,u as y,_ as v,t as d,g as c,F as f,r as D,b as F,a as R,w as k,v as w}from"./index-DGayuQ5p.js";const x={title:"Kathina Donations",description:"Please submit your pledge for the Kathina donations.",items:[{title:"Temple Operational Expenses",description:"These are the projected expenses related to continuied operation of the temple over the coming year."},{title:"Electricity bill",description:"One unit is one-month sponsorship.",unitPrice:200,unitsRequired:12,unitsReceived:2,unitLabelSingular:"month",unitLabelPlural:"months"},{title:"Average heating bill",unitPrice:80,unitsRequired:12,unitsReceived:0,unitLabelSingular:"month",unitLabelPlural:"months"},{title:"100 Watt equivalent, 6-pack LED lamps",unitsRequired:3,unitsReceived:2,unitLabelSingular:"pack",unitLabelPlural:"packs"}]},p={spreadsheetId:"xx",danaFormTab:"Dana",donationFormTab:"Donations"},A=P("pledgeSubmission",{state:()=>({danaPledgeForm:null,donationPledgeForm:null,name:"",email:"",phone:""}),actions:{async loadForm(a,n){return x},async loadDanaPledgeFrom(){this.danaPledgeForm=await this.loadForm(p.spreadsheetId,p.danaFormTab)},async loadDonationsPledgeFrom(){this.donationPledgeForm=await this.loadForm(p.spreadsheetId,p.danaFormTab)},setDanaPledge(a,n){this.danaPledgeForm.items.find(o=>o.title==a).unitsPledged=n},setDonationPledge(a,n){this.donationPledgeForm.items.find(o=>o.title==a).unitsPledged=n}}}),L={class:"progress"},T=["aria-valuenow","aria-valuemax"],S=["aria-valuenow","aria-valuemax"],q=_({__name:"ProgressBar",props:{max:{},current:{}},setup(a){const n=a,o=Math.round(n.current/n.max*100),u=100-o;return(r,m)=>(i(),t("div",L,[s("div",{class:"progress-bar bg-success",role:"progressbar","aria-valuenow":r.current,"aria-valuemin":0,"aria-valuemax":r.max,style:g("width:"+y(o)+"%")},null,12,T),s("div",{class:"progress-bar bg-danger",role:"progressbar","aria-valuenow":r.current,"aria-valuemin":0,"aria-valuemax":r.max,style:g("width:"+u+"%")},null,12,S)]))}}),H=v(q,[["__scopeId","data-v-4b69f0d8"]]),I=["innerHTML"],M={key:0},V=["innerHTML"],B={key:1,class:"row"},N={key:0,class:""},$={class:"field-row"},E=["for"],C=["id"],O={key:0},K={class:""},U=["max","id","aria-describedby","onUpdate:modelValue"],j=_({__name:"PledgeForm",props:{formDefinition:{}},setup(a){const n=a;return(o,u)=>{var r,m,h;return i(),t(f,null,[s("h1",null,d((r=n.formDefinition)==null?void 0:r.title),1),n.formDefinition&&((m=n.formDefinition.description)==null?void 0:m.length)>0?(i(),t("div",{key:0,innerHTML:n.formDefinition.description},null,8,I)):c("",!0),(i(!0),t(f,null,D((h=n.formDefinition)==null?void 0:h.items,(e,l)=>(i(),t("div",{key:l},[!e.unitsRequired||e.unitsRequired==0?(i(),t("div",M,[s("h2",null,d(e.title),1),e.description&&e.description.length>0?(i(),t("div",{key:0,innerHTML:e.description},null,8,V)):c("",!0)])):(i(),t("div",B,[e.unitsRequired>(e.unitsReceived?e.unitsReceived:0)?(i(),t("div",N,[s("div",$,[s("label",{for:"field"+l,class:"form-label"},d(e.title),9,E),s("div",{id:"fieldHelp"+l},[F(d(e.description)+" ",1),e.unitPrice&&e.unitPrice>0?(i(),t("span",O,"One sponsorship = $"+d(e.unitPrice)+".",1)):c("",!0)],8,C),s("div",K,[R(H,{current:e.unitsReceived?e.unitsReceived:0,max:e.unitsRequired},null,8,["current","max"]),u[0]||(u[0]=s("span",{class:"contribution-prompt"},"Your Contribution: ",-1)),k(s("input",{type:"number",min:"0",max:e.unitsRequired-(e.unitsReceived?e.unitsReceived:0),class:"col-1",id:"fieldHelp"+l,"aria-describedby":"fieldHelp"+l,"onUpdate:modelValue":b=>n.formDefinition.items[l].unitsPledged=b,value:"0"},null,8,U),[[w,n.formDefinition.items[l].unitsPledged]])])])])):c("",!0)]))]))),128))],64)}}}),W=v(j,[["__scopeId","data-v-49207f47"]]);export{W as P,A as u};
