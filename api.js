// js/api.js (module)
// IMPORTANT: put your Supabase values below
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'COLOQUE_AQUI_SUA_URL';
const SUPABASE_KEY = 'COLOQUE_AQUI_SUA_CHAVE_PUBLIC';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// CRUD básico para rooms (simplificado)
export async function createRoomOnServer({ room, config, passwordHash=null }) {
  const { data, error } = await supabase.from('rooms').insert([{
    code: room,
    config,
    players: [],
    status: 'waiting',
    password_hash: passwordHash,
    created_at: new Date()
  }]).select().single();
  if(error) throw error;
  return data;
}

export async function getRoomByCode(roomCode){
  const { data, error } = await supabase.from('rooms').select('*').eq('code', roomCode).maybeSingle();
  if(error) throw error;
  return data;
}

export async function updateRoom(roomId, patch){
  const { data, error } = await supabase.from('rooms').update(patch).eq('id', roomId).select().single();
  if(error) throw error;
  return data;
}

// realtime subscription helper
export function subscribeRoom(roomId, callback){
  return supabase.channel(`room_${roomId}`).on('postgres_changes', { event: '*', schema:'public', table:'rooms', filter:`id=eq.${roomId}`}, payload=> callback(payload.new)).subscribe();
}
