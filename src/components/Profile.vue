<script setup lang="ts">
    import AccountInfoDisplay from './blocks/AccountInfoDisplay.vue'
    import AccountMedia from './blocks/AccountMedia.vue'
    import Heading from './Heading.vue'
    import { onMounted } from 'vue'
    import { mediaHandler } from '@/lib/mediaHandler'
    import { infoHandler } from '@/lib/infoHandler'
    import { sessionHandler } from '@/lib/sessionHandler'
    
    const { loadMedia } = mediaHandler()
    const { getProfile } = infoHandler()
    const { loadSession, session } = sessionHandler()
    
    onMounted(async () => {
        await loadSession()
    
        if (session.value) {
            await loadMedia()
            await getProfile()
        }
    })
    
    </script>
    
    <template>
        <Heading />
        <AccountInfoDisplay />
        <AccountMedia />
    </template>
    