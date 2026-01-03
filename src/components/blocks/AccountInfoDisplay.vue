<script setup lang="ts">
import Avatar from './AvatarDisplay.vue'
import { infoHandler } from '@/lib/infoHandler'
import { sessionHandler } from '@/lib/sessionHandler'

const { avatar_url, username, bio, full_name, website_title, website_url } = infoHandler()
const { session } = sessionHandler()

</script>

<template>
    <div class="p-8 bg-sky-700 rounded-3xl shadow-md text-white text-sm" v-if="session">
        <Avatar v-model:path="avatar_url" />
        <h2 class="mt-4">{{ full_name }}</h2>
        <h3 class="mt-2">@{{ username }}</h3>
        <h3 class="mt-2"><a target="_blank" rel="noopener noreferrer" ref="webUrl" :href="website_url">{{ website_title
        }}</a></h3>
        <p class="mt-2 mb-0">{{ bio }}</p>
    </div>
</template>
