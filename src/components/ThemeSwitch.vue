<script setup>
import { onMounted, ref, watch } from 'vue';
import BaseMenu from './BaseMenu.vue';
import IconSVG from './IconSVG.vue';
import ButtonWithIcon from './ButtonWithIcon.vue';

defineProps({
  mode: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'toggle'].includes(value)
  }
})

const LOCAL_STORAGE_PREFIX = 'itbkk-'
const DARKMODE_THEME = 'itbkk-dark'
const LIGHTMODE_THEME = 'itbkk-light'

let themeSetting = ref('')
const isSystemDark = ref(false)

function themeSetup() {
  themeSetting.value = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}theme`) || 'system'
  const html = document.documentElement
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  isSystemDark.value = darkQuery.matches
  darkQuery.addEventListener('change', (e) => {
    isSystemDark.value = e.matches
  })

  if (themeSetting.value === 'dark') {
    html.dataset.theme = DARKMODE_THEME
  } else if (themeSetting.value === 'light') {
    html.dataset.theme = LIGHTMODE_THEME
  } else {
    html.dataset.theme = darkQuery.matches ? DARKMODE_THEME : LIGHTMODE_THEME
  }
}

watch(isSystemDark, (value) => {
  if (themeSetting.value !== 'system') return
  const html = document.documentElement
  html.dataset.theme = value ? DARKMODE_THEME : LIGHTMODE_THEME
}, { immediate: true })

onMounted(() => {
  themeSetup()
})

const handleSetTheme = (theme) => {
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}theme`, theme)
  themeSetup()
}

const handleThemeRotate = () => {
  if (themeSetting.value === 'light') {
    handleSetTheme('dark')
  } else if (themeSetting.value === 'dark') {
    handleSetTheme('system')
  } else {
    handleSetTheme('light')
  }
}

</script>

<template>
  <BaseMenu side="left" v-if="mode === 'default'">
    <template #icon>
      <div class="grid place-items-center w-8 h-8">
        <Transition>
          <div v-show="(!isSystemDark && themeSetting === 'system') || themeSetting === 'light'" class="absolute">
            <IconSVG iconName="sun-fill" :scale="1.25" size="2rem" />
          </div>
        </Transition>
        <Transition>
          <div v-show="(isSystemDark && themeSetting === 'system') || themeSetting === 'dark'" class="absolute">
            <IconSVG iconName="moon-fill" :scale="1.25" size="2rem" />
          </div>
        </Transition>
      </div>
    </template>
    <template #menu>
      <li>
        <ButtonWithIcon @click="handleSetTheme('system')" iconName="display"
          class="btn btn-ghost btn-sm justify-start">
          <div class="flex justify-between w-full">
            <div>System</div>
            <div v-show="themeSetting === 'system'">
              <span class="text-success">●</span>
              <span> In use</span>
            </div>
          </div>
        </ButtonWithIcon>
      </li>
      <li>
        <ButtonWithIcon @click="handleSetTheme('light')" iconName="sun-fill"
          class="btn btn-ghost btn-sm justify-start">
          <div class="flex justify-between w-full">
            <div>Light</div>
            <div v-show="themeSetting === 'light'">
              <span class="text-success">●</span>
              <span> In use</span>
            </div>
          </div>
        </ButtonWithIcon>
      </li>
      <li>
        <ButtonWithIcon @click="handleSetTheme('dark')" iconName="moon-fill"
          class="btn btn-ghost btn-sm justify-start">
          <div class="flex justify-between w-full">
            <div>Dark</div>
            <div v-show="themeSetting === 'dark'">
              <span class="text-success">●</span>
              <span> In use</span>
            </div>
          </div>
        </ButtonWithIcon>
      </li>
    </template>
  </BaseMenu>
    <!-- <ButtonWithIcon @click="handleSetTheme(themeSetting === 'dark' ? 'light' : 'dark')" iconName="moon-fill"
    class="btn btn-ghost btn-sm" /> -->
    <button v-if="mode === 'toggle'" @click="handleThemeRotate()" class="btn btn-ghost justify-start gap-4">
      <div class="grid place-items-center w-4">
        <Transition>
          <IconSVG v-show="(!isSystemDark && themeSetting === 'system') || themeSetting === 'light'" iconName="sun-fill" :scale="1.25" size="1rem" class="absolute" />
        </Transition>
        <Transition>
          <IconSVG v-show="(isSystemDark && themeSetting === 'system') || themeSetting === 'dark'" iconName="moon-fill" :scale="1.25" size="1rem" class="absolute" />
        </Transition>
      </div>
      <div>Theme: {{
        themeSetting === 'dark' ?
        'Dark' :
        themeSetting === 'light' ?
        'Light' :
        'System'
      }}</div>
    </button>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  /* transition: opacity 0.3s; */
  transition-property: opacity transform;
  transition-duration: .5s;
}

.v-enter-from,
.v-leave-to {
  transform: rotate(180deg);
  opacity: 0;
}
</style>
