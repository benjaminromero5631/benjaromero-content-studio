fetch('/content/production.json',{cache:'no-cache'}).then(r=>r.json()).then(data=>{
  const ig=(data.links||[]).find(x=>String(x.label).toLowerCase()==='instagram')?.url||data.profile?.instagramUrl;
  if(ig&&/^https:\/\//i.test(ig))['instagramLink','heroInstagram','aboutInstagram','footerInstagram'].forEach(id=>{const a=document.getElementById(id);if(a)a.href=ig});
  const holder=document.getElementById('socialLinks');
  if(holder)holder.innerHTML=(data.links||[]).filter(x=>x.url&&/^https:\/\//i.test(x.url)).map(x=>`<a href="${x.url}" target="_blank" rel="noreferrer">${String(x.label).replace(/[<>]/g,'').toUpperCase()} ↗</a>`).join(' · ');
}).catch(()=>{});
