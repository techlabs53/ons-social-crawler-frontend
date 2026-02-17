<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <TableContent
      @on-items-select="onItemSelect"
      @on-sort="onSort"
      :header="header"
      :data="dataToDisplay"
      :checkboxEnabled="checkboxEnabled"
      :checkboxLabel="checkboxLabel"
      :empty-table-text="emptyTableText"
      :sort-label="sortLabel"
      :sort-order="sortOrder"
      :loading="loading"
      :only-display="
        onlyDisplay /* prop necessaria per tabelle in sola visualizzazione (no search, sort, ...): necessaria quando più tabelle in una stessa pagina */
      "
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
        <slot :name="name" :row="item" />
      </template>
    </TableContent>
    <TableFooter
      v-if="tableFooter"
      @page-change="pageChange"
      :current-page="currentPage"
      v-model:itemsPerPage="itemsInTable"
      :count="totalItems"
      :total="totalRows"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
    />
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import TableContent from '@/components/kt-datatable/table-partials/table-content/TableContent.vue'
import TableFooter from '@/components/kt-datatable/table-partials/TableFooter.vue'
// import { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from 'array-sort'

export default defineComponent({
  name: 'kt-datatable',
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true },
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: 'id' },
    total: { type: Number, required: false },
    loading: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String,
      required: false,
      default: 'desc'
    },
    emptyTableText: { type: String, required: false, default: 'No data found' },
    cPage: { type: Number, required: false, default: 1 },
    search: { type: String, required: false },
    // eslint-disable-next-line vue/require-valid-default-prop
    searchedFields: { type: Array, required: false, default: [] },
    predictionFilter: { type: Number, required: false },
    tableFooter: { type: Boolean, required: false, default: true },
    onlyDisplay: { type: Boolean, required: false, default: false }
  },
  emits: [
    'page-change',
    'on-sort',
    'on-items-select',
    'on-items-per-page-change',
    'on-search-change'
  ],
  components: {
    TableContent,
    TableFooter
  },
  setup(props, { emit }) {
    const currentPage = computed(() => props.cPage)
    const itemsInTable = ref(props.itemsPerPage)
    const tableData = ref([])

    const init = (value) => {
      tableData.value = value
    }

    const sortLabel = ref({ label: null, order: 'asc' })

    const searchingFunc = (obj, value) => {
      value = value.toLowerCase()
      for (let field of props.searchedFields) {
        let key = field
        let name = ''
        let fieldValue = ''

        if (typeof field === 'object') {
          key = field.key
          name = field.name

          if (Array.isArray(obj[key])) {
            // per DigiSelect mode "multiple" o "tags"
            obj[key].forEach((item) => (fieldValue += `${item?.[name].toLowerCase()} `))
          } else {
            // per DigiSelect mode "single"
            fieldValue = ('' + obj[key]?.[name]).toLowerCase()
          }
        } else {
          // per tutti i campi non DigiSelect
          fieldValue = ('' + obj[key]).toLowerCase()
        }

        if (fieldValue.indexOf(value) != -1) {
          return true
        }
      }
      return false
    }

    const predictionFilter = (data) => {
      let recordPrediction = data.prediction === null ? 1 : 2

      if (props.predictionFilter && props.predictionFilter !== 0) {
        return recordPrediction == props.predictionFilter
      }
      return true
    }

    const filterData = () => {
      if (props.onlyDisplay) {
        tableData.value = props.data
        return
      }
      // currentPage.value = 1
      tableData.value = []
      // if (val !== "") {
      let results = []
      for (let j = 0; j < props.data.length; j++) {
        if (searchingFunc(props.data[j], props.search) && predictionFilter(props.data[j])) {
          results.push(props.data[j])
        }
      }
      tableData.value = results
      sonSortort(sortLabel.value)

      // } else {
      //   tableData.value = props.data;
      // }
    }

    watch(
      () => itemsInTable.value,
      (val) => {
        // currentPage.value = 1
        emit('on-items-per-page-change', val)
      }
    )

    watch(
      () => props.data,
      (val) => {
        init(val)
        // filterData()
      }
    )

    watch(
      () => props.search,
      (val) => {
        emit('on-search-change', val)
        // filterData()
      }
    )

    watch(
      () => props.predictionFilter,
      () => {
        // filterData()
      }
    )

    const pageChange = (page) => {
      // currentPage.value = page
      emit('page-change', page)
    }

    const dataToDisplay = computed(() => {
      if (tableData.value) {
        if (tableData.value.length <= itemsInTable.value) {
          return tableData.value
        } else {
          let sliceFrom = (currentPage.value - 1) * itemsInTable.value
          return tableData.value.slice(sliceFrom, sliceFrom + itemsInTable.value)
        }
      }
      return []
    })

    const totalItems = computed(() => {
      if (tableData.value) {
        if (tableData.value.length <= itemsInTable.value) {
          return props.total
        } else {
          return tableData.value.length
        }
      }
      return 0
    })

    const onSort = (sort) => {
      emit('on-sort', sort)
    }

    const sonSortort = (sort) => {
      const reverse = sort.order === 'desc'
      if (sort.label) {
        let sortLabel = sort.label

        if (sort.label === 'score') {
          sortLabel = 'predictionScore'
        }

        arraySort(tableData.value, sortLabel, { reverse })
      }
    }
    // const onSort = (sort) => {
    //   sortLabel.value = sort
    //   sonSortort(sort)
    // }

    //eslint-disable-next-line
    const onItemSelect = (selectedItems) => {
      emit('on-items-select', selectedItems)
    }

    const totalRows = computed(() => {
      return totalItems.value
    })

    onMounted(async () => {
      init(props.data)
    })

    return {
      pageChange,
      dataToDisplay,
      onSort,
      onItemSelect,
      itemsInTable,
      totalItems,
      totalRows,
      currentPage
    }
  }
})
</script>
