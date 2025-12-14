<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import login from './forms/login.vue'
import signUp from './forms/sign-up.vue'
import resetPass from './forms/forgot-password.vue'

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
        })
        if (error) throw error
        alert('Check your email for the login link!')
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div>
    <login/>
  </div>
</template>