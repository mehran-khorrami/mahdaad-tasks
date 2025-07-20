<script setup lang="ts"></script>

<template>
	<div class="h-screen flex flex-col">
		<header class="bg-gray-300 text-gray-900 p-4 sticky top-0 z-10">
			<p class="text-center">Header</p>
		</header>

		<main class="flex-1 overflow-y-auto p-4 bg-gray-100">
			<div class="space-y-4">
				<h2 class="text-xl font-semibold">Content Area</h2>
				<p>This content area will scroll when content exceeds the available space.</p>
				<div v-for="n in 20" :key="n" class="p-4 bg-white rounded shadow">
					<h3 class="font-medium">Section {{ n }}</h3>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
						labore et
						dolore magna aliqua.</p>
				</div>
			</div>
		</main>

		<footer class="bg-gray-300 text-gray-900 p-4 sticky bottom-0 z-10">
			<p class="text-center">Footer</p>
		</footer>
	</div>
</template>