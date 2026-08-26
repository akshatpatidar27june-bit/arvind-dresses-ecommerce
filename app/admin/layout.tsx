'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

type Role = 'owner' | 'manager' | 'cashier' | 'packer' | '';
const managerAllowed = ['/admin', '/admin/orders', '/admin/inventory', '/admin/variant-inventory', '/admin/store-content', '/admin/categories', '/admin/customers', '/admin/coupons', '/admin/settings'];
const ordersOnly = ['/admin/orders'];
function allowed(role: Role, path: string) { if (path === '/admin') return role === 'owner' || role === 'manager'; if (role === 'owner') return true; if (role === 'manager') return managerAllowed.some(p => path === p || path.startsWith(`${p}/`)); if (role === 'cashier' || role === 'packer') return ordersOnly.some(p => path === p || path.startsWith(`${p}/`)); return false; }
export default function AdminLayout({ children }: { children: ReactNode }) { const pathname=usePathname();const router=useRouter();const[checking,setChecking]=useState(true);const[denied,setDenied]=useState(false);useEffect(()=>{let alive=true;async function check(){const{data:{session}}=await supabase.auth.getSession();if(!session){if(alive)setChecking(false);return}const{data:staff}=await supabase.from('staff').select('role,is_active').eq('auth_user_id',session.user.id).maybeSingle();const role=(staff?.role||'')as Role;if(!staff?.is_active||!allowed(role,pathname)){if(alive){setDenied(true);setChecking(false);if(pathname!=='/admin')router.replace('/admin/orders')}return}if(alive)setChecking(false)}check();return()=>{alive=false}},[pathname,router]);if(checking)return <div style={{minHeight:'100vh',display:'grid',placeItems:'center',fontFamily:'inherit'}}>Checking access…</div>;if(denied&&pathname!=='/admin')return <div style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,textAlign:'center',fontFamily:'inherit'}}><div><h1>Access denied</h1><p>You don't have permission to open this section.</p><button onClick={()=>router.replace('/admin/orders')} style={{marginTop:12,padding:'10px 16px',cursor:'pointer'}}>Go to my orders</button></div></div>;return <>{children}</> }
