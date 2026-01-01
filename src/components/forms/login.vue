<script setup lang="ts">
import { ref } from "vue"
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Heading from "../Heading.vue"

const email = ref("")
const password = ref("")
const error = ref<string | null>(null)
const isLoading = ref(false)
const success = ref(false)

const handleLogin = async () => {
    error.value = null

    isLoading.value = true
    try {
        const { error: supabaseError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })
        if (supabaseError) throw supabaseError
        window.location.href = "/protected"
        success.value = true
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : "An error occurred"
    } finally {
        isLoading.value = false
    }
}

</script>

<template>
    <Heading />
    <div class="flex flex-col gap-6 m-auto w-1/2 mt-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleLogin">
                    <div class="flex flex-col gap-6">
                        <!-- Email -->
                        <div class="grid gap-2">
                            <Label for="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
                        </div>

                        <!-- Password -->
                        <div class="grid gap-2">
                            <div class="flex items-center">
                                <Label for="password">Password</Label>
                                <RouterLink to="/forgot-password"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                    Forgot your password?
                                </RouterLink>
                            </div>
                            <Input id="password" type="password" required v-model="password" />
                        </div>

                        <!-- Error -->
                        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

                        <!-- Submit -->
                        <Button type="submit" class="w-full" :disabled="isLoading">
                            {{ isLoading ? "Logging in..." : "Log In" }}
                        </Button>
                    </div>

                    <div class="mt-4 text-center text-sm">
                        New to Pholi?
                        <RouterLink to="/sign-up" class="underline underline-offset-4">Sign Up</RouterLink>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
