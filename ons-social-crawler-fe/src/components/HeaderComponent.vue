<script setup>
import UserMenu from '@/components/UserMenu.vue'
import LogoComponent from '@/components/LogoComponent.vue'
</script>
<template>
  <div class="header">
    <div class="section-central">
      <LogoComponent />
    </div>
    <UserMenu />
  </div>
</template>

<style lang="scss">
#app {
  $header-height: var(--header-height);
  $sidebar-padding: var(--sidebar-padding);

  .header {
    background-color: var(--secondary-color);
    height: calc($header-height + $sidebar-padding);

    display: flex;
    justify-content: flex-end;

    .section-central {
      flex: 1;
      padding-left: 1.9rem;

      .logo-image-container {
        visibility: hidden;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        height: calc(80% - $sidebar-padding);
      }
    }
  }

  @media screen and (max-width: 992px) {
    .header {
      .section-central {
        .logo-image-container {
          //visibility: visible;
        }
      }
    }
  }
}
</style>
