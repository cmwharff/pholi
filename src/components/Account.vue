<script setup lang="ts">
import { supabase } from '../lib/supabaseClient'
import { ref } from 'vue'
import router from '../router'
import AccountInfoEdit from './blocks/AccountInfoEdit.vue'
import AccountInfoDisplay from './blocks/AccountInfoDisplay.vue'
import AccountMedia from './blocks/AccountMedia.vue'
import Heading from './Heading.vue'
import ManageMedia from './blocks/ManageMedia.vue'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'

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
    <div class="flex m-4 h-fit">
        <Tabs default-value="profile" class="basis-1/4 flex-col flex m-4 h-fit w-full gap-4 items-center">
            <TabsList>
                <TabsTrigger value="profile">
                    Profile
                </TabsTrigger>
                <TabsTrigger value="media">
                    Manage Media
                </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <div class="flex flex-row">
                    <div class="flex flex-col items-center gap-4">
                        <div v-if="editInfo">
                            <AccountInfoEdit />
                        </div>
                        <div v-else>
                            <AccountInfoDisplay />
                        </div>
                        <div class="flex flex-row gap-4 w-fit p-4 rounded-3xl bg-sky-700">
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
                </div>
            </TabsContent>
            <TabsContent value="media" class="w-full">
                <ManageMedia />
            </TabsContent>
        </Tabs>
        <AccountMedia class="basis-3/4 w-full h-fit" />
    </div>
</template>
