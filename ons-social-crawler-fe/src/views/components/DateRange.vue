<script setup>
import { ref, toRefs, onMounted, watchEffect, defineEmits } from 'vue'
import { endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns'

const props = defineProps({
  entries: Object
})

const { entries } = toRefs(props)

const masks = {
  input: 'dd/MM/yyyy'
}

const emit = defineEmits(['update:model-value'])

const date = ref()

const presetDates = ref([
  {
    label: 'Periodo',
    value: [entries.value.start, entries.value.end],
    slot: 'preset-date-range-button'
  },
  {
    label: 'Questo mese',
    value: [startOfMonth(new Date()), endOfMonth(new Date())]
  },
  {
    label: 'Ultimo mese',
    value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))]
  },
  {
    label: 'Ultimi 2 mesi',
    value: [startOfMonth(subMonths(new Date(), 2)), endOfMonth(subMonths(new Date(), 1))]
  },
  {
    label: 'Ultimi 3 mesi',
    value: [startOfMonth(subMonths(new Date(), 3)), endOfMonth(subMonths(new Date(), 1))]
  },
  {
    label: 'Questo anno',
    value: [startOfYear(new Date()), endOfYear(new Date())]
  },
  {
    label: 'Ultimo anno',
    value: [startOfYear(subYears(new Date(), 1)), endOfYear(subYears(new Date(), 1))]
  },
  {
    label: 'Ultimi 2 anni',
    value: [startOfYear(subYears(new Date(), 2)), endOfYear(subYears(new Date(), 1))]
  }
])

onMounted(() => {
  // Set a default date range when the component is mounted
  date.value = [entries.value.start, entries.value.end]
})

// Watch the entries prop for changes and update the date ref accordingly
watchEffect(() => {
  date.value = [entries.value.start, entries.value.end]
})

const updateDate = (newDate) => {
  //console.log('in updateDate : %O', newDate)
  date.value = newDate
  emit('update:model-value', newDate)
}
</script>

<style scoped>
/* Override default styles for the icon: fix position */
:deep(.dp__input_icon) {
  cursor: pointer;
  position: absolute;
  top: 50%;
  inset-inline-start: 0;
  transform: translateY(-115%); /* was -50% */
  color: var(--dp-icon-color);
}
</style>

<template>
  <label class="dashboard-element__label filter-element__label">Periodo:</label>
  <VueDatePicker
    v-model="date"
    range
    :preset-dates="presetDates"
    :format="masks.input"
    @update:model-value="updateDate"
  >
    <template #preset-date-range-button="{ label, value, presetDate }">
      <span
        role="button"
        :tabindex="0"
        @click="presetDate(value)"
        @keyup.enter.prevent="presetDate(value)"
        @keyup.space.prevent="presetDate(value)"
      >
        {{ label }}
      </span>
    </template>
  </VueDatePicker>
</template>
