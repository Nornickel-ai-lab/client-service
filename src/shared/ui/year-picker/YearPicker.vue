<script setup lang="ts">
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

import { ui } from '@/shared/config/ui';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

interface YearPickerProps {
  placeholder?: string;
  min?: number;
  max?: number;
}

const model = defineModel<number | null>({ default: null });

const props = withDefaults(defineProps<YearPickerProps>(), {
  placeholder: ui.yearPickerPlaceholder,
  min: 1990,
  max: () => new Date().getFullYear(),
});

const open = ref(false);
const decadeStart = ref(props.max);

watch(open, (value) => {
  if (!value) {
    return;
  }
  const anchor = model.value ?? props.max;
  decadeStart.value = Math.floor(anchor / 12) * 12;
});

const years = computed((): number[] => {
  const start = decadeStart.value;
  return Array.from({ length: 12 }, (_, index) => {
    return start + index;
  }).filter((year) => {
    return year >= props.min && year <= props.max;
  });
});

const decadeLabel = computed((): string => {
  const yearsInView = years.value;
  if (yearsInView.length === 0) {
    return `${decadeStart.value}`;
  }
  return `${yearsInView[0]}–${yearsInView[yearsInView.length - 1]}`;
});

const displayValue = computed((): string => {
  if (model.value === null) {
    return props.placeholder;
  }
  return String(model.value);
});

const canPrevDecade = computed((): boolean => {
  return decadeStart.value > props.min;
});

const canNextDecade = computed((): boolean => {
  return decadeStart.value + 12 <= props.max;
});

const selectYear = (year: number): void => {
  model.value = year;
  open.value = false;
};

const clearYear = (): void => {
  model.value = null;
  open.value = false;
};

const prevDecade = (): void => {
  decadeStart.value -= 12;
};

const nextDecade = (): void => {
  decadeStart.value += 12;
};
</script>

<template>
  <div class="year-picker">
    <PopoverRoot
      v-model:open="open"
      :modal="false"
    >
      <PopoverTrigger as-child>
        <Button
          type="button"
          variant="outline"
          :class="cn(
            'year-picker__trigger',
            model === null && 'year-picker__trigger--empty',
          )"
        >
          <CalendarDays class="size-4 shrink-0 opacity-60" />
          <span class="truncate">{{ displayValue }}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        class="year-picker__content"
        data-year-picker-content
        align="start"
        :side-offset="6"
      >
        <div class="year-picker__header">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            :disabled="!canPrevDecade"
            @click="prevDecade"
          >
            <ChevronLeft class="size-4" />
          </Button>
          <span class="year-picker__range">{{ decadeLabel }}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            :disabled="!canNextDecade"
            @click="nextDecade"
          >
            <ChevronRight class="size-4" />
          </Button>
        </div>
        <div class="year-picker__grid">
          <button
            v-for="year in years"
            :key="year"
            type="button"
            :class="cn(
              'year-picker__year',
              model === year && 'year-picker__year--active',
            )"
            @click="selectYear(year)"
          >
            {{ year }}
          </button>
        </div>
        <div class="year-picker__footer">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            @click="clearYear"
          >
            {{ ui.yearPickerClear }}
          </Button>
        </div>
      </PopoverContent>
    </PopoverRoot>
  </div>
</template>

<style scoped>
.year-picker {
  position: relative;
}
.year-picker__trigger {
  display: inline-flex;
  width: 100%;
  justify-content: flex-start;
  gap: 8px;
  font-weight: 400;
}

.year-picker__trigger--empty {
  color: var(--muted-foreground);
}

.year-picker__content {
  z-index: 5;
  width: 280px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--popover, var(--background));
  padding: 12px;
  box-shadow: 0 12px 32px rgb(0 0 0 / 16%);
}

.year-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.year-picker__range {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.year-picker__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

.year-picker__year {
  height: 36px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 13px;
  color: var(--foreground);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.year-picker__year:hover {
  background: var(--accent);
}

.year-picker__year--active {
  border-color: var(--primary);
  background: var(--primary);
  color: var(--primary-foreground);
  font-weight: 600;
}

.year-picker__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}
</style>
