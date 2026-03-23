import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'

export const useLoadingStore = defineStore('loading', () => {
  let loadingInstance

  function show() {
    loadingInstance = ElLoading.service({
      fullscreen: true
    })
  }

  function hide() {
    loadingInstance.close()
  }

  return {
    show,
    hide
  }
})
