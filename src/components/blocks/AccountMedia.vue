<script setup lang="ts">
import { supabase } from '../../lib/supabaseClient'
import { onMounted, ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import type { Ref } from 'vue'
import Input from '../ui/input/Input.vue'

const session = ref<Session | null>(null)
const loading = ref(true)
const uploading = ref(false)

// const prop = defineProps(['path'])
// const { path } = toRefs(prop)

// const emit = defineEmits(['upload', 'update:path'])

const title = ref('')
const description = ref('')
const src = ref('')

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
        loading.value = false
    }
})

async function loadMedia() {
    if (!session.value) return

    try {
        loading.value = true
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
    } finally {
        loading.value = false
    }
}

async function downloadMedia() {
    for (let item of Object.values(media_raw.value)) {
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
            uploading.value = true
            await supabase.storage.from('media').upload(filePath, file)
            await supabase.from('profiles').update({ media: [...media_raw.value, new_media] }).eq('id', user?.id)
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        } finally {
            uploading.value = false
        }
    }
}

</script>

<template>
    <div class="flex flex-col items-center w-full m-4 gap-4">
        <div class="flex w-full items-center">
            <form @submit.prevent="uploadMedia" class="w-full flex flex-row justify-around">
                <Input class="bg-white w-fit text-black" type="file" id="single" accept="image/*"
                    @change="uploadMedia" />
                <div>
                    <label for="title">Title</label>
                    <input id="title" type="text" v-model="title" />
                </div>
                <div>
                    <label for="description">Description</label>
                    <input id="description" type="text" v-model="description" />
                </div>
            </form>
        </div>
        <div
            class=" overflow-y-scroll h-fit rounded-3xl bg-sky-950 border-sky-950 border-5 p-4 grid grid-cols-4 grid-flow-dense gap-4">
            <div v-for="item in media_list" :key="item.id">
                <img :src="item.src" alt="media" class="w-full rounded-3xl border-sky-700 border-5" />
            </div>
        </div>
    </div>
</template>