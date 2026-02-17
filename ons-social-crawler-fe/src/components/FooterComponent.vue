<script setup>
const version = import.meta.env.VITE_APP_VERSION
let year = new Date()
year = year.getFullYear()
</script>
<template>
  <footer class="footer">
    <div class="legal-info">
      <span>{{ year }}© Made with 💛</span>
      <span>v{{ version }}</span>
    </div>
  </footer>
</template>

<style lang="scss">
#app {
  .footer {
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    $paddingY: 1rem;
    min-height: 3rem;
    padding: $paddingY var(--drawer-paddingX);

    &::before {
      content: '';
      display: block;
      background-color: #eee;
      width: 100%;
      height: 0.15rem;
      top: -$paddingY;
    }

    .legal-info {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    @media screen and (max-width: 992px) {
      .legal-info {
        flex-direction: column;
        gap: 0;
      }
    }
  }
}
</style>
