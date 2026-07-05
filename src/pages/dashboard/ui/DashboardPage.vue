<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { RefreshCw } from 'lucide-vue-next';

import MainLayout from '@/app/layouts/MainLayout.vue';
import { fetchAnalyticsOverview, type AnalyticsOverview } from '@/entities/analytics/api/analyticsApi';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { ui } from '@/shared/config/ui';
import { formatGeoLabel, formatGraphNodeLabel } from '@/shared/lib/formatDomainLabels';

const overview = ref<AnalyticsOverview | null>(null);
const loadError = ref('');
const loading = ref(true);
const pollTimer = ref<number | null>(null);

const documentsProcessing = computed(() => {
  if (!overview.value) {
    return 0;
  }
  return Math.max(0, overview.value.documents_total - overview.value.documents_done);
});

const loadOverview = async (): Promise<void> => {
  try {
    overview.value = await fetchAnalyticsOverview();
    loadError.value = '';
  } catch {
    loadError.value = ui.dashboardLoadFailed;
  } finally {
    loading.value = false;
  }
};

const stopPolling = (): void => {
  if (pollTimer.value !== null) {
    window.clearInterval(pollTimer.value);
    pollTimer.value = null;
  }
};

const startPolling = (): void => {
  stopPolling();
  pollTimer.value = window.setInterval(async () => {
    await loadOverview();
    if (documentsProcessing.value === 0) {
      stopPolling();
    }
  }, 15000);
};

onMounted(async () => {
  await loadOverview();
  if (documentsProcessing.value > 0) {
    startPolling();
  }
});

onUnmounted(() => {
  stopPolling();
});

const onRefresh = async (): Promise<void> => {
  loading.value = true;
  await loadOverview();
  if (documentsProcessing.value > 0) {
    startPolling();
  }
};
</script>

<template>
  <MainLayout>
    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header class="flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-4">
        <div>
          <h1 class="text-lg font-semibold">
            {{ ui.dashboardTitle }}
          </h1>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ ui.dashboardDescription }}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          :disabled="loading"
          @click="onRefresh"
        >
          <RefreshCw
            class="size-4"
            :class="{ 'animate-spin': loading }"
          />
          {{ ui.dashboardRefresh }}
        </Button>
      </header>
      <main class="mx-auto w-full max-w-5xl space-y-6 p-6">
        <p
          v-if="loadError"
          class="text-sm text-destructive"
        >
          {{ loadError }}
        </p>
        <div
          v-if="loading && !overview"
          class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Skeleton
            v-for="index in 6"
            :key="index"
            class="h-28 rounded-lg"
          />
        </div>
        <div
          v-else-if="overview"
          class="space-y-6"
        >
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium text-muted-foreground">
                  {{ ui.dashboardDocuments }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-2xl font-semibold">
                  {{ overview.documents_done }} / {{ overview.documents_total }}
                </p>
                <p
                  v-if="documentsProcessing > 0"
                  class="mt-1 text-xs text-muted-foreground"
                >
                  {{ ui.dashboardDocumentsProcessing }}: {{ documentsProcessing }}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium text-muted-foreground">
                  {{ ui.dashboardQueries }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-2xl font-semibold">
                  {{ overview.queries_total }}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium text-muted-foreground">
                  {{ ui.dashboardGlossary }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-2xl font-semibold">
                  {{ overview.glossary_terms }}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium text-muted-foreground">
                  {{ ui.dashboardContradictions }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-2xl font-semibold">
                  {{ overview.contradictions }}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle class="text-base">
                {{ ui.dashboardCoverageGeo }}
              </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-wrap gap-2">
              <Badge
                v-for="(count, geo) in overview.coverage_by_geo"
                :key="geo"
                variant="secondary"
              >
                {{ formatGeoLabel(String(geo)) }}: {{ count }}
              </Badge>
              <p
                v-if="Object.keys(overview.coverage_by_geo).length === 0"
                class="text-sm text-muted-foreground"
              >
                {{ ui.dashboardEmptyGeo }}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-base">
                {{ ui.dashboardGraphNodes }}
              </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-wrap gap-2">
              <Badge
                v-for="(count, label) in overview.graph_nodes"
                :key="label"
                variant="outline"
              >
                {{ formatGraphNodeLabel(String(label)) }}: {{ count }}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  </MainLayout>
</template>
