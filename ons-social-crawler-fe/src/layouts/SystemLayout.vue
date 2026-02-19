<template>
  <!--begin::System Layout-->
  <div id="kt_app_root">
    <router-view></router-view>
  </div>
  <!--end::System Layout-->
</template>

<script>
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'system-layout',
  components: {},
  setup() {
    onMounted(() => {})
  }
})
</script>
