<script setup lang="ts">
import { supabase } from '../../lib/supabaseClient'
import { onMounted, ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import Avatar from './AvatarDisplay.vue'

const session = ref<Session | null>(null)
const avatar_url = ref('')
const username = ref('')
const bio = ref('')
const full_name = ref('')
const website_title = ref('')
const website_url = ref('')

onMounted(async () => {
    const {
        data: { session: currentSession }
    } = await supabase.auth.getSession()

    session.value = currentSession

    if (session.value) {
        await getProfile()
    }
})

async function getProfile() {
    if (!session.value) return

    try {
        const { user } = session.value

        const { data, error, status } = await supabase
            .from('profiles')
            .select('username, avatar_url, full_name, bio, website')
            .eq('id', user.id)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            const website_json = data.website ?? { url: '', title: '' }

            username.value = data.username ?? ''
            avatar_url.value = data.avatar_url ?? ''
            full_name.value = data.full_name ?? ''
            bio.value = data.bio ?? ''
            website_title.value = website_json.title ?? ''
            website_url.value = website_json.url ?? ''
        }
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}
</script>

<template>
    <div class="max-w-125 m-4 p-8 bg-sky-700 rounded-3xl shadow-md text-white text-sm" v-if="session">
        <Avatar v-model:path="avatar_url" />
        <h2 class="mt-4">{{ full_name }}</h2>
        <h3 class="mt-2">@{{ username }}</h3>
        <h3 class="mt-2"><a target="_blank" rel="noopener noreferrer" ref="webUrl" :href="website_url">{{ website_title }}</a></h3>
        <p class="mt-2 mb-0">{{ bio }}</p>
    </div>
</template>
