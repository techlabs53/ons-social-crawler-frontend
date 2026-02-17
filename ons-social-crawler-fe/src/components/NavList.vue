<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useSidebarStore } from '../stores/sidebar'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { isArray } from '@vue/shared'

const sidebarStore = useSidebarStore()
const authStore = useAuthStore()
const route = useRoute()
const hasAccess = (routeRoles) => {
  return !isArray(routeRoles) ? true : routeRoles.some((x) => authStore.userRoles.includes(x))
}

const navList = ref([
  {
    label: 'Dashboard',
    icon: 'fa-solid fa-chart-line',
    routerName: 'dashboard',
    roles: ['Admin']
  },
  {
    label: 'YouTube',
    icon: 'fa-brands fa-youtube',
    routerName: 'youTube'
  },
  {
    label: 'Twitch',
    icon: 'fa-brands fa-twitch',
    routerName: 'twitch'
  },
  {
    label: 'Twitter',
    icon: 'fa-brands fa-square-x-twitter',
    routerName: 'twitter'
  },
  {
    label: 'Generatore Quiz',
    icon: 'fa-solid fa-dice-six',
    routerName: 'quizgenerator'
  },
  {
    label: 'Come Funziona',
    icon: 'fa-solid fa-circle-question',
    routerName: 'howitworks'
  }
])

const navListFooter = ref([
  {
    label: 'Impostazioni',
    icon: 'fa-solid fa-gear',
    routerName: 'settings',
    roles: ['Admin']
  }
])
</script>
<template>
  <nav class="nav-list">
    <ul class="nav-list-ul">
      <li v-for="(item, ix) in navList" :key="ix">
        <router-link
          :to="{ name: item.routerName }"
          v-if="hasAccess(item.roles)"
          class="nav-item-link"
        >
          <div :class="['nav-item', item.routerName === route.name ? 'nav-item--active' : '']">
            <div class="nav-item__icon-container">
              <svg
                v-if="item.routerName === 'dashboard'"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 448 512"
              >
                <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"
                />
              </svg>
              <svg
                v-else-if="item.routerName === 'settings'"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 512 512"
              >
                <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
                />
              </svg>
              <svg
                v-else-if="item.routerName === 'quizgenerator'"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 512 512"
              >
                <path
                  d="M192 104.8c0-9.2-5.8-17.3-13.2-22.8C167.2 73.3 160 61.3 160 48c0-26.5 28.7-48 64-48s64 21.5 64 48c0 13.3-7.2 25.3-18.8 34c-7.4 5.5-13.2 13.6-13.2 22.8c0 12.8 10.4 23.2 23.2 23.2H336c26.5 0 48 21.5 48 48v56.8c0 12.8 10.4 23.2 23.2 23.2c9.2 0 17.3-5.8 22.8-13.2c8.7-11.6 20.7-18.8 34-18.8c26.5 0 48 28.7 48 64s-21.5 64-48 64c-13.3 0-25.3-7.2-34-18.8c-5.5-7.4-13.6-13.2-22.8-13.2c-12.8 0-23.2 10.4-23.2 23.2V464c0 26.5-21.5 48-48 48H279.2c-12.8 0-23.2-10.4-23.2-23.2c0-9.2 5.8-17.3 13.2-22.8c11.6-8.7 18.8-20.7 18.8-34c0-26.5-28.7-48-64-48s-64 21.5-64 48c0 13.3 7.2 25.3 18.8 34c7.4 5.5 13.2 13.6 13.2 22.8c0 12.8-10.4 23.2-23.2 23.2H48c-26.5 0-48-21.5-48-48V343.2C0 330.4 10.4 320 23.2 320c9.2 0 17.3 5.8 22.8 13.2C54.7 344.8 66.7 352 80 352c26.5 0 48-28.7 48-64s-21.5-64-48-64c-13.3 0-25.3 7.2-34 18.8C40.5 250.2 32.4 256 23.2 256C10.4 256 0 245.6 0 232.8V176c0-26.5 21.5-48 48-48H168.8c12.8 0 23.2-10.4 23.2-23.2z"
                />
              </svg>
              <svg
                v-else-if="item.routerName === 'howitworks'"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 512 512"
              >
                <path
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                />
              </svg>
              <i v-else :class="['nav-item__icon', item.icon]"></i>
            </div>
            <span
              :class="[
                'nav-item__text',
                sidebarStore.isSidebarOpen ? 'nav-item__text--d-inline' : ''
              ]"
              >{{ item.label }}</span
            >
          </div>
        </router-link>
      </li>
    </ul>
  </nav>
  <nav class="nav-list mt-auto">
    <ul class="nav-list-ul">
      <li v-for="(item, ix) in navListFooter" :key="ix">
        <router-link
          :to="{ name: item.routerName }"
          v-if="hasAccess(item.roles)"
          class="nav-item-link"
        >
          <div :class="['nav-item', item.routerName === route.name ? 'nav-item--active' : '']">
            <div class="nav-item__icon-container">
              <svg
                v-if="item.routerName === 'dashboard'"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 448 512"
              >
                <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"
                />
              </svg>
              <svg
                v-else-if="item.routerName === 'settings'"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 512 512"
              >
                <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
                />
              </svg>
              <i v-else :class="['nav-item__icon', item.icon]"></i>
            </div>
            <span
              :class="[
                'nav-item__text',
                sidebarStore.isSidebarOpen ? 'nav-item__text--d-inline' : ''
              ]"
              >{{ item.label }}</span
            >
          </div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
#app .nav-list {
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  margin-top: 2.5rem;
  position: relative;
}

#app .nav-item-link {
  text-decoration: none;
}

$paddingX: 0.7rem;
#app .nav-item {
  padding: 0.4rem $paddingX;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  color: white;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: 0.25s;

  .nav-item__icon-container {
    width: 1.4rem;

    svg {
      width: 80%;
    }
  }

  .nav-item__text {
    font-weight: 600;
  }

  &::after {
    content: '';
    visibility: hidden;
    background-color: var(--secondary-color);
    position: absolute;

    height: 0.25rem;
    width: 2.7rem;
    bottom: 0;
    left: $paddingX;
  }

  &:hover::after {
    visibility: visible;
    transition-property: width;
    transition-duration: 0.16s;
    transition-timing-function: ease-in-out;
  }

  &:active {
    &::after {
      width: 0;
      transition-property: width;
      transition-duration: 0.05s;
      transition-timing-function: ease-out;
    }
  }
}

#app .nav-item--active::after {
  content: '';
  visibility: visible;
  background-color: var(--secondary-color);
  position: absolute;

  height: 0.25rem;
  width: 2.7rem;
  bottom: 0;
  left: $paddingX;
}

#app .nav-item__text--d-none {
  display: none !important;
}
#app .nav-item__text--d-inline {
  display: inline !important;
}

@media screen and (max-width: 992px) {
  #app .nav-item--active::after,
  #app .nav-item:hover::after {
    content: '';
    visibility: visible;
    background-color: var(--secondary-color);
    position: absolute;

    height: 0.25rem;
    width: 1rem;
    bottom: 0;
    left: $paddingX;
    transition: width 0s !important;
  }

  #app .nav-item__text {
    display: none;
  }
}
</style>
