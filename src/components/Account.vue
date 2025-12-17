<script setup lang="ts">
import { supabase } from '../lib/supabaseClient'
import { onMounted, ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import AccountInfo from './blocks/AccountInfo.vue'
import AccountMedia from './blocks/AccountMedia.vue'

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
</script>

<template>
    <div class="flex flex-row">
        <AccountInfo class="basis-1/4"/>
        <AccountMedia class="basis-3/4 w-full"/>
    </div>
</template>
