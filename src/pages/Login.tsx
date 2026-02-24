import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login'|'register'>('login');
  const onSubmit = async () => mode === 'login'
    ? supabase.auth.signInWithPassword({ email, password })
    : supabase.auth.signUp({ email, password });
  return <main className="page"><div className="panel"><h2>{mode === 'login' ? 'Login' : 'Registro'}</h2>
    <input placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)} />
    <input placeholder='senha' type='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
    <button onClick={onSubmit}>Entrar</button>
    <button onClick={()=>setMode(mode === 'login' ? 'register' : 'login')}>Alternar para {mode === 'login' ? 'registro' : 'login'}</button>
  </div></main>;
}
