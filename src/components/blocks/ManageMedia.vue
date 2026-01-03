<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'
import type { Ref } from 'vue'
import { editPholiHandler } from '@/lib/editPholiHandler'
import Input from '../ui/input/Input.vue'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'

const { grid, unplacedItems, onDragStart, stagedItems } = editPholiHandler()
const title = ref('')
const description = ref('')
const src = ref('')
const session = ref<Session | null>(null)

const media_raw: Ref<{
    title: string,
    description: string,
    id: string,
    aspect: string,
    size: string,
    path: string
}[]> = ref([])

const media_list: Ref<{
    title: string,
    description: string,
    id: string,
    src: string,
    aspect: string,
    size: string
}[]> = ref([])

onMounted(async () => {
    const {
        data: { session: currentSession }
    } = await supabase.auth.getSession()

    session.value = currentSession

    if (session.value) {
        await loadMedia()
    } else {
    }
})

async function loadMedia() {
    if (!session.value) return

    try {
        const { user } = session.value

        const { data, error, status } = await supabase
            .from('profiles')
            .select('media')
            .eq('id', user.id)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            media_raw.value = data.media ?? []
        }
        downloadMedia()
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}

async function downloadMedia() {
    for (let item of Object.values(media_raw.value)) {
        if (!media_list.value.find(entry => item.id == entry.id)) {
            console.log(`adding item ${item.title}`)
            try {
                const { data, error } = await supabase.storage.from('media').download(item.path);
                if (error) {
                    throw error;
                }
                const url = URL.createObjectURL(data)
                media_list.value.push({
                    title: `${item.title}`,
                    description: `${item.description}`,
                    id: `${item.id}`,
                    src: url,
                    aspect: `${item.aspect}`,
                    size: `${item.size}`
                })
            } catch (error) {
                if (error instanceof Error) alert(error.message)
            }
        }
    }
}

const uploadMedia = async (evt: Event) => {
    if (!session.value) return

    const form = evt.target as HTMLFormElement
    const target = form.elements[0] as HTMLInputElement

    if (!target || !target.files || target.files.length === 0) {
        alert('You must select an image to upload.')
        return
    }

    const file = target.files[0]

    if (file) {
        const { user } = session.value
        const fileExt = file.name.split('.').pop()
        const filePath = `${Math.random()}.${fileExt}`
        const new_media = {
            title: title.value,
            description: description.value,
            id: filePath,
            aspect: 'square',
            size: 'sm',
            path: filePath,
            timeStamp: Date.now()
        }
        try {
            await supabase.storage.from('media').upload(filePath, file)
            await supabase.from('profiles').update({ media: [...media_raw.value, new_media] }).eq('id', user?.id)
            loadMedia()
            form.reset()
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        }
    }
}

const preview = async (evt: Event) => {
    const files = (evt.target as HTMLInputElement).files;

    if (files && files.length > 0) {
        const file = files[0] as Blob;
        console.log(file)
        src.value = URL.createObjectURL(file);

    }
}

async function updatePholi() {
    if (!session.value) return

    try {
        const { user } = session.value

        const updates = {
            id: user.id,
            pholi: JSON.stringify(grid.value),
            updated_at: new Date()
        }
        console.log(updates.id)
        const { error } = await supabase.from('profiles').upsert(updates)
        if (error) throw error
    } catch (error) {
        if (error instanceof Error) alert(error.message)
    }
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <Tabs class=" flex-col flex w-full gap-4 items-center h-3/4" default-value="all">
            <TabsList>
                <TabsTrigger value="upload">
                    Add
                </TabsTrigger>
                <TabsTrigger value="all">
                    Unplaced
                </TabsTrigger>
                <TabsTrigger value="staged">
                    Staged
                </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" class="w-full">
                <div class="flex w-inherit items-center bg-sky-950 rounded-3xl shadow-md text-white text-sm p-8 z-10">
                    <form @submit.prevent="uploadMedia" class="w-full flex flex-col justify-around gap-4 text-sm"
                        name="addForm">

                        <img v-if="src" :src="src" alt="Avatar"
                            class="w-full h-full avatar image rounded-3xl border-sky-700 border-5 object-cover" />
                        <Input class="bg-white w-full text-black" type="file" id="single" accept="image/*"
                            @change="preview" />
                        <div>
                            <label for="title">Title</label>
                            <Input id="title" type="text" v-model="title" required />
                        </div>
                        <div>
                            <label for="description">Description</label>
                            <Input id="description" type="text" v-model="description" />
                        </div>
                        <input type="submit" class="button rounded-md text-white block max-w-fit p-2 bg-sky-700"
                            value="Submit" />
                    </form>
                </div>
            </TabsContent>

            <TabsContent value="all" class="w-full">
                <div v-if="unplacedItems.length == 0"
                    class="bg-sky-950 rounded-3xl shadow-md text-white text-md text-center p-4">
                    Empty!
                </div>
                <div v-else
                    class="grid grid-cols-2 gap-4 w-inherit items-center bg-sky-950 rounded-3xl shadow-md text-white text-sm p-4 z-10 overflow-y-scroll">
                    <div v-for="item in unplacedItems" :key="item.id" draggable="true" @dragstart="onDragStart(item)"
                        class="cursor-move border-sky-700 border-4 text-white aspect-square rounded-3xl overflow-hidden">
                        <img :src="item.src" :alt="item.label" class="object-cover border-0 w-full h-full" />
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="staged" class="w-full">
                <div v-if="stagedItems.length == 0"
                    class="bg-sky-950 rounded-3xl shadow-md text-white text-md text-center p-4">
                    Empty!
                </div>
                <div v-else
                    class="grid grid-cols-2 gap-4 w-inherit items-center bg-sky-950 rounded-3xl shadow-md text-white text-sm p-4 z-10 overflow-y-scroll">
                    <div v-for="item in stagedItems" :key="item.id"
                        class="cursor-move border-sky-700 border-4 text-white aspect-square rounded-3xl overflow-hidden">
                        <img :src="item.src" :alt="item.label" class="object-cover border-0 w-full h-full" />
                    </div>
                </div>
            </TabsContent>
        </Tabs>
        <form @submit.prevent="updatePholi">
            <div class="flex flex-row justify-center">
                <input type="submit" class="button rounded-md bg-sky-950 text-white block max-w-fit p-4"
                    value="Save Pholi" />
            </div>
        </form>
    </div>
</template>
