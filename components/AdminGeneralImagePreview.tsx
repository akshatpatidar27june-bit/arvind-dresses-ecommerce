'use client';
import {useEffect} from 'react';

export default function AdminGeneralImagePreview(){
 useEffect(()=>{
  const cleanups=new Map<HTMLInputElement,()=>void>();
  const attach=()=>{const input=document.getElementById('product-images') as HTMLInputElement|null;if(!input||cleanups.has(input))return;const host=input.closest('.upload-box');if(!host)return;let preview=host.querySelector('.general-image-preview') as HTMLDivElement|null;if(!preview){preview=document.createElement('div');preview.className='general-image-preview';host.appendChild(preview)}const render=()=>{preview!.innerHTML='';Array.from(input.files??[]).forEach(file=>{if(!file.type.startsWith('image/'))return;const wrap=document.createElement('div');const img=document.createElement('img');const objectUrl=URL.createObjectURL(file);img.src=objectUrl;img.alt=file.name;img.onload=()=>URL.revokeObjectURL(objectUrl);const name=document.createElement('small');name.textContent=file.name;wrap.append(img,name);preview!.appendChild(wrap)})};input.addEventListener('change',render);cleanups.set(input,()=>input.removeEventListener('change',render))};
 attach();const observer=new MutationObserver(attach);observer.observe(document.body,{childList:true,subtree:true});return()=>{observer.disconnect();cleanups.forEach(fn=>fn());cleanups.clear()};
 },[]);
 return <style jsx global>{`.general-image-preview{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.general-image-preview>div{width:78px;display:grid;gap:4px}.general-image-preview img{width:78px;height:88px;object-fit:cover;border-radius:8px;border:1px solid #e4ddd6;background:#f6f1ec}.general-image-preview small{font-size:8px;color:#777;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}`}</style>;
}