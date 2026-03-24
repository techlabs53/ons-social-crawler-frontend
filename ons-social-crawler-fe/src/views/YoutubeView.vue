<script setup>
import { useRoute, RouterLink } from 'vue-router'
import ApiService from '../core/services/ApiService'
import { onMounted, onUnmounted, ref } from 'vue'
import DigiTable from '@/components/kt-datatable/DigiTable.vue'
import global from '../core/helpers/functions.js'
import { useLoadingStore } from '@/stores/loading'
import FiltersToolbar from '@/views/components/FiltersToolbar.vue'
import StreamButton from '@/views/components/StreamButton.vue'
import alert from '@/core/helpers/alert'
import { useFilterStore } from '../stores/filter'

const { dangerAlert } = alert()
const loading = useLoadingStore()
const filter = useFilterStore()
const route = useRoute()
const { dateTimeFormatter, decodeHtml, translate } = global()
const total = ref(0)
const totalComments = ref(0)
const data = ref([])
const size = ref(10)
const page = ref(1)
const sortLabel = ref('')
const sortOrder = ref('')

const init = async () => {
  loading.show()
  try {
    const res = await ApiService.get(
      'youtube/comments',
      `?size=${size.value}&page=${page.value}&search=${search.value}&prediction=${predictionId.value}&sortLabel=${sortLabel.value}&sortOrder=${sortOrder.value}&dateFrom=${filter.getYouTubeDateRange.start}&dateTo=${filter.getYouTubeDateRange.end}&category=${categoryId.value}`
    )
    data.value = res.data.hits ?? []
    data.value = data.value.map((hit) => hit?._source?.comment) ?? []
    data.value = data.value.map((item) => {
      // per sorting score
      item.predictionScore = 0
      if (item.prediction) {
        item.predictionScore = item.prediction.score
      }
      return item
    })
    total.value = res.data.total.value ?? 0
    totalComments.value = res.data.totalComments ?? 0
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

const searchedFields = ['textDisplay']
const search = ref('')
const predictionId = ref(0)
const categoryId = ref('all')

const headerConfig = ref([
  {
    columnName: '',
    columnLabel: 'actions',
    sortEnabled: false,
    columnMinWidth: 100
  },
  {
    columnName: 'Data',
    columnLabel: 'publishedAt',
    sortEnabled: true,
    columnMinWidth: 175
  },
  {
    htmlName:
      '<img src="/media/triangle-exclamation-solid.svg" class="mb-1" style="width: 25px; fill: #ff0000"/>',
    columnLabel: 'prediction',
    sortEnabled: false
  },
  {
    columnName: 'Commento',
    columnLabel: 'textDisplay',
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
  const youTubeStatus = data?.youTube || false
  if (youTubeStatus && !interval) {
    interval = setInterval(async () => {
      await init()
    }, 5000)
  } else if (!youTubeStatus) {
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
  filter.setYouTubeDateRange({
    end: modelData[1],
    start: modelData[0]
  })
  // if (range.value.start < maxRange.value.start || range.value.end > maxRange.value.end) {
  //   maxRange.value.start = range.value.start
  //   maxRange.value.end = range.value.end
  //   init()
  // }
  init()
}

const updateCategory = (modelData) => {
  categoryId.value = modelData
  console.log(modelData)
  init()
}

const getResponse = (row) => {
  const response = row?.response || null

  if (response && typeof response === 'object') {
    return response[0]?.answer || ''
  }

  return response
}

const hasResponse = (row) => {
  const version = row?.version || 0

  if (version >= 11) {
    const confidences_nnr_multi = row?.responseObj?.confidences_nnr_multi || 0
    const confidences_nnr_multi_threshold = row?.responseObj?.confidences_nnr_multi_threshold || 0

    return confidences_nnr_multi > confidences_nnr_multi_threshold
  } else {
    const response = row?.response || null

    return response !== 'miss'
  }
}

const getPrediction = (row) => {
  const prediction = row.prediction?.dimension || row.prediction?.dimensions || null
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
  const prediction = row.prediction?.tokens || ''
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
        <span><i class="title-icon fa-brands fa-youtube"></i></span> {{ route?.meta?.label }}
      </h1>
      <StreamButton name="youTube" @on-update="streamButtonUpdate" />
    </div>

    <div class="page-content">
      <!--   FILTRI::START   -->
      <FiltersToolbar
        @on-search="onSearch"
        @on-prediction="onPrediction"
        @update-range="updateRange"
        @update-category="updateCategory"
        :range="filter.getYouTubeDateRange"
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
        sort-label="publishedAt"
        @on-items-per-page-change="changeItemPerPage"
        @page-change="changePage"
        @on-sort="changeSort"
      >
        <template v-slot:actions="{ row: row }">
          <div class="d-flex gap-3">
            <a
              style="display: flex; align-items: center"
              :href="'https://www.youtube.com/watch?v=' + row.videoId"
              target="_blank"
              ><i class="action-icon fa-brands fa-youtube fs-5"></i
            ></a>
            <!--              @click="openItem(row.ID, 'kt_modal_asset_edit')"-->
            <router-link
              :to="{
                name: 'youTubeDetail',
                params: { id: row.id },
                query: { videoTitle: row.title, videoId: row.videoId }
              }"
            >
              <!--            <i class="fa-solid fa-info text-primary fs-5"></i>-->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="action-icon view-detail-icon"
                viewBox="0 0 512 512"
              >
                <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                />
              </svg>
              <!--            <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">&lt;!&ndash;! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. &ndash;&gt;<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>-->
              <!--            <i class="fa-sharp fa-solid fa-comments fs-5"></i>-->
              <!--            <i class="fa-solid fa-comment fs-5"></i>-->
              <!--            <svg xmlns="http://www.w3.org/2000/svg" class="action-icon view-comments-icon" viewBox="0 0 512 512">&lt;!&ndash;! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. &ndash;&gt;<path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>-->
            </router-link>
          </div>
        </template>

        <template v-slot:publishedAt="{ row: row }">
          {{ dateTimeFormatter(row.publishedAt) }}
        </template>

        <template v-slot:prediction="{ row: row }">
          <span v-if="row.prediction" class="badge bg-success">Si</span>
          <span v-else class="badge bg-danger">No</span>
        </template>

        <template v-slot:textDisplay="{ row: row }">
          <div v-html="decodeHtml(row.textDisplay)"></div>
          <template v-if="row.response">
            <hr />
            <span v-if="hasResponse(row)" class="text-success">{{ getResponse(row) }}</span>

            <span v-else class="text-danger">Dati insufficienti per elaborare una risposta</span>

            <template v-if="row.responseObj?.confidences_nnr_multi">
              <br />
              <span class="badge bg-warning"
                >Confidenza: {{ row.responseObj?.confidences_nnr_multi }}</span
              >
            </template>
          </template>
        </template>

        <template v-slot:prediction_nnr="{ row: row }">
          <span v-if="row.prediction">{{ row.prediction.prediction_nnr }}</span>
          <span v-else></span>
        </template>

        <template v-slot:score="{ row: row }">
          <span v-if="row.prediction">{{ row.prediction.score }}</span>
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
<style lang="scss">
.action-icon {
  &.fa-youtube {
  }

  &.view-comments-icon,
  &.view-detail-icon {
    fill: var(--primary-color);
    height: 1.4rem;
  }
}
</style>
