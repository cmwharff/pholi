<script setup lang="ts">
    import { supabase } from '../../lib/supabaseClient'
    import { onMounted, ref } from 'vue'
    import type { Session } from '@supabase/supabase-js'
    
    const session = ref<Session | null>(null)
    const avatar_url = ref('')
    const loading = ref(true)
    const username = ref('')
    const website = ref('')
    const full_name = ref('')
    
    onMounted(async () => {
        const {
            data: { session: currentSession }
        } = await supabase.auth.getSession()
    
        session.value = currentSession
    
        if (session.value) {
            await getProfile()
        } else {
            loading.value = false
        }
    })
    
    async function getProfile() {
        if (!session.value) return
    
        try {
            loading.value = true
            const { user } = session.value
    
            const { data, error, status } = await supabase
                .from('profiles')
                .select('username, website, avatar_url, full_name')
                .eq('id', user.id)
                .single()
    
            if (error && status !== 406) throw error
    
            if (data) {
                username.value = data.username ?? ''
                website.value = data.website ?? ''
                avatar_url.value = data.avatar_url ?? ''
                full_name.value = data.full_name ?? ''
            }
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        } finally {
            loading.value = false
        }
    }
    
    async function updateMedia() {
        if (!session.value) return
    
        try {
            loading.value = true
            const { user } = session.value
    
            const updates = {
                id: user.id,
                username: username.value,
                website: website.value,
                avatar_url: avatar_url.value,
                full_name: full_name.value,
                updated_at: new Date()
            }
    
            const { error } = await supabase.from('profiles').upsert(updates, { onConflict: 'id' })
            if (error) throw error
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        } finally {
            loading.value = false
        }
    }
    
    </script>
    
    <template>
        <div class="m-4 p-8 bg-sky-700 rounded-3xl shadow-md" v-if="session">
        </div>
    </template>
