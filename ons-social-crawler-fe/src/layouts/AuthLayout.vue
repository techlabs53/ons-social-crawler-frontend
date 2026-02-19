<template>
  <!--begin::Authentication Layout -->
  <!--begin::Wrapper-->
  <div>
    <router-view></router-view>
  </div>
  <!--end::Wrapper-->
  <!--end::Authentication Layout -->
</template>

<script>
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'auth-layout',
  components: {},
  setup() {
    onMounted(() => {})
  }
})
</script>
<style lang="scss"></style>
