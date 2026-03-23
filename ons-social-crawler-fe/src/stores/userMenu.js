import { defineStore } from 'pinia'

export const useUserMenuStore = defineStore({
  id: 'userMenu',
  state: () => ({
    isUserMenuOpen: false
  }),
  actions: {
    toggleUserMenuStatus() {
      this.isUserMenuOpen = !this.isUserMenuOpen
    }
  }
})
