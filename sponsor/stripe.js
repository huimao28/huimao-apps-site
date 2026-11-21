const form=document.querySelector('#stripe-form');
const message=document.querySelector('#stripe-message');
form?.addEventListener('submit',async event=>{
 event.preventDefault();
 const button=form.querySelector('button');
 const amount=Number(form.amount.value);
 if(!Number.isFinite(amount)||amount<1||amount>1000){message.textContent='请输入 $1 至 $1000 之间的金额。';return}
 button.disabled=true;button.textContent='正在前往 Stripe…';message.textContent='正在创建安全结账页面。';
 try{
  const response=await fetch('https://pay.huimaotech.com/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount})});
  const data=await response.json();
  if(!response.ok||!data.url)throw new Error(data.error||'checkout failed');
  location.href=data.url;
 }catch(error){message.textContent='暂时无法启动支付，请稍后重试。';button.disabled=false;button.textContent='使用 Stripe 支付'}
});