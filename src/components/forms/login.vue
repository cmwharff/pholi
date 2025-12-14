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

const email = ref("")
const password = ref("")
const repeatPassword = ref("")
const error = ref<string | null>(null)
const isLoading = ref(false)
const success = ref(false)

const handleLogin = async () => {
    error.value = null

    if (password.value !== repeatPassword.value) {
        error.value = "Passwords do not match"
        return
    }

    isLoading.value = true
    try {
        const { error: supabaseError } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        })
        if (supabaseError) throw supabaseError
        success.value = true
    } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : "An error occurred"
    } finally {
        isLoading.value = false
    }
}

</script>

<template>
    <div class="flex flex-col gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleLogin">
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <RouterLink to="/forgot-password"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                    Forgot your password?
                                </RouterLink>
                            </div>
                            <div class="grid gap-2">
                                <div class="flex items-center">
                                    <Label for="password">Password</Label>
                                </div>
                                <Input id="password" type="password" required v-model="password" />
                            </div>
                            <div class="grid gap-2">
                                <div class="flex items-center">
                                    <Label for="repeat-password">Repeat Password</Label>
                                </div>
                                <Input id="repeat-password" type="password" required v-model="repeatPassword" />
                            </div>
                        </div>
                        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
                        <Button type="submit" class="w-full" :disabled="isLoading">
                            {{ isLoading ? "Creating an account..." : "Sign up" }}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
