<script setup lang="ts">
import { supabase } from '../lib/supabaseClient'
import { ref } from 'vue'
import router from '../router'
import AccountInfoEdit from './blocks/AccountInfoEdit.vue'
import AccountInfoDisplay from './blocks/AccountInfoDisplay.vue'
import AccountMedia from './blocks/AccountMedia.vue'
import Heading from './Heading.vue'

const editInfo = ref(false);
const loading = ref(true)

async function toggleEdit() {
    editInfo.value = !editInfo.value
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
    <Heading />
    <div class="flex flex-row p-4">
        <div class="flex flex-col basis-1/4 max-w-1/4">
            <div v-if="editInfo">
                <AccountInfoEdit />
            </div>
            <div v-else>
                <AccountInfoDisplay />
            </div>
            <div class="flex flex-row justify-between m-4 p-8 rounded-3xl bg-sky-700">
                <button class="pt-2.5 pb-2.5 pl-4.5 pr-4.5 rounded-md bg-sky-950 text-white block max-w-fit"
                    @click.prevent="toggleEdit">
                    Edit info
                </button>
                <button class="pt-2.5 pb-2.5 pl-4.5 pr-4.5 rounded-md bg-sky-950 text-white block max-w-fit"
                    @click.prevent="signOut">
                    Sign Out
                </button>
            </div>
        </div>
        <AccountMedia class="basis-3/4 w-full h-fit" />
    </div>
</template>
