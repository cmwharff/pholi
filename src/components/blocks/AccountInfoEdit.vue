<script setup lang="ts">
import { supabase } from '../../lib/supabaseClient'
import { onMounted, ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import Avatar from './AvatarEdit.vue'

const session = ref<Session | null>(null)
const avatar_url = ref('')
const loading = ref(true)
const username = ref('')
const website_url = ref('')
const website_title = ref('')
const full_name = ref('')
const bio = ref('')

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
            .select('username, website, avatar_url, full_name, bio')
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
    } finally {
        loading.value = false
    }
}

async function updateProfile() {
    if (!session.value) return

    try {
        loading.value = true
        const { user } = session.value

        const updates = {
            id: user.id,
            username: username.value,
            website: {
                url: website_url.value,
                title: website_title.value
            },
            avatar_url: avatar_url.value,
            full_name: full_name.value,
            bio: bio.value,
            updated_at: new Date()
        }
        const { error } = await supabase.from('profiles').upsert(updates)
        if (error) throw error
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex">
        <div class="p-8 bg-sky-700 rounded-3xl shadow-md text-white text-sm" v-if="session">
        <form class="form-widget" @submit.prevent="updateProfile">
            <Avatar v-model:path="avatar_url" @upload="updateProfile" />

            <div class="form-group">
                <label for="full_name">Full Name</label>
                <input id="full_name" type="text" v-model="full_name" />
            </div>

            <div class="form-group">
                <label for="username">Username</label>
                <input id="username" type="text" v-model="username" />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="text" :value="session.user.email" disabled />
            </div>

            <div class="form-group">
                <label for="website_url">Website URL</label>
                <input id="website_url" type="url" v-model="website_url" />
            </div>

            <div class="form-group">
                <label for="website_title">Website Label</label>
                <input id="website_title" type="text" v-model="website_title" />
            </div>
            <div class="form-group">
                <label for="bio">Bio</label>
                <input id="bio" type="text" v-model="bio" />
            </div>

            <div class="flex flex-row justify-center">
                <input type="submit" class="mt-4 button rounded-md bg-sky-950 text-white block max-w-fit"
                    :value="loading ? 'Loading ...' : 'Save Information'" :disabled="loading" />
            </div>
        </form>
    </div>
    </div>
    
</template>

<style scoped>
.form-widget {
    display: flex;
    flex-direction: column;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

.form-group label {
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.form-group input[type='text'],
.form-group input[type='url'] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    background-color: white;
    color: black
}

.avatar-group {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.button {
    padding: 0.6rem 1rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.button.block {
    width: 100%;
}

.button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
}
</style>