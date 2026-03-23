import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// export const useSidebarStore = defineStore('sidebar', () => {
//     let isSidebarOpen = ref(false)
//     function toggleSidebarStatus() {
//         isSidebarOpen.value = !isSidebarOpen.value
//     }
//
//     return {toggleSidebarStatus, }
// })

export const useSidebarStore = defineStore({
  id: 'sidebar',
  state: () => ({
    isSidebarOpen: false
  }),
  actions: {
    toggleSidebarStatus() {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  }
})
