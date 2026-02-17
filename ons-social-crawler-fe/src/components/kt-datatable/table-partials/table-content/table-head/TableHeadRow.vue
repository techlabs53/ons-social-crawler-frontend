<template>
  <thead>
    <tr
      class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0fw-bold fs-5 text-gray-800 border-bottom border-gray-200"
    >
      <th v-if="checkboxEnabled" :style="{ width: '30px' }">
        <div class="form-check form-check-sm form-check-custom form-check-solid me-3">
          <input class="form-check-input" type="checkbox" v-model="checked" @change="selectAll()" />
        </div>
      </th>
      <template v-for="(column, i) in header" :key="i">
        <th
          @click="onSort(column.columnLabel, column.sortEnabled)"
          :style="{
            minWidth: column.columnMinWidth ? `${column.columnMinWidth}px` : '0',
            width: column.columnWidth ? `${column.columnWidth}px` : 'auto',
            cursor: column.sortEnabled ? 'pointer' : 'auto'
          }"
          :class="{ 'd-flex': column?.htmlName }"
        >
          <div v-if="column?.htmlName" v-html="column.htmlName"></div>
          <template v-else>{{ column.columnName }}</template>
          <span
            v-if="columnLabelAndOrder.label === column.columnLabel && column.sortEnabled"
            v-html="sortArrow"
          ></span>
        </th>
      </template>
    </tr>
  </thead>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
// import type { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
  name: 'table-head-row',
  props: {
    checkboxEnabledValue: { type: Boolean, required: false, default: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      // type: String as () => "asc" | "desc",
      required: false,
      default: 'asc'
    },
    header: { type: Array, required: true }
  },
  emits: ['on-select', 'on-sort'],
  components: {},
  setup(props, { emit }) {
    const checked = ref(false)
    const columnLabelAndOrder = ref({
      label: props.sortLabel,
      order: props.sortOrder
    })

    watch(
      () => props.checkboxEnabledValue,
      (currentValue) => {
        checked.value = currentValue
      }
    )

    const selectAll = () => {
      emit('on-select', checked.value)
    }

    const onSort = (label, sortEnabled) => {
      if (sortEnabled) {
        if (columnLabelAndOrder.value.label === label) {
          if (columnLabelAndOrder.value.order === 'asc') {
            columnLabelAndOrder.value.order = 'desc'
          } else {
            if (columnLabelAndOrder.value.order === 'desc') {
              columnLabelAndOrder.value.order = 'asc'
            }
          }
        } else {
          columnLabelAndOrder.value.order = 'asc'
          columnLabelAndOrder.value.label = label
        }
        emit('on-sort', columnLabelAndOrder.value)
      }
    }

    const sortArrow = computed(() => {
      return columnLabelAndOrder.value.order === 'asc' ? '&#x2191;' : '&#x2193;'
    })

    return {
      onSort,
      selectAll,
      checked,
      sortArrow,
      columnLabelAndOrder
    }
  }
})
</script>
