'use client';

type Props={images:string[];onRemove:(index:number)=>void};

export default function AdminGeneralImagePreview({images,onRemove}:Props){
 if(!images.length)return null;
 return <div className="general-image-preview" aria-label="General product photos">
  {images.map((url,index)=><div className="general-image-item" key={`${url}-${index}`}>
   <img src={url} alt={`Product photo ${index+1}`} />
   <button type="button" className="general-image-remove" onClick={()=>onRemove(index)} title="Remove image" aria-label={`Remove product photo ${index+1}`}>×</button>
  </div>)}
  <style jsx>{`.general-image-preview{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.general-image-item{position:relative;width:86px;height:98px}.general-image-item img{width:86px;height:98px;display:block;object-fit:cover;border-radius:8px;border:1px solid #e4ddd6;background:#f6f1ec}.general-image-remove{position:absolute;right:4px;top:4px;width:23px;height:23px;border:0;border-radius:50%;background:rgba(0,0,0,.78);color:#fff;font-size:17px;line-height:21px;cursor:pointer;z-index:2}.general-image-remove:hover{background:#7b3f98}`}</style>
 </div>;
}