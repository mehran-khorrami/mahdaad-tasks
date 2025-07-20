<template>
	<div class="space-y-6 p-4">
		<div class="space-y-2">
			<h3 class="text-lg font-medium">Theme</h3>
			<div class="flex space-x-2">
				<button class="px-4 py-2 rounded-md"
					:class="theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
					@click="theme = 'light'">
					Light
				</button>
				<button class="px-4 py-2 rounded-md"
					:class="theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
					@click="theme = 'dark'">
					Dark
				</button>
			</div>
		</div>

		<div class="space-y-2">
			<h3 class="text-lg font-medium">Font Size</h3>
			<div class="flex space-x-2">
				<button v-for="size in ['small', 'medium', 'large'] as const" :key="size" class="px-4 py-2 rounded-md"
					:class="fontSize === size ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
					@click="fontSize = size">
					{{ size.charAt(0).toUpperCase() + size.slice(1) }}
				</button>
			</div>
		</div>

		<div class="mt-8 p-4 rounded-lg border"
			:class="theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'" :style="{
				fontSize: {
					small: '0.875rem',
					medium: '1rem',
					large: '1.25rem'
				}[fontSize]
			}">
			<p>Preview text with current preferences</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { usePreferences } from '../composables/usePreferences'

export default defineComponent({
	name: 'PreferencesControl',
	setup() {
		const { theme, fontSize } = usePreferences();
		return {
			theme,
			fontSize
		}
	}
})
</script>
