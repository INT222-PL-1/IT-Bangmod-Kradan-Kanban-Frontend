<script setup>

defineProps({
  currentValue: {
    type: Boolean,
    default: false,
  },
  labelOn: {
    type: String,
    default: 'On',
  },
  labelOff:{
    type: String,
    default: 'Off',
  },
  colorTypeOn: {
    type: String,
    default: 'primary',
    validator: (value) => {
      return [
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
        'base',
        'neutral',
      ].includes(value)
    },
  },
  colorTypeOff: {
    type: String,
    default: 'primary',
    validator: (value) => {
      return [
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
        'base',
        'neutral',
      ].includes(value)
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const classMap = {
  primary: {
    bgContent: 'bg-primary-content',
    borderContent: 'border-primary-content',
    btn: 'btn-primary',
  },
  warning: {
    bgContent: 'bg-warning-content',
    borderContent: 'border-warning-content',
    btn: 'btn-warning',
  },
  success: {
    bgContent: 'bg-success-content',
    borderContent: 'border-success-content',
    btn: 'btn-success',
  },
  error: {
    bgContent: 'bg-error-content',
    borderContent: 'border-error-content',
    btn: 'btn-error',
  },
  info: {
    bgContent: 'bg-info-content',
    borderContent: 'border-info-content',
    btn: 'btn-info',
  },
  base: {
    bgContent: 'bg-base-content',
    borderContent: 'border-base-content',
    btn: 'btn-base',
  },
  neutral: {
    bgContent: 'bg-neutral-content',
    borderContent: 'border-neutral-content',
    btn: 'btn-neutral',
  },
  secondary: {
    bgContent: 'bg-secondary-content',
    borderContent: 'border-secondary-content',
    btn: 'btn-secondary',
  },
}

</script>

<template>
  <button class="btn btn-sm" :class="classMap[currentValue ? colorTypeOn : colorTypeOff].btn" :disabled="disabled">
    <div class="w-6 h-3 border-2 rounded-full flex items-center" :class="disabled ? 'border-base-content border-opacity-20' : classMap[currentValue ? colorTypeOn : colorTypeOff].borderContent">
      <div class="w-[0.45rem] h-[0.45rem] rounded-full transition" :class="[currentValue ? 'translate-x-[calc(1.25rem-0.45rem)]' : 'translate-x-[0.05rem]', disabled ? 'bg-base-content bg-opacity-20' : classMap[currentValue ? colorTypeOn : colorTypeOff].bgContent]"></div>
    </div>
    <div>{{ currentValue ? labelOn : labelOff }}</div>
  </button>
</template>

<style scoped>

</style>