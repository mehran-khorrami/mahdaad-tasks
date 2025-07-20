import { ref, watchEffect, type Ref } from 'vue'
import api from '@/utils/axios'
import type { AxiosResponse } from 'axios'

interface UserData {
    id: string
    name: string
    email: string
}

const cache = new Map<string, UserData>()
const userData = ref<UserData | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useUserData(userId: Ref<string>) {
    const controller = ref<AbortController | null>(null)

    watchEffect(async () => {
        if (!userId.value) return

        controller.value?.abort()
        controller.value = new AbortController()

        if (cache.has(userId.value)) {
            userData.value = cache.get(userId.value)!
            return
        }

        try {
            isLoading.value = true
            error.value = null

            const response: AxiosResponse<UserData> = await api.get(`/users/${userId.value}`, {
                signal: controller.value.signal
            })

            cache.set(userId.value, response.data)
            userData.value = response.data
        } catch (e: any) {
            if (e.name !== 'AbortError') {
                error.value = e.message
                userData.value = null
            }
        } finally {
            isLoading.value = false
        }
    })

    return {
        userData,
        isLoading,
        error
    }
}
