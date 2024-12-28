<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      class="mb-2 capitalize">
      {{ label }}
    </label>
    <div class="relative">
      <span
        v-if="$slots.icon"
        class="absolute top-0 left-0 z-10 inline-flex items-center justify-center w-10 h-12 p-3 text-gray-500 pointer-events-none">
        <slot name="icon" />
      </span>
      <input
        v-model="model"
        v-bind="$attrs"
        :type="type"
        class="w-full h-12 max-w-full px-3 py-2 bg-white border border-gray-700 rounded focus:ring focus:outline-none"
        :class="{
          'pl-10': $slots.icon
        }">
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type   : [Number, String],
    default: '',
  },
  label: {
    type   : String,
    default: '',
  },
  type: {
    type   : String,
    default: 'text',
  },
})

const model = useModel(props, 'modelValue')
</script>
