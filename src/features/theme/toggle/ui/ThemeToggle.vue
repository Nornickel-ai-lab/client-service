<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { Moon, Sun } from 'lucide-vue-next';

import { Button } from '@/shared/ui/button';
import { ui } from '@/shared/config/ui';

const isDark = useDark({ storageKey: 'theme' });
const toggle = useToggle(isDark);
</script>

<template>
  <Button
    variant="ghost"
    size="sm"
    class="w-full justify-start gap-2"
    type="button"
    @click="toggle()"
  >
    <Sun
      v-if="isDark"
      class="size-4"
    />
    <Moon
      v-else
      class="size-4"
    />
    {{ isDark ? ui.navThemeLight : ui.navThemeDark }}
  </Button>
</template>
