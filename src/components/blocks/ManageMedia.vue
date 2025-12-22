<script setup lang="ts">
import { ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'
import Input from '../ui/input/Input.vue'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion'

const title = ref('')
const description = ref('')
const session = ref<Session | null>(null)

const uploadMedia = async (evt: Event) => {
    if (!session.value) return
    const input = evt.target as HTMLInputElement

    if (!input.files || input.files.length === 0) {
        alert('You must select an image to upload.')
        return
    }

    const file = input.files[0]

    if (file) {
        const { user } = session.value
        const fileExt = file.name.split('.').pop()
        const filePath = `${Math.random()}.${fileExt}`
        const new_media = {
            title: title.value,
            description: description.value,
            id: "something",
            aspect: 'square',
            size: 'sm',
            path: filePath
        }
        try {
            await supabase.storage.from('media').upload(filePath, file)
            await supabase.from('profiles').update({ media: [new_media] }).eq('id', user?.id)
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        }
    }
}

</script>

<template>
        <Accordion type="single" collapsible class="w-full flex gap-4 flex-col overflow-visible" default-value="all_media">
            <AccordionItem value="add_media" class="w-full">
                <AccordionTrigger class="bg-sky-700 rounded-3xl text-white text-lg p-4 w-full z-20 relative">
                    Upload Media
                </AccordionTrigger>
                <AccordionContent class="-mt-8 pt-12 overflow-visible">
                    <div
                        class="flex w-inherit items-center bg-sky-950 rounded-3xl rounded-t-none shadow-md text-white text-sm p-8 pt-16 -mt-12 z-10">
                        <form @submit.prevent="uploadMedia" class="w-full flex flex-col justify-around gap-4">
                            <Input class="bg-white w-full text-black" type="file" id="single" accept="image/*"
                                @change="uploadMedia" />
                            <div>
                                <label for="title">Title</label>
                                <Input id="title" type="text" v-model="title" />
                            </div>
                            <div>
                                <label for="description">Description</label>
                                <Input id="description" type="text" v-model="description" />
                            </div>
                        </form>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="all_media" class="w-full">
                <AccordionTrigger class="bg-sky-700 rounded-3xl text-white text-lg p-4 w-full z-20 relative">
                    All
                </AccordionTrigger>
                <AccordionContent class="-mt-8 pt-12 overflow-visible">
                    <div
                        class="flex w-inherit items-center bg-sky-950 rounded-3xl rounded-t-none shadow-md text-white text-sm p-8 pt-16 -mt-12 z-10 max-h-[50vh]">
                        
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

</template>
