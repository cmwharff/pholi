<script setup lang="ts">
import { supabase } from '../../lib/supabaseClient'
import { onMounted, ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import router from '../../router'
import Avatar from './AvatarEdit.vue'

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

async function updateProfile() {
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

async function signOut() {
    try {
        loading.value = true
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        router.push({ name: 'auth' })
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-125 m-4 p-8 bg-sky-700 rounded-3xl shadow-md text-white text-sm" v-if="session">
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
                <label for="website">Website</label>
                <input id="website" type="url" v-model="website" />
            </div>

            <div class="flex flex-row justify-between">
                <input type="submit" class="button rounded-md bg-sky-950 text-white block max-w-fit"
                    :value="loading ? 'Loading ...' : 'Update'" :disabled="loading" />
                <button class="button rounded-md bg-sky-950 text-white block max-w-fit" @click.prevent="signOut"
                    :disabled="loading">
                    Sign Out
                </button>
            </div>
        </form>
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