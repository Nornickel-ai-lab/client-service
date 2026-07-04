<script setup lang="ts">
import { useDark } from '@vueuse/core';

useDark({
  storageKey: 'theme',
});
</script>

<template>
  <slot />
</template>
