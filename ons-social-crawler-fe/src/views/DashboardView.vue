<script setup>
import DashboardToolbar from './components/DashboardToolbar.vue'
import LatestTransactionsChart from './components/LatestTransactionsChart.vue'
import LatestTransactionsChartNorm from './components/LatestTransactionsChartNorm.vue'
import LatestTransactionsChartClustered from './components/LatestTransactionsChartClustered.vue'
import TransactionBreakdownChart from './components/TransactionBreakdownChart.vue'
import TransactionWordsCloud from './components/TransactionWordsCloud.vue'
import TransactionResponses from './components/TransactionResponses.vue'
import LatestTransactionsChartWithScores from './components/LatestTransactionsChartWithScores.vue'

import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import ApiService from '../core/services/ApiService'
import { useLoadingStore } from '@/stores/loading'
import alert from '@/core/helpers/alert'
import 'zingchart/es6'
import { useFilterStore } from '../stores/filter'

const route = useRoute()
const router = useRouter()
const loading = useLoadingStore()
const filter = useFilterStore()
const { dangerAlert } = alert()
const transactions = ref([])
const dashboardToolbarRef = ref(null)

//filters
const range = ref({
  end: new Date(new Date(new Date().setHours(-24)).setHours(23, 59, 59, 999)), // yesterday, end of the day
  start: new Date(new Date().setHours(-168, 0, 0, 0)) //1 week
})
const selectedSocial = ref('all')
const maxRange = ref({
  end: new Date(new Date(new Date().setHours(-24)).setHours(23, 59, 59, 999)), // yesterday, end of the day
  start: new Date(new Date().setHours(-168, 0, 0, 0)) //1 week
})

const toTimestamp = (strDate) => {
  const dt = Date.parse(strDate)
  return dt
}

const filteredTransactions = computed(() => {
  //console.log('range %O', range)
  //console.log('start %O', range.value.start)
  //console.log('end %O', range.value.end)
  return transactions.value.filter((entry) => {
    //console.log(entry)
    //console.log('entry.social : %s', entry.social)
    //console.log('selectedSocial : %s', selectedSocial.value)
    return entry.timestamp >= range.value.start.getTime() &&
      entry.timestamp < range.value.end.getTime() &&
      selectedSocial.value == 'all'
      ? true
      : entry.social == selectedSocial.value
  })
})

const updateSocial = (social) => {
  //console.log('in updateSocial -> %s', social)
  selectedSocial.value = social
}

const doubleClick = (object) => {
  // console.log('in doubleClick -> %O', object)
  const modelData = [
    new Date(new Date(object.key).setHours(0, 0, 0, 0)),
    new Date(new Date(object.key).setHours(23, 59, 59, 999))
  ]
  updateRange(modelData)
}

const updateRangeFromZoom = (object) => {
  // console.log('in zoom : %o', object)
  const modelData = [
    new Date(new Date(object.kmin).setHours(0, 0, 0, 0)),
    new Date(new Date(object.kmax).setHours(23, 59, 59, 999))
  ]
  // console.log("modelData : %O", modelData)
  updateRange(modelData)
}

const updateRange = (modelData) => {
  // console.log("maxRange : %s - %s", maxRange.value.start, maxRange.value.end)
  // console.log("in updateRange : %O", modelData)
  range.value.start = modelData[0]
  range.value.end = modelData[1]
  // console.log("new range : %O", range.value)
  if (range.value.start < maxRange.value.start || range.value.end > maxRange.value.end) {
    maxRange.value.start = range.value.start
    maxRange.value.end = range.value.end
    init()
  }
}

const focusOnChildComponent = () => {
  dashboardToolbarRef.value.focusSocialFilter()
}

const navigateToPage = () => {
  let routeName
  switch (selectedSocial.value) {
    case 'youtube':
      routeName = 'youTube'
      filter.setYouTubeDateRange(range.value)
      break
    case 'twitter':
      routeName = 'twitter'
      filter.setTwitterDateRange(range.value)
      break
    case 'twitch':
      routeName = 'twitch'
      filter.setTwitchDateRange(range.value)
      break
    default:
      focusOnChildComponent()
      return
  }
  router.push({ name: routeName })
}

const total = ref(0)
const data = ref([])

const init = async () => {
  loading.show()
  try {
    filter.resetAll()

    const comments = await ApiService.get(
      'elasticsearch/query',
      `?dateFrom=${range.value.start}&dateTo=${range.value.end}`
    )
    // console.log("in init, query result : ", comments)
    // console.log('selectedSocial : %s', selectedSocial.value)
    data.value = comments.data.hits ?? []
    data.value = data.value.map((hit) => {
      //hit?._source?.comment || hit?._source?.data) ?? []
      let item = {}
      item = hit._source?.comment || hit._source?.data
      item.social =
        hit._index == 'twitchcomments'
          ? 'twitch'
          : hit._index == 'youtubecomments'
          ? 'youtube'
          : 'twitter'
      item.predictionScore = 0
      if (item.prediction) {
        item.predictionScore = item.prediction.score
      }
      return item
    })
    total.value = comments.data.total.value ?? 0

    //per grafici
    transactions.value = comments.data ?? []
    transactions.value = data.value.map((hit) => hit?._source?.comment) ?? []
    transactions.value = data.value.map((item) => {
      let newItem = {}
      newItem.social = item.social
      newItem.isHate = item.predictionScore > 0 ? 1 : 0
      newItem.timestamp = toTimestamp(item.publishedAt) || toTimestamp(item.created_at)
      newItem.score = item.predictionScore
      newItem.response = item.response
      newItem.dimension = item.prediction ? item.prediction.dimension : ''
      newItem.tokens = item.prediction ? item.prediction.tokens : ''
      return newItem
    })
    //console.log("in init, transactions for graphs : ", transactions.value)
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

onMounted(async () => {
  await init()
})
</script>

<template>
  <main class="page-container settings-view">
    <div class="page-title">
      <h1>
        <span class="title-icon custom-chart">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"
            />
          </svg>
        </span>
        {{ route?.meta?.label }}
      </h1>
    </div>
    <div class="section">
      <div class="section-content">
        <div>
          <DashboardToolbar
            ref="dashboardToolbarRef"
            :range="range"
            @updateRange="updateRange"
            @updateSocial="updateSocial"
            @navigateToPage="navigateToPage"
          />
        </div>
        <div>
          <LatestTransactionsChart
            :entries="filteredTransactions"
            :range="range"
            @zoom="updateRangeFromZoom"
            @node_doubleclick="doubleClick"
          />
        </div>
        <div>
          <LatestTransactionsChartNorm
            :entries="filteredTransactions"
            :range="range"
            @zoom="updateRangeFromZoom"
            @node_doubleclick="doubleClick"
          />
        </div>
        <div>
          <LatestTransactionsChartClustered :entries="filteredTransactions" />
        </div>
        <div>
          <TransactionBreakdownChart :entries="filteredTransactions" />
        </div>
        <div>
          <TransactionWordsCloud :entries="filteredTransactions" />
        </div>
        <div>
          <TransactionResponses :entries="filteredTransactions" />
        </div>
        <div>
          <LatestTransactionsChartWithScores
            :entries="filteredTransactions"
            :range="range"
            @zoom="updateRangeFromZoom"
            @node_doubleclick="doubleClick"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.page-container {
  .section {
    margin-bottom: 3.2rem;

    .section-title {
      margin-bottom: 1rem;
    }

    .section-content {
      display: grid;
      grid-template-columns: 1fr; /* Single column layout */
      gap: 3rem;
    }
  }
}
</style>
