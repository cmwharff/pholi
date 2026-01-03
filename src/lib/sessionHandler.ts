import type { Session } from "@supabase/supabase-js"
import { ref } from 'vue'
import { supabase } from "./supabaseClient"

const session = ref<Session | null>(null)

async function loadSession() {
    const {
        data: { session: currentSession }
    } = await supabase.auth.getSession()

    session.value = currentSession
}

export function sessionHandler() {
    return { session, loadSession }

}