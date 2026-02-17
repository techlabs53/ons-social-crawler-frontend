<script setup>
import { ref, onMounted } from 'vue'
import NavList from '@/components/NavList.vue'
import { useSidebarStore } from '../stores/sidebar'
import LogoComponent from '@/components/LogoComponent.vue'

const sidebarStore = useSidebarStore()
</script>
<template>
  <div :class="['sidebar', sidebarStore.isSidebarOpen ? 'sidebar--open' : '']">
    <div
      :class="['sidebar__arrow', sidebarStore.isSidebarOpen ? 'sidebar__arrow--rotate' : '']"
      @click="sidebarStore.toggleSidebarStatus"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
        <path
          d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L370.7 256 233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L178.7 256 41.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
        />
      </svg>
    </div>
    <section class="logo section-top">
      <LogoComponent />
    </section>
    <section class="nav">
      <NavList />
    </section>
  </div>
</template>

<style lang="scss">
$sidebar-opened-width: auto;
$sidebar-padding: var(--sidebar-padding);
$header-height: var(--header-height);
.sidebar {
  transition: 0.25s;
  min-width: 15rem;
  flex: 0 1 $sidebar-opened-width;
  background-color: var(--primary-color);
  min-height: 100vh;
  padding: $sidebar-padding 1rem;
  position: relative;
  display: flex;
  flex-direction: column;

  .logo {
  }

  .sidebar__arrow {
    $size: 1.5rem;
    visibility: hidden;
    position: absolute;
    z-index: 1;
    top: calc(($header-height + $sidebar-padding) / 2);
    right: 0;
    transform: translate(50%, -50%);
    height: $size;
    width: $size;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 60%;
      fill: var(--primary-color);
    }

    &:hover {
      svg {
        fill: var(--secondary-color);
      }
    }

    transition: transform 0.1s;
    &:active {
      transform: translate(50%, -50%) scale(0.9);
      transition: transform 0.05s;
      svg {
        fill: var(--primary-color);
      }
    }
  }

  .sidebar__arrow--rotate {
    transform: translate(50%, -50%) rotate(180deg);
  }

  .section-top {
    height: var(--header-height);
    padding-bottom: $sidebar-padding;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .section-top::after {
    $width: 70%;
    content: '';
    display: block;
    width: $width;
    height: 1px;
    background-color: lightgrey;
    position: absolute;
    bottom: 0;
    left: calc((100% - $width) / 2);
    transition: 0.25s;
  }

  .nav {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

@media screen and (max-width: 992px) {
  .sidebar {
    padding: $sidebar-padding 0.3rem;
    transition: 0.25s;
    min-width: 3rem;
    flex: 0 0 3.5rem;
    min-height: 100vh;

    .sidebar__arrow {
      visibility: visible;
    }

    .logo-image {
      visibility: hidden;
    }

    .section-top::after {
      width: 0;
      transition: 0.25s;
    }
  }
}

.sidebar--open {
  flex: 0 0 $sidebar-opened-width !important;
  padding: $sidebar-padding 1rem;
}
</style>
