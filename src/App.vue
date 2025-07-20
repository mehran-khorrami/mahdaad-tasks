<script setup lang="ts">
import { useEcommerceStore } from '@/stores/useEcommerceStore'

const store = useEcommerceStore();

</script>

<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  <p>{{ store.mostPurchasedCategoryByCustomer }}</p>
</template>
