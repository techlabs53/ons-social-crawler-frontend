<script setup>
import { ref, watch, toRaw } from 'vue'
import global from '../../core/helpers/functions.js'
import DateRange from './DateRange.vue'

const emits = defineEmits(['onSearch', 'onPrediction', 'updateRange', 'updateCategory'])
const props = defineProps({
  predictionFilter: {
    type: Boolean,
    required: false,
    default: true
  },
  rangeFilter: {
    type: Boolean,
    required: false,
    default: true
  },
  range: {
    type: Object,
    required: false,
    default: {
      end: new Date(new Date(new Date().setHours(-24)).setHours(23, 59, 59, 999)), // yesterday, end of the day
      start: new Date(new Date().setHours(-168, 0, 0, 0)) //1 week
    }
  }
})
const { translate } = global()

const search = ref('')
const predictionId = ref(0)
const category = ref('all')
const predictions = [
  { label: 'Tutti i commenti', value: 0 },
  { label: 'No', value: 1 },
  { label: 'Sì', value: 2 }
]
const categories = [
  { label: 'Tutti i commenti', value: 'all' },
  { label: translate('categories', 'aggr_phys'), value: 'aggr_phys' },
  { label: translate('categories', 'aggr_verb'), value: 'aggr_verb' },
  { label: translate('categories', 'discr'), value: 'discr' },
  { label: translate('categories', 'incivility'), value: 'incivility' }
]
const range = ref(props.range)

const updateRange = (value) => {
  emits('updateRange', toRaw(value))
}

watch(
  () => search.value,
  (currentValue, prevValue) => {
    emits('onSearch', currentValue)
  }
)

watch(
  () => predictionId.value,
  (currentValue, prevValue) => {
    emits('onPrediction', currentValue)
  }
)

watch(
  () => category.value,
  (currentValue, prevValue) => {
    emits('updateCategory', currentValue)
  }
)
</script>
<template>
  <div class="filter-toolbar">
    <div class="search-element d-flex align-items-center position-relative my-1">
      <input
        type="text"
        class="form-control form-control-solid w-250px ps-15"
        :placeholder="'Cerca'"
        v-model="search"
      />
    </div>

    <div
      class="filter-element d-flex align-items-center position-relative my-1"
      v-if="props.predictionFilter"
    >
      <span class="filter-element__label d-flex align-items-center"
        ><img
          src="/media/triangle-exclamation-solid.svg"
          style="width: 25px; fill: #ff0000"
        />&nbsp;</span
      >
      <select
        class="filter-element__input form-select form-select-solid w-250px ps-15"
        v-model="predictionId"
      >
        <option v-for="(a, ix) in predictions" :key="ix" :value="a.value">
          {{ a.label }}
        </option>
      </select>
    </div>

    <div
      v-if="props.rangeFilter"
      class="filter-element d-flex align-items-center position-relative my-1"
    >
      <DateRange :entries="range" @update:model-value="updateRange" />
    </div>

    <div
      class="filter-element d-flex align-items-center position-relative my-1"
      v-if="props.predictionFilter"
    >
      <span class="filter-element__label d-flex align-items-center">Categoria:</span>
      <select
        class="filter-element__input form-select form-select-solid w-250px ps-15"
        v-model="category"
      >
        <option v-for="(a, ix) in categories" :key="ix" :value="a.value">
          {{ a.label }}
        </option>
      </select>
    </div>
  </div>
</template>
<style lang="scss">
.filter-toolbar {
  display: flex;
  gap: 2rem;
  .search-element {
    flex-basis: 15rem !important;
  }
  .filter-element {
    .filter-element__label {
      font-size: 1.2rem;
      font-weight: 400;
      //text-transform: uppercase;
      display: inline-block;
      padding: 0.5rem;
    }
  }
}
</style>
