// KAIROSEED browser-only research fixture. NOT trusted authorization or real AI inference.
export const MODELS=['Model A (fixture)','Model B (fixture)'];
export const freshState=()=>({credits:100,notes:[],used:[],receipts:[]});
const keys=(o,k)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join(',')===k.slice().sort().join(',');
export function normalize(p){
  if(!p||!MODELS.includes(p.actor))return {ok:false,reason:'UNKNOWN_ACTOR'};
  if(p.action==='use_credits'){
    if(!keys(p.args,['amount'])||!Number.isSafeInteger(p.args.amount)||p.args.amount<1||p.args.amount>30)return {ok:false,reason:'INVALID_AMOUNT_OR_SCOPE'};
    return {ok:true,p:{actor:p.actor,action:p.action,args:{amount:p.args.amount}}};
  }
  if(p.action==='add_note'){
    if(!keys(p.args,['text'])||typeof p.args.text!=='string'||!p.args.text.trim()||p.args.text.length>160)return {ok:false,reason:'INVALID_NOTE'};
    return {ok:true,p:{actor:p.actor,action:p.action,args:{text:p.args.text.trim()}}};
  }
  return {ok:false,reason:'UNSUPPORTED_ACTION'};
}
export const binding=p=>JSON.stringify([p.actor,p.action,p.action==='add_note'?p.args.text:p.args.amount]);
export function issueDemoGrant(raw,id,time){
  const x=normalize(raw);
  if(!x.ok)return {ok:false,reason:x.reason};
  if(!Number.isSafeInteger(id)||id<1||!Number.isSafeInteger(time))return {ok:false,reason:'INVALID_CLOCK'};
  return {ok:true,grant:{id:'DEMO-'+id,actor:x.p.actor,action:x.p.action,binding:binding(x.p),issuedAt:time,expiresAt:time+60000}};
}
export function attempt(state,raw,grant,time){
  const deny=reason=>({decision:'DENY',reason,state});
  const x=normalize(raw);if(!x.ok)return deny(x.reason);
  if(!keys(grant,['id','actor','action','binding','issuedAt','expiresAt'])||
      typeof grant.id!=='string'||!/^DEMO-[1-9][0-9]*$/.test(grant.id)||
      !Number.isSafeInteger(grant.issuedAt)||!Number.isSafeInteger(grant.expiresAt)||
      grant.expiresAt!==grant.issuedAt+60000||!Number.isSafeInteger(time))
    return deny('MISSING_OR_INVALID_GRANT');
  if(time<grant.issuedAt||time>=grant.expiresAt)return deny('EXPIRED_OR_INVALID_TIME');
  if(state.used.includes(grant.id))return deny('REPLAYED_GRANT');
  const p=x.p;
  if(grant.actor!==p.actor||grant.action!==p.action||grant.binding!==binding(p))return deny('SCOPE_MISMATCH');
  if(p.action==='use_credits'&&p.args.amount>state.credits)return deny('INSUFFICIENT_SYNTHETIC_CREDITS');
  const credits=p.action==='use_credits'?state.credits-p.args.amount:state.credits;
  const notes=p.action==='add_note'?[...state.notes,p.args.text]:[...state.notes];
  const receipt={sequence:state.receipts.length+1,id:grant.id,actor:p.actor,action:p.action,
    args:{...p.args},before:state.credits,after:credits,noteCount:notes.length};
  return {decision:'ALLOW_SIMULATION',reason:'FIXTURE_GRANT_ACCEPTED',receipt,
    state:{credits,notes,used:[...state.used,grant.id],receipts:[...state.receipts,receipt]}};
}
// Read-only calculation within the same browser trust domain; not external independent review.
export function replay(state){
  if(!state||!Array.isArray(state.receipts)||!Array.isArray(state.notes)||!Array.isArray(state.used))
    return {ok:false,reason:'MALFORMED_STATE'};
  let credits=100,notes=[],ids=[];
  for(const [i,r] of state.receipts.entries()){
    if(!r||r.sequence!==i+1||ids.includes(r.id)||!/^DEMO-[1-9][0-9]*$/.test(r.id)||r.before!==credits)
      return {ok:false,reason:'INVALID_RECEIPT'};
    const x=normalize({actor:r.actor,action:r.action,args:r.args});
    if(!x.ok)return {ok:false,reason:'INVALID_RECEIPT_ARGS'};
    if(r.action==='use_credits'){
      if(r.args.amount>credits)return {ok:false,reason:'OVERSPENT'};
      credits-=r.args.amount;
    }else notes.push(r.args.text);
    if(r.after!==credits||r.noteCount!==notes.length)return {ok:false,reason:'RECEIPT_MISMATCH'};
    ids.push(r.id);
  }
  if(credits!==state.credits||JSON.stringify(notes)!==JSON.stringify(state.notes)||
     JSON.stringify(ids)!==JSON.stringify(state.used))
    return {ok:false,reason:'STATE_DIVERGENCE'};
  return {ok:true,reason:'LOCAL_REPLAY_MATCH'};
}