<template>
  <!--begin::App-->
  <div class="wrapper">
    <SideBar />
    <div class="drawer">
      <Header />
      <div class="page">
        <RouterView />
      </div>
      <FooterComponent />
    </div>
  </div>
  <!--end::App-->

  <!--  <KTScrollTop />-->
  <!--  <KTModals />-->
</template>

<script>
import { defineComponent, nextTick, onBeforeMount, onMounted, watch } from 'vue'

import Header from '@/components/HeaderComponent.vue'
import SideBar from '@/components/SideBar.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import LoginView from '@/views/LoginView.vue'

export default defineComponent({
  name: 'default-layout',
  components: {
    Header,
    SideBar,
    FooterComponent,
    LoginView
  },
  setup() {}
})
</script>
