<script setup>
import { useRoute } from 'vue-router'
import ApiService from '../core/services/ApiService'
import { onMounted, ref } from 'vue'
import DigiTable from '@/components/kt-datatable/DigiTable.vue'
import global from '../core/helpers/functions.js'
import { useLoadingStore } from '@/stores/loading'
import FiltersToolbar from '@/views/components/FiltersToolbar.vue'
import alert from '@/core/helpers/alert'

const { dangerAlert } = alert()
const loading = useLoadingStore()
const route = useRoute()
const { dateTimeFormatter, decodeHtml, translate } = global()
const total = ref(0)
const commentsData = ref([])
const videoData = ref({})
const selectedCommentData = ref({})
const otherCommentsData = ref([])
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
      `youtube/videos/${route.query.videoId}/${route.params.id}`,
      `?size=${size.value}&page=${page.value}&search=${search.value}&prediction=${predictionId.value}&sortLabel=${sortLabel.value}&sortOrder=${sortOrder.value}&dateFrom=${range.value.start}&dateTo=${range.value.end}&category=${categoryId.value}`
    )

    videoData.value = res.data.video ?? {}

    commentsData.value = res.data.comments ?? []
    commentsData.value =
      commentsData.value.map((comment) => {
        return {
          ...comment?._source?.comment,
          score: comment?._score
        }
      }) ?? []

    commentsData.value = commentsData.value.map((item) => {
      // per sorting score
      item.predictionScore = 0
      if (item.prediction) {
        item.predictionScore = item.prediction.score
      }
      return item
    })

    otherCommentsData.value =
      commentsData.value.filter((comment) => comment.id !== route.params.id) ?? []

    total.value = res.data.totalComments > 0 ? res.data.totalComments - 1 : 0

    selectedCommentData.value = res.data.selectedComment || null
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

const headerConfigTableSelected = ref([
  {
    columnName: 'Data',
    columnLabel: 'publishedAt',
    sortEnabled: false,
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

onMounted(async () => {
  await init()
})

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
  range.value.start = modelData[0]
  range.value.end = modelData[1]
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
    <div class="section page-title">
      <h1>
        <span><i class="title-icon fa-brands fa-youtube"></i></span> {{ route?.meta?.label }} <br />
      </h1>
      <router-link :to="{ name: 'youTube' }">
        <button class="btn btn-primary" style="background-color: var(--primary-color) !important">
          Indietro
        </button>
      </router-link>
    </div>

    <div class="page-content">
      <section class="section video-info">
        <h2 class="section-title">Il video</h2>
        <div class="section-content">
          <div class="section-content__video">
            <div>
              <iframe
                class="embedded-video"
                :src="'https://www.youtube.com/embed/' + videoData.id"
                :title="videoData.title"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              >
              </iframe>
            </div>
          </div>

          <div class="section-content__info">
            <div class="video-info__row">
              <h4>Titolo</h4>
              <span>{{ videoData.title }}</span>
            </div>

            <div class="video-info__row" v-if="videoData.description">
              <h4>Descrizione</h4>
              <span>{{ videoData.description }}</span>
            </div>

            <div class="video-info__row">
              <h4>Data e ora di pubblicazione</h4>
              <span>{{ dateTimeFormatter(videoData.publishedAt) }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section comments-info">
        <h2 class="section-title">Il commento</h2>

        <DigiTable
          :data="[selectedCommentData]"
          :header="headerConfigTableSelected"
          :search="search"
          :tableFooter="false"
          :only-display="true"
        >
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
      </section>

      <section class="section comments-info">
        <h2 class="section-title">Gli altri commenti</h2>

        <FiltersToolbar
          @on-search="onSearch"
          @on-prediction="onPrediction"
          @update-range="updateRange"
          @update-category="updateCategory"
          :range="range"
        />

        <div class="col-12 text-end">
          <span class="fs-5 text-gray-800"
            >Commenti: <span class="fw-bold text-primary">{{ total }}</span></span
          >
        </div>
        <DigiTable
          :data="otherCommentsData"
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
      </section>
    </div>
  </main>
</template>
<style lang="scss">
.videoTitle,
.commentTitle {
  font-size: 1.4rem;
}

.section {
  --video-height: 22rem;
  --video-width: calc(22rem * 1.9);
  --section-video-height: var(--video-height);

  margin-bottom: 3.2rem;

  &.page-title {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .section-title {
    margin-bottom: 1rem;
  }

  .section-content {
    display: flex;
    gap: 3rem;

    embedded-video-container {
      height: var(--section-video-height);
      width: 50rem;
      outline: 1px dashed blue;
    }
    .embedded-video {
      height: var(--section-video-height);
      width: var(--video-width);
    }

    .section-content__info {
      overflow: auto;
      height: var(--section-video-height);

      .video-info__row {
        margin-bottom: 2.2rem;
        max-width: 70rem;
      }
    }
    .section-content__video {
      height: var(--section-video-height);
    }
  }
}

@media screen and (max-width: 1400px) {
  .section {
    &.video-info {
      .section-content {
        flex-direction: column;
        gap: 3rem;

        .section-content__info {
          height: auto;
        }
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .section {
    --video-height: 300px;
    --video-width: calc(300px * 1.9);
    --section-video-height: var(--video-height);
  }
}

@media screen and (max-width: 768px) {
  .section {
    --video-height: 220px;
    --video-width: calc(220px * 1.9);
    --section-video-height: var(--video-height);
  }
}
</style>
