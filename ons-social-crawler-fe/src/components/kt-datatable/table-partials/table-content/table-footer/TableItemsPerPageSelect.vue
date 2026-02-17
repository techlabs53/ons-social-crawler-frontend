<template>
  <div
    class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start gap-5"
  >
    <label for="items-per-page">
      <select
        class="form-select form-select-sm form-select-solid"
        v-if="itemsPerPageDropdownEnabled"
        v-model="itemsCountInTable"
        name="items-per-page"
        id="items-per-page"
      >
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
      </select>
    </label>
    <div>
      <span class="fs-6 text-gray-800"
        >{{ $t('common.totalRows') }}: <span class="fw-bold text-primary">{{ total }}</span></span
      >
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  // type WritableComputedRef,
  computed
} from 'vue'

export default defineComponent({
  name: 'table-items-per-page-select',
  components: {},
  props: {
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  emits: ['update:itemsPerPage'],
  setup(props, { emit }) {
    const inputItemsPerPage = ref(10)

    onMounted(() => {
      inputItemsPerPage.value = props.itemsPerPage
    })

    const itemsCountInTable = computed({
      get() {
        return props.itemsPerPage
      },
      set(value) {
        emit('update:itemsPerPage', value)
      }
    })

    return {
      itemsCountInTable
    }
  }
})
</script>
