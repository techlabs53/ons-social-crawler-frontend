<script setup>
import { useUserMenuStore } from '../stores/userMenu'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userMenuStore = useUserMenuStore()
const authStore = useAuthStore()
const router = useRouter()

const signOut = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

const displayUserName = computed(() => {
  let name = ''
  let parsedNamed = ''
  if (
    localStorage.getItem('userName') &&
    typeof localStorage.getItem('userName') === 'string' &&
    localStorage.getItem('userName').length > 0
  ) {
    name = localStorage.getItem('userName')
    const parts = name.split(' ')
    parsedNamed = parts[0][0].toUpperCase()
    if (parts.length > 1) {
      parsedNamed += parts[1][0].toUpperCase()
    } else if (parts[0].length > 1) {
      parsedNamed += parts[0][1].toUpperCase()
    }
  } else {
    parsedNamed = 'ONS'
  }
  return parsedNamed
})

const userName = computed(() => {
  return localStorage.getItem('userName') || ''
})

const userRoles = computed(() => {
  return authStore.getRoles() || ''
})
</script>
<template>
  <div class="user-menu">
    <div class="user-menu__button" @click="userMenuStore.toggleUserMenuStatus">
      {{ displayUserName }}
    </div>
    <div
      class="user-menu__options"
      v-if="userMenuStore.isUserMenuOpen"
      @click="userMenuStore.toggleUserMenuStatus"
    >
      <span class="item">{{ userName }}</span>
      <el-tag class="p-2">{{ userRoles }}</el-tag>
      <el-divider class="my-2" />
      <div class="options-item" @click="signOut">
        <div class="options-item__image">
          <svg xmlns="http://www.w3.org/2000/svg" fill="#666666" viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
            />
          </svg>
        </div>
        <p class="options-item__text">Esci</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  $header-height: var(--header-height);
  $sidebar-padding: var(--sidebar-padding);

  .user-menu {
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    width: 10rem;
    height: $header-height + $sidebar-padding;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .user-menu__button {
      // square
      background-color: var(--primary-color);
      color: white;
      border-radius: 4px;
      padding: 0.15rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: calc($header-height / 100 * 30);
      letter-spacing: 0.1rem;
      cursor: pointer;
      transition: transform 0.1s;

      &:active {
        transform: scale(0.9);
        transition: transform 0.05s;
      }

      &:hover {
        opacity: 0.9;
      }
    }
  }

  .user-menu__options {
    position: absolute;
    top: calc($header-height - 0.5rem);
    right: 3rem;
    background-color: white;
    box-shadow: 0px 3px 5px 1px hsla(0, 0%, 50%, 0.5);
    border-radius: 4px;
    padding: 1rem 1.5rem;
    z-index: 1;
    width: 100%;

    .item {
      font-weight: 600;
      color: #666666;
    }

    .options-item {
      display: flex;
      gap: 0.7rem;
      align-items: center;
      cursor: pointer;
      z-index: 1;

      .options-item__image {
        width: 1rem;
        height: auto;
        display: flex;
        align-items: center;
      }

      .options-item__text {
        font-weight: 600;
        color: #666666;
      }
    }
  }
}
</style>
