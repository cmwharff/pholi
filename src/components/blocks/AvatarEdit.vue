<script setup lang="ts">
import { ref, toRefs, watchEffect } from 'vue'
import { supabase } from '../../lib/supabaseClient'
import Button from '../ui/button/Button.vue'
import Input from '../ui/input/Input.vue'

const prop = defineProps(['path', 'size'])
const { path, size } = toRefs(prop)

const emit = defineEmits(['upload', 'update:path'])
const uploading = ref(false)
const src = ref('')

const downloadImage = async () => {
    if (path) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path.value)
            if (error) throw error
            src.value = URL.createObjectURL(data)
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        }
    }
}

const uploadAvatar = async (evt: Event) => {
    const input = evt.target as HTMLInputElement

    if (!input.files || input.files.length === 0) {
        alert('You must select an image to upload.')
        return
    }

    const file = input.files[0]

    if (file) {
        try {
            uploading.value = true

            const fileExt = file.name.split('.').pop()
            const filePath = `${Math.random()}.${fileExt}`

            const { error } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (error) throw error

            emit('update:path', filePath)
            emit('upload')
        } catch (error) {
            if (error instanceof Error) alert(error.message)
        } finally {
            uploading.value = false
        }
    }
}

watchEffect(() => {
    if (path) {
        if (path.value) downloadImage()
    }
})
</script>

<template>
    <div class="flex flex-col items-center">
        <div class="aspect-square overflow-hidden">
        <img v-if="src" :src="src" alt="Avatar" class="w-full h-full avatar image rounded-3xl border-sky-950 border-5 object-cover"/>
        <div v-else class="avatar no-image" :style="{ height: size + 'em', width: size + 'em' }" /></div>

        <div class="flex w-auto items-center space-x-2 m-4 p-4">
            <Input class="bg-white" type="file" id="single" accept="image/*" />
            <Button for="single" @click-prevent="uploadAvatar">
                Upload
            </Button>
        </div>
    </div>
</template>