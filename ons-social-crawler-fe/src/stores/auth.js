import { ref } from 'vue'
import { defineStore } from 'pinia'
import ApiService from '../core/services/ApiService'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import JwtService from '@/core/services/JwtService'
import Swal from 'sweetalert2'
import { useLoadingStore } from '@/stores/loading'

export const useAuthStore = defineStore('auth', () => {
  const loading = useLoadingStore()
  const user = ref({})
  const userRoles = ref([])
  const isAuthenticated = ref(!!JwtService.getToken())

  function setRoles(res) {
    userRoles.value = res?.user ?? []
  }

  function getRoles() {
    return userRoles.value.join(',')
  }

  function setAuth(authUser) {
    isAuthenticated.value = true
    user.value = authUser.user
    localStorage.setItem('userName', user.value?.displayName)
    JwtService.saveToken(user.value.accessToken)
  }

  function purgeAuth() {
    isAuthenticated.value = false
    user.value = {}
    window.localStorage.removeItem('userName')
    JwtService.destroyToken()
  }

  async function login(credentials = {}) {
    loading.show()
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        credentials?.email.value,
        credentials?.password.value
      )
      setAuth(res)
    } catch (error) {
      let errorMessage = ''
      if (
        error.code.includes('auth/wrong-password') ||
        error.code.includes('auth/user-not-found')
      ) {
        errorMessage = 'Le credenziali inserite non sono corrette'
      }
      Swal.fire({
        title: 'Attenzione!',
        icon: 'error',
        text: errorMessage,
        buttonsStyling: false,
        showConfirmButton: false,
        heightAuto: false,
        timer: 2500
      })
    } finally {
      loading.hide()
    }
  }

  async function logout() {
    await signOut(auth)
    purgeAuth()
  }

  async function verifyAuth() {
    if (JwtService.getToken()) {
      try {
        ApiService.setHeader()
        const res = await ApiService.post('auth/verify')
        setRoles(res.data)
      } catch (err) {
        await logout()
      }
    } else {
      await logout()
    }
  }

  return {
    // errors,
    user,
    userRoles,
    isAuthenticated,
    login,
    logout,
    verifyAuth,
    getRoles
  }
})
