import { ref, watch } from 'vue'

interface UserPreferences {
	theme: 'light' | 'dark'
	fontSize: 'small' | 'medium' | 'large'
}

export function usePreferences() {
	const theme = ref<UserPreferences['theme']>(
		(localStorage.getItem('theme') as UserPreferences['theme']) || 'light'
	)

	const fontSize = ref<UserPreferences['fontSize']>(
		(localStorage.getItem('fontSize') as UserPreferences['fontSize']) || 'medium'
	)

	watch(theme, (newTheme: UserPreferences['theme']) => {
		localStorage.setItem('theme', newTheme)
	}, { immediate: true })

	watch(fontSize, (newSize: UserPreferences['fontSize']) => {
		localStorage.setItem('fontSize', newSize)
	}, { immediate: true })

	return {
		theme,
		fontSize
	}
}
