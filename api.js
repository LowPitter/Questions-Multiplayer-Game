/* ================================================================
   API.JS — Conexão com Supabase (salas, configs, jogadores, estado)
   ================================================================ */

// =====================================================
// 1. CONFIGURAÇÃO DO SUPABASE
// =====================================================

const SUPABASE_URL = "COLOQUE_AQUI_SUA_URL";
const SUPABASE_KEY = "COLOQUE_AQUI_SUA_CHAVE_PUBLIC";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// =====================================================
// 2. CRIAR SALA
// =====================================================

export async function createRoom(config) {
    const roomCode = generateRoomCode();

    const { data, error } = await supabase
        .from("rooms")
        .insert({
            code: roomCode,
            config: config,
            players: [],
            status: "waiting",
            current_question: 0,
            created_at: new Date()
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}


// Código simples do tipo “ABX92”
function generateRoomCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}


// =====================================================
// 3. ENTRAR EM UMA SALA
// =====================================================

export async function joinRoom(roomCode, playerName, privateCode) {
    const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", roomCode)
        .single();

    if (error || !data) throw { message: "Sala não encontrada." };

    if (data.config.privacidade === "privada") {
        if (privateCode !== data.config.codigoPrivado) {
            throw { message: "Código privado incorreto." };
        }
    }

    let players = data.players || [];

    // adiciona jogador caso não esteja
    if (!players.includes(playerName)) players.push(playerName);

    const { error: updateErr } = await supabase
        .from("rooms")
        .update({ players })
        .eq("code", roomCode);

    if (updateErr) throw updateErr;

    return data;
}


// =====================================================
// 4. PEGAR DADOS DE UMA SALA
// =====================================================

export async function getRoomData(roomId) {
    const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

    if (error) throw error;

    return data;
}


// =====================================================
// 5. ATUALIZAR CONFIGURAÇÕES DA SALA
// =====================================================

export async function updateRoomConfig(roomId, newConfig) {
    const { error } = await supabase
        .from("rooms")
        .update({ config: newConfig })
        .eq("id", roomId);

    if (error) throw error;

    return true;
}


// =====================================================
// 6. ENVIAR PERGUNTAS GERADAS (IA OU PRÉ-DEFINIDAS)
// =====================================================

export async function updateQuestions(roomId, questions) {
    const { error } = await supabase
        .from("rooms")
        .update({ questions })
        .eq("id", roomId);

    if (error) throw error;
}


// =====================================================
// 7. MONITORAR ALTERAÇÕES EM TEMPO REAL
// =====================================================

export function onRoomChange(roomId, callback) {
    return supabase
        .channel(`room_${roomId}`)
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
            (payload) => callback(payload.new)
        )
        .subscribe();
}


// =====================================================
// 8. ATUALIZAR PROGRESSO DO JOGO
// =====================================================

export async function updateGameState(roomId, newState) {
    const { error } = await supabase
        .from("rooms")
        .update(newState)
        .eq("id", roomId);

    if (error) throw error;
}


// =====================================================
// 9. REGISTRAR PONTUAÇÃO DO JOGADOR
// =====================================================

export async function savePlayerScore(roomId, playerName, score) {
    const { data, error } = await supabase
        .from("scores")
        .insert({
            room_id: roomId,
            player: playerName,
            points: score,
            created_at: new Date()
        });

    if (error) throw error;

    return data;
}

