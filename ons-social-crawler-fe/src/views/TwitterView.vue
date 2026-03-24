<script setup>
import { useRoute } from 'vue-router'
import ApiService from '../core/services/ApiService'
import { onMounted, ref, onUnmounted } from 'vue'
import DigiTable from '@/components/kt-datatable/DigiTable.vue'
import global from '../core/helpers/functions.js'
import { useLoadingStore } from '@/stores/loading'
import FiltersToolbar from '@/views/components/FiltersToolbar.vue'
import StreamButton from '@/views/components/StreamButton.vue'
import alert from '@/core/helpers/alert'
import { useFilterStore } from '../stores/filter'

const loading = useLoadingStore()
const filter = useFilterStore()
const { dangerAlert } = alert()
const route = useRoute()
const { dateTimeFormatter, decodeHtml, translate } = global()
const total = ref(0)
const totalComments = ref(0)
const data = ref([])
const size = ref(10)
const page = ref(1)
const sortLabel = ref('')
const sortOrder = ref('')
const range = ref({
  end: new Date(new Date(new Date().setHours(-24)).setHours(23, 59, 59, 999)), // yesterday, end of the day
  start: new Date(new Date().setHours(-168, 0, 0, 0)) //1 week
})

const init = async () => {
  loading.show()
  try {
    const res = await ApiService.get(
      'twitter/twits',
      `?size=${size.value}&page=${page.value}&search=${search.value}&prediction=${predictionId.value}&sortLabel=${sortLabel.value}&sortOrder=${sortOrder.value}&dateFrom=${filter.getTwitterDateRange.start}&dateTo=${filter.getTwitterDateRange.end}&category=${categoryId.value}`
    )
    data.value = res.data.hits.hits ?? []
    data.value = data.value.map((item) => {
      item.createdAt = item._source.data.createdAt // per sort data
      // per filtro odio::START
      item.prediction = null
      if (item._source.data.prediction) {
        item.prediction = item._source.data.prediction
      }
      // per filtro odio::END
      // per sort score::START
      item.predictionScore = 0
      if (item._source.data.prediction) {
        item.predictionScore = item._source.data.prediction.score
      }
      // per sort score::END
      item.text = item._source.data.text // per search

      return item
    })

    total.value = res.data.hits.total.value ?? 0
    totalComments.value = res.data.totalComments ?? 0
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

const searchedFields = ['text']
const search = ref('')
const predictionId = ref(0)
const categoryId = ref('all')

const headerConfig = ref([
  {
    columnName: 'Data',
    columnLabel: 'createdAt',
    sortEnabled: true,
    columnMinWidth: 175
  },
  {
    htmlName:
      '<img src="/media/triangle-exclamation-solid.svg" class="mb-1" style="width: 25px; fill: #ff0000"/>',
    columnLabel: 'isHate',
    sortEnabled: false
  },
  {
    columnName: 'Tweet',
    columnLabel: 'twit',
    sortEnabled: false
  },
  {
    columnName: 'Categorie',
    columnLabel: 'dimension',
    sortEnabled: false
  },
  {
    columnName: 'Parole Chiave',
    columnLabel: 'tokens',
    sortEnabled: false
  },
  {
    columnName: 'Similarità',
    columnLabel: 'prediction_nnr',
    sortEnabled: true,
    tdClass: 'text-center bg-warning'
  },
  {
    columnName: 'Grado',
    columnLabel: 'score',
    sortEnabled: true,
    tdClass: 'text-center bg-warning'
  }
])

const onSearch = (newValue) => {
  search.value = newValue
  page.value = 1
  init()
}

const onPrediction = (newValue) => {
  predictionId.value = newValue
  page.value = 1
  init()
}

let interval = null

onMounted(async () => {
  await init()
})

onUnmounted(() => {
  clearInterval(interval)
})

const streamButtonUpdate = (data) => {
  const twitterStatus = data?.twitter || false
  if (twitterStatus && !interval) {
    interval = setInterval(async () => {
      await init()
    }, 5000)
  } else if (!twitterStatus) {
    clearInterval(interval)
    if (typeof interval === 'number') {
      interval = null
      init()
    }
  }
}

const changeItemPerPage = (itemPerPage) => {
  page.value = 1
  size.value = itemPerPage
  init()
}

const changePage = (newPage) => {
  page.value = newPage
  init()
}

const changeSort = (sort) => {
  page.value = 1

  switch (sort.label) {
    case 'score':
      sortLabel.value = 'prediction.score'
      break
    case 'prediction_nnr':
      sortLabel.value = 'prediction.prediction_nnr'
      break
    default:
      sortLabel.value = sort.label
  }

  // sortLabel.value = sort.label === 'score' ? 'prediction.score' : sort.label
  sortOrder.value = sort.order
  init()
}

const updateRange = (modelData) => {
  filter.setTwitterDateRange({
    end: modelData[1],
    start: modelData[0]
  })
  init()
}

const updateCategory = (modelData) => {
  categoryId.value = modelData
  console.log(modelData)
  init()
}

const getResponse = (row) => {
  const response = row._source.data?.response || null

  if (response && typeof response === 'object') {
    return response[0]?.answer || ''
  }

  return response
}

const hasResponse = (row) => {
  const version = row._source.data?.version || 0

  if (version >= 11) {
    const confidences_nnr_multi = row._source.data?.responseObj?.confidences_nnr_multi || 0
    const confidences_nnr_multi_threshold =
      row._source.data?.responseObj?.confidences_nnr_multi_threshold || 0

    return confidences_nnr_multi > confidences_nnr_multi_threshold
  } else {
    const response = row._source.data?.response || null

    return response !== 'miss'
  }
}

const getPrediction = (row) => {
  const prediction =
    row._source.data.prediction?.dimension || row._source.data.prediction?.dimensions || null
  if (prediction && typeof prediction === 'object') {
    return Object.entries(prediction)
      .filter(([key, value]) => value > 0)
      .map(([key, value]) => key)
  } else if (prediction) {
    return prediction.split(' ')
  }

  return []
}

const getTokens = (row) => {
  const prediction = row._source.data.prediction?.tokens || ''
  if (prediction) {
    return prediction.split(' ')
  }

  return []
}
</script>
<template>
  <main class="page-container">
    <div class="page-title">
      <h1>
        <span><i class="title-icon fa-brands fa-x-twitter"></i></span> {{ route?.meta?.label }}
      </h1>
      <StreamButton name="twitter" @on-update="streamButtonUpdate" />
    </div>

    <div class="page-content">
      <!--   FILTRI::START   -->
      <FiltersToolbar
        @on-search="onSearch"
        @on-prediction="onPrediction"
        @update-range="updateRange"
        @update-category="updateCategory"
        :range="filter.getTwitterDateRange"
      />
      <!--   FILTRI::END   -->

      <div class="col-12 text-end">
        <span v-if="total >= 10000" class="fs-5 text-gray-800"
          >Ultimi <span class="fw-bold text-primary">10000</span> di
          <span class="fw-bold text-primary">{{ totalComments }}</span></span
        >
        <span v-else class="fs-5 text-gray-800"
          >Commenti: <span class="fw-bold text-primary">{{ total }}</span></span
        >
      </div>
      <DigiTable
        :data="data"
        :header="headerConfig"
        :searched-fields="searchedFields"
        :search="search"
        :prediction-filter="predictionId"
        :total="total"
        :cPage="page"
        sort-label="createdAt"
        @on-items-per-page-change="changeItemPerPage"
        @page-change="changePage"
        @on-sort="changeSort"
      >
        <template v-slot:twit="{ row: row }">
          <div v-html="decodeHtml(row._source.data.text)"></div>
          <template v-if="row._source.data.response">
            <hr />
            <!-- <span v-if="getResponse(row) !== 'miss'" class="text-success">{{
              getResponse(row)
            }}</span>
            <span v-else class="text-danger"> Dati insufficienti per elaborare una risposta</span> -->

            <span v-if="hasResponse(row)" class="text-success">{{ getResponse(row) }}</span>

            <span v-else class="text-danger">Dati insufficienti per elaborare una risposta</span>

            <template v-if="row._source.data.responseObj?.confidences_nnr_multi">
              <br />
              <span class="badge bg-warning"
                >Confidenza: {{ row._source.data.responseObj?.confidences_nnr_multi }}</span
              >
            </template>
          </template>
        </template>

        <template v-slot:prediction_nnr="{ row: row }">
          <span v-if="row._source.data.prediction">{{
            row._source.data.prediction.prediction_nnr
          }}</span>
          <span v-else></span>
        </template>

        <template v-slot:createdAt="{ row: row }">
          {{ dateTimeFormatter(row._source.data.createdAt) }}
        </template>
        <template v-slot:isHate="{ row: row }">
          <span v-if="row._source.data.prediction" class="badge bg-success">Si</span>
          <span v-else class="badge bg-danger">No</span>
        </template>

        <!-- <template v-slot:score="{ row: row }">
          <span v-if="row._source.data.prediction" class="">
            {{ row._source.data.prediction.score }}</span
          >
          <span v-else></span>
        </template> -->

        <template v-slot:score="{ row: row }">
          <span v-if="row._source.data.prediction">{{ row._source.data.prediction.score }}</span>
          <span v-else></span>
        </template>
        <template v-slot:dimension="{ row: row }">
          <ul class="m-0">
            <li v-for="prd in getPrediction(row)" :key="prd">
              {{ translate('categories', prd) }}
            </li>
          </ul>
        </template>
        <template v-slot:tokens="{ row: row }">
          <ul class="m-0">
            <li v-for="tkn in getTokens(row)" :key="tkn">{{ tkn }}</li>
          </ul>
        </template>
      </DigiTable>
    </div>
  </main>
</template>
<style lang="scss"></style>
