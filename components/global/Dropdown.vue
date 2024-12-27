<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      class="mb-2 capitalize">
      {{ label }}
    </label>
    <select
      v-model="model"
      class="w-full h-12 max-w-full px-3 py-2 bg-white border border-gray-700 rounded focus:ring focus:outline-none">
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
interface SelectOption {
  label: string,
  value: unknown,
}

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
  options: {
    type   : Array as PropType<SelectOption[]>,
    default: () => ([] as SelectOption[]),
  },
})

const model = useModel(props, 'modelValue')
</script>
