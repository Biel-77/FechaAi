import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';
const html=htm.bind(React.createElement);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt=new Intl.NumberFormat('pt-BR');

function useInView(){
  const r=useRef(null);const [v,setV]=useState(false);
  useEffect(()=>{
    if(!r.current)return;
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect()}},{threshold:.3});
    o.observe(r.current);return()=>o.disconnect();
  },[]);
  return [r,v];
}
function spot(e){const b=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--x',(e.clientX-b.left)+'px');e.currentTarget.style.setProperty('--y',(e.clientY-b.top)+'px')}

function Logo(){
  return html`<a className="logo" href="#topo" aria-label="FechaAí">
    <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
      <defs><linearGradient id="lg" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#34D17A"/><stop offset="1" stopColor="#C5F04D"/></linearGradient></defs>
      <path d="M31 11.5A13.5 13.5 0 1 0 31 28.5" fill="none" stroke="url(#lg)" strokeWidth="7" strokeLinecap="round"/>
      <circle cx="22.5" cy="20" r="3.4" fill="#C5F04D"/>
    </svg>
    <span>FechaA<b>í</b></span></a>`;
}

function Money({to,run}){
  const [v,setV]=useState(reduce?to:0);
  useEffect(()=>{
    if(!run||reduce)return;
    let raf,t0;const f=t=>{t0=t0||t;const p=Math.min((t-t0)/1100,1);setV(Math.round(to*(1-Math.pow(1-p,3))));if(p<1)raf=requestAnimationFrame(f)};
    raf=requestAnimationFrame(f);return()=>cancelAnimationFrame(raf);
  },[run,to]);
  return html`<span>R$ ${fmt.format(v)}</span>`;
}

const STAGES=['Rascunho','Enviada','Visualizada','Aprovada'];
const ACTIVITY=[
  ['Proposta pronta para enviar','Studio Aurora · agora'],
  ['Link enviado para Maria','Aguardando visualização'],
  ['Maria abriu sua proposta','há poucos segundos'],
  ['Negócio fechado','R$ 4.800 aprovados por Maria']
];
function Workspace({scrollTarget}){
  const phoneRef=useRef(null);
  const [step,setStep]=useState(0);
  useEffect(()=>{
    const hero=scrollTarget.current;
    const phone=phoneRef.current;
    if(!hero||!phone)return;
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tiltScale=reduceMotion ? 0.55 : 1;
    let heroTop=hero.getBoundingClientRect().top+window.scrollY;
    let heroHeight=hero.offsetHeight;
    let frame=0;
    let currentStep=-1;
    const update=()=>{
      frame=0;
      const scrollRange=Math.max(heroHeight-window.innerHeight*.55,window.innerHeight*.42);
      const progress=Math.min(1,Math.max(0,(window.scrollY-heroTop)/scrollRange));
      phone.style.transform=`rotateY(${-9+progress*16*tiltScale}deg) rotateX(${4-progress*7*tiltScale}deg) translateY(${-progress*12*tiltScale}px) scale(${0.96+progress*0.08*tiltScale})`;
      const nextStep=Math.min(3,Math.floor(progress*4));
      if(nextStep!==currentStep){currentStep=nextStep;setStep(nextStep)}
    };
    const requestUpdate=()=>{if(!frame)frame=requestAnimationFrame(update)};
    const handleResize=()=>{
      heroTop=hero.getBoundingClientRect().top+window.scrollY;
      heroHeight=hero.offsetHeight;
      requestUpdate();
    };
    update();
    window.addEventListener('scroll',requestUpdate,{passive:true});
    window.addEventListener('resize',handleResize);
    return()=>{
      window.removeEventListener('scroll',requestUpdate);
      window.removeEventListener('resize',handleResize);
      if(frame)cancelAnimationFrame(frame);
    };
  },[scrollTarget]);
  const items=[['Design das páginas','R$ 1.800'],['Desenvolvimento','R$ 2.400'],['Hospedagem (1 ano)','R$ 600']];
  return html`<div className="hero-visual">
    <div className="hero-glow" aria-hidden="true"></div>
    <div className="floating-card viewer-card" aria-hidden="true">
      <span className="avatar">M</span><span><b>${ACTIVITY[step][0]}</b><small>${ACTIVITY[step][1]}</small></span><i/>
    </div>
    <div className="win" ref=${phoneRef} aria-label="Demonstração: proposta sendo enviada e aprovada">
      <div className="phone-status"><span>9:41</span><span aria-hidden="true">●●●　◖　▰</span></div>
      <div className="phone-notch" aria-hidden="true"></div>
      <div className="bar"><span className="brand-mark">f.</span><span>Proposta nº 0148 <small>Studio Aurora</small></span>
        <span className=${'chip'+(step===3?' ok':'')}>${STAGES[step]}</span></div>
      <div className="body">
        <div className="proposal-heading"><span>PROPOSTA COMERCIAL</span><b>Identidade digital</b><small>Preparada para Maria Souza</small></div>
        <div className="items">
          ${items.map((it,i)=>html`<div key=${i} className=${'it'+(step>=1&&step<3&&i===step-1?' on':'')}><span>${it[0]}</span><b>${it[1]}</b></div>`)}
          <div className="tot"><span>Total do projeto</span><strong><${Money} to=${4800} run=${true}/></strong></div>
        </div>
        <div className="proposal-footer"><span className="secure-icon">✓</span><span>Proposta segura e pronta para aprovar</span></div>
      </div>
      <div className="phone-home" aria-hidden="true"></div>
    </div>
    <div className="floating-card approval-card"><i>✓</i><span><b>Aprovação digital</b><small>Fechamento direto pelo celular</small></span></div>
  </div>`;
}

function Hero(){
  const heroRef=useRef(null);
  const words=[['Propostas'],['que'],['fecham','g'],['negócio.','g']];
  return html`<section className="hero" id="topo" ref=${heroRef}><div className="wrap">
    <div>
      <h1>${words.map((w,i)=>html`<span key=${i}><span className="w"><span className=${w[1]||''} style=${{animationDelay:(i*90)+'ms'}}>${w[0]}</span></span> </span>`)}</h1>
      <p className="lead">Do orçamento à assinatura, tudo em um só lugar. Monte em minutos, envie por link e acompanhe cada passo do cliente.</p>
      <div className="cta"><a className="btn" href="#precos">Começar grátis</a><a className="btn ghost" href="#como">Ver como funciona</a></div>
      <p className="note">Sem cartão de crédito. Sua primeira proposta em menos de 3 minutos.</p>
    </div>
    <${Workspace} scrollTarget=${heroRef}/>
  </div></section>`;
}

const STEPS=[
  ['Monte','Escolha um modelo e deixe a Fechaí preencher com os seus preços.'],
  ['Envie','Um link com a sua marca, por WhatsApp ou e-mail.'],
  ['Acompanhe','Saiba quando o cliente abriu, leu e quanto tempo ficou em cada parte.'],
  ['Feche','Aprovação e assinatura digital na mesma página.']
];
function StepVisual({i}){
  if(i===0)return html`<div className="stage" key=${i}><div className="pill"><span>Modelo</span><b>Serviço recorrente</b></div><div className="pill"><span>Cliente</span><b>Studio Aurora</b></div><div className="pill"><span>Itens do catálogo</span><b>3 adicionados</b></div><div className="pill"><span>Total</span><b>R$ 4.800</b></div></div>`;
  if(i===1)return html`<div className="stage" key=${i}><div className="lnk">fechai.app/p/aurora-0148</div><div className="pill"><span>WhatsApp</span><b>Enviado para Maria</b></div><div className="pill"><span>E-mail</span><b>Cópia para o financeiro</b></div></div>`;
  if(i===2)return html`<div className="stage" key=${i}><div className="pill"><span>14:02</span><b>Maria abriu a proposta</b></div><div className="pill"><span>14:05</span><b>Passou 3 min nos preços</b></div><div className="pill"><span>14:09</span><b>Compartilhou com o sócio</b></div><div className="live" style=${{color:'var(--lime)',display:'flex',gap:'.5rem',alignItems:'center'}}><i style=${{width:8,height:8,borderRadius:'50%',background:'var(--lime)'}}/>Ao vivo</div></div>`;
  return html`<div className="stage" key=${i}><div className="pill"><span>Status</span><b style=${{color:'var(--lime)'}}>Aprovada</b></div><div className="sig">Maria Souza</div><div className="pill"><span>Assinada em</span><b>hoje, 14:21</b></div><div className="pill"><span>Contrato</span><b>Gerado automaticamente</b></div></div>`;
}
function Steps(){
  const [i,setI]=useState(0);
  useEffect(()=>{const id=setTimeout(()=>setI(s=>(s+1)%4),4500);return()=>clearTimeout(id)},[i]);
  return html`<section id="como"><div className="wrap">
    <div className="head"><h2>Do pedido ao “sim” em quatro passos</h2><p>Cada etapa fica visível para você e para o cliente.</p></div>
    <div className="steps">
      <div className="st">${STEPS.map((s,k)=>html`<button key=${k} className=${'s'+(k===i?' on':'')} onClick=${()=>setI(k)} aria-pressed=${k===i}><b><em>${k+1}</em>${s[0]}</b><p>${s[1]}</p>${k===i&&html`<span className="pg" key=${'p'+i}/>`}</button>`)}</div>
      <${StepVisual} i=${i}/>
    </div></div></section>`;
}

function Bento(){
  const [r1,v1]=useInView();const [r2,v2]=useInView();
  const bars=[34,48,42,63,71,88];
  return html`<section id="recursos" style=${{background:'var(--bg2)'}}><div className="wrap">
    <div className="head"><h2>Tudo o que uma proposta profissional precisa</h2><p>Menos tempo no documento, mais tempo com o cliente.</p></div>
    <div className="bento">
      <article className="bx big" onMouseMove=${spot}>
        <h3>Painel de resultados</h3><p>Veja quantas propostas foram enviadas, abertas e aprovadas, e onde você perde negócios.</p>
        <div className="kpi"><div><b><${Money} to=${4800} run=${v1}/></b><span>fechado este mês (exemplo)</span></div></div>
        <div className=${'chart'+(v1?' in':'')} ref=${r1} role="img" aria-label="Gráfico de exemplo com crescimento">${bars.map((h,i)=>html`<div key=${i} style=${{'--h':h+'%','--i':i}}/>`)}</div>
      </article>
      <article className="bx" onMouseMove=${spot}>
        <h3>Rastreio em tempo real</h3><p>Receba aviso quando o cliente abrir e quando ele reler os preços.</p>
        <div className="live"><i/>Maria está vendo agora</div>
      </article>
      <article className="bx" onMouseMove=${spot}>
        <h3>Modelos prontos</h3><p>Reforma, design, marketing, consultoria. Ajuste uma vez e reutilize sempre.</p>
        <div className="tags"><span>Reforma</span><span>Site</span><span>Social media</span><span>Consultoria</span></div>
      </article>
      <article className=${'bx'+(v2?' in':'')} ref=${r2} onMouseMove=${spot}>
        <h3>Assinatura digital</h3><p>O cliente aprova e assina sem baixar nada.</p>
        <div className="ck"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C5F04D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg></div>
      </article>
      <article className="bx" onMouseMove=${spot}>
        <h3>Catálogo de preços</h3><p>Salve serviços e valores. O orçamento se monta com poucos cliques.</p>
        <div className="tags"><span>Hora técnica</span><span>Pacotes</span><span>Descontos</span></div>
      </article>
    </div></div></section>`;
}

function Pricing(){
  const [a,setA]=useState(true);
  const P=(m,y)=>a?y:m;
  return html`<section id="precos"><div className="wrap">
    <div className="head"><h2>Escolha seu plano</h2><p>Comece grátis. Evolua quando as propostas aprovadas pedirem mais.</p></div>
    <div className="tg" role="group" aria-label="Cobrança"><button className=${a?'':'on'} onClick=${()=>setA(false)}>Mensal</button><button className=${a?'on':''} onClick=${()=>setA(true)}>Anual (economize 20%)</button></div>
    <div className="plans">
      <article className="plan"><h3>Grátis</h3><div className="price">R$ 0</div><p>Para sentir como é fechar mais rápido.</p>
        <ul><li>3 propostas por mês</li><li>Link com acompanhamento</li><li>Modelos básicos</li></ul><a className="btn ghost" href="#">Começar grátis</a></article>
      <article className="plan pop"><span className="tag">Mais popular</span><h3>Pro</h3><div className="price">R$ ${P(39,31)}<small> /mês</small></div><p>${a?'Cobrança anual.':'Cobrança mensal, cancele quando quiser.'}</p>
        <ul><li>Propostas ilimitadas</li><li>Sua marca e seus preços salvos</li><li>Assinatura digital</li><li>Lembretes por WhatsApp</li></ul><a className="btn" href="#">Assinar Pro</a></article>
      <article className="plan"><h3>Equipe</h3><div className="price">R$ ${P(99,79)}<small> /mês</small></div><p>${a?'Cobrança anual.':'Cobrança mensal, cancele quando quiser.'}</p>
        <ul><li>Tudo do Pro</li><li>Até 5 pessoas</li><li>Biblioteca compartilhada</li><li>Relatório de conversão</li></ul><a className="btn ghost" href="#">Assinar Equipe</a></article>
    </div></div></section>`;
}

const FAQ=[
  ['Preciso saber design?','Não. Você escolhe um modelo, a Fechaí preenche e aplica a sua marca. O resultado já sai profissional.'],
  ['O cliente precisa criar conta?','Não. Ele abre o link, lê a proposta e aprova pelo celular ou computador.'],
  ['Posso usar meus próprios preços?','Sim. Salve seus serviços e valores uma vez e reaproveite em qualquer proposta.'],
  ['Como funciona a assinatura?','Ao aprovar, o cliente assina digitalmente na própria página e você recebe o documento assinado.'],
  ['Posso cancelar quando quiser?','Sim. Sem multa e sem burocracia. Suas propostas continuam disponíveis para download.']
];
function Faq(){
  return html`<section id="duvidas" style=${{paddingTop:0}}><div className="wrap">
    <div className="head"><h2>Dúvidas? A gente responde</h2></div>
    <div className="faq">${FAQ.map((f,i)=>html`<details key=${i} name="faq" open=${i===0}><summary>${f[0]}</summary><p>${f[1]}</p></details>`)}</div>
  </div></section>`;
}

function App(){
  return html`<${React.Fragment}>
    <header><div className="wrap"><${Logo}/>
      <nav aria-label="Principal"><a href="#como">Como funciona</a><a href="#recursos">Recursos</a><a href="#precos">Preços</a><a href="#duvidas">Dúvidas</a></nav>
      <div className="hr"><a className="btn ghost" href="#">Entrar</a><a className="btn" href="#precos">Criar conta</a></div></div></header>
    <main><${Hero}/><${Steps}/><${Bento}/><${Pricing}/><${Faq}/>
      <section style=${{paddingTop:0}}><div className="wrap"><div className="final"><h2>Menos tempo orçando. Mais tempo fazendo.</h2><a className="btn" href="#precos">Criar minha primeira proposta</a></div></div></section>
    </main>
    <footer><div className="wrap"><div><${Logo}/></div><div><a href="#">Termos de uso</a><a href="#">Privacidade</a><a href="#">Contato</a></div></div></footer>
  <//>`;
}
export default App;
