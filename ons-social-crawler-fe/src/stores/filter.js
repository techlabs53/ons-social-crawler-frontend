import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filter', () => {
  const defaultRange = {
    end: new Date(new Date(new Date().setHours(-24)).setHours(23, 59, 59, 999)), // yesterday, end of the day
    start: new Date(new Date().setHours(-168, 0, 0, 0)) //1 week
  }

  const youTubeDateRange = ref(defaultRange)
  const twitchDateRange = ref(defaultRange)
  const twitterDateRange = ref(defaultRange)

  const getYouTubeDateRange = computed(() => youTubeDateRange.value)
  const getTwitchDateRange = computed(() => twitchDateRange.value)
  const getTwitterDateRange = computed(() => twitterDateRange.value)

  const setYouTubeDateRange = (dateRange) => {
    youTubeDateRange.value = dateRange
  }

  const setTwitchDateRange = (dateRange) => {
    twitchDateRange.value = dateRange
  }

  const setTwitterDateRange = (dateRange) => {
    twitterDateRange.value = dateRange
  }

  const resetYouTubeDateRange = () => {
    youTubeDateRange.value = {
      end: new Date(new Date(new Date().setHours(-24)).setHours(23, 59, 59, 999)), // yesterday, end of the day
      start: new Date(new Date().setHours(-168, 0, 0, 0)) //1 week
    }
  }

  const resetTwitchDateRange = () => {
    twitchDateRange.value = {
      end: new Date(new Date(new Date().setHours(-24)).setHours(23, 59, 59, 999)), // yesterday, end of the day
      start: new Date(new Date().setHours(-168, 0, 0, 0)) //1 week
    }
  }

  const resetTwitterDateRange = () => {
    twitterDateRange.value = {
      end: new Date(new Date(new Date().setHours(-24)).setHours(23, 59, 59, 999)), // yesterday, end of the day
      start: new Date(new Date().setHours(-168, 0, 0, 0)) //1 week
    }
  }

  const resetAll = () => {
    resetYouTubeDateRange()
    resetTwitchDateRange()
    resetTwitterDateRange()
  }

  return {
    getYouTubeDateRange,
    getTwitchDateRange,
    getTwitterDateRange,
    setYouTubeDateRange,
    setTwitchDateRange,
    setTwitterDateRange,
    resetYouTubeDateRange,
    resetTwitchDateRange,
    resetTwitterDateRange,
    resetAll
  }
})
