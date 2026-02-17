<script setup></script>
<template>
  <div class="logo-image-container">
    <router-link :to="{ name: 'youTube' }">
      <img class="logo-image" src="/logo/odiare-logo.jpeg" alt="logo" />
    </router-link>
  </div>
</template>
<style lang="scss">
.logo-image-container {
  height: 80%;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.9);
    transition: transform 0.05s;
  }

  &:hover {
    opacity: 0.95;
  }

  .logo-image {
    height: 100%;
    width: auto;
    border-radius: 4px;
  }
}

@media screen and (max-width: 992px) {
}
</style>
