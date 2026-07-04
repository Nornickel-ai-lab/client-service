<script setup lang="ts">
import LoginForm from '@/features/auth/login/ui/LoginForm.vue';
import { ui } from '@/shared/config/ui';
</script>

<template>
  <div class="dark min-h-screen bg-black text-foreground">
    <div class="grid min-h-screen lg:grid-cols-2">
      <aside
        class="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12"
        style="background: radial-gradient(ellipse 80% 60% at 20% 40%, rgba(34, 120, 90, 0.45), transparent 55%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(20, 80, 70, 0.35), transparent 50%), linear-gradient(145deg, #071612 0%, #0c241c 45%, #051008 100%)"
      >
        <div
          class="pointer-events-none absolute inset-0 opacity-40"
          style="background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.06) 0%, transparent 65%)"
        />

        <div class="relative z-10 max-w-md">
          <p class="mb-3 text-sm font-medium tracking-wide text-emerald-200/70">
            Nornickel AI Lab
          </p>
          <h1 class="text-4xl font-semibold leading-tight tracking-tight text-white">
            {{ ui.loginHeroTitle }}
          </h1>
          <p class="mt-4 text-base leading-relaxed text-white/60">
            {{ ui.loginHeroSubtitle }}
          </p>
        </div>

        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50 backdrop-blur-sm">
            <span class="size-1.5 rounded-full bg-emerald-400" />
            MVP · researcher & admin
          </div>
        </div>
      </aside>

      <main class="flex min-h-screen flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
        <div class="mx-auto w-full max-w-md">
          <div
            class="mb-8 lg:hidden"
            style="background: radial-gradient(ellipse 80% 100% at 0% 50%, rgba(34, 120, 90, 0.35), transparent 70%), linear-gradient(135deg, #071612, #0c241c);"
          >
            <div class="rounded-2xl border border-white/10 p-6">
              <p class="text-sm text-emerald-200/70">
                Nornickel AI Lab
              </p>
              <h1 class="mt-1 text-2xl font-semibold text-white">
                {{ ui.loginHeroTitle }}
              </h1>
            </div>
          </div>

          <LoginForm />
        </div>
      </main>
    </div>
  </div>
</template>
