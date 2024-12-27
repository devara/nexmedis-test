<template>
  <div class="!mt-8 flex items-center">
    <span class="items-center hidden space-x-3 md:inline-flex">
      <label>Page</label>
      <select
        v-model="page"
        class="items-center px-3 py-2 border rounded-lg">
        <option
          v-for="n in totalPage ?? 2"
          :key="n"
          :value="n">
          {{ n }}
        </option>
      </select>
      <label> of {{ totalPage ?? 1 }}</label>
    </span>

    <span class="inline-flex items-center mx-auto space-x-3">
      <button
        v-if="page > 1"
        @click="togglePage('prev')">
        &#8592; Prev
      </button>
      <button
        v-if="(totalPage ?? 1) > page"
        @click="togglePage('next')">
        Next &#8594;
      </button>
    </span>

    <span class="inline-flex items-center space-x-3 place-self-end">
      <label>Per page</label>
      <select
        v-model="perPage"
        class="items-center px-3 py-2 border rounded-lg">
        <option
          v-for="val in [5, 10, 15]"
          :key="val"
          :value="val">
          {{ val }}
        </option>
      </select>
    </span>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['update:pageValue', 'update:perPageValue'])

const props = defineProps({
  pageValue: {
    type   : Number,
    default: 1,
  },
  perPageValue: {
    type   : Number,
    default: 10,
  },
  total: {
    type   : Number,
    default: 0,
  },
  totalPage: {
    type   : Number,
    default: 1,
  },
  disabled: {
    type   : Boolean,
    default: false,
  },
})

const page    = useModel(props, 'pageValue')
const perPage = useModel(props, 'perPageValue')

function togglePage (value: 'prev' | 'next') {
  if (props.disabled)
    return

  if (value === 'next')
    page.value++
  else
    page.value--
}
</script>
