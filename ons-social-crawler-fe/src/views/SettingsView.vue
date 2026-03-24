<script setup>
import { useRoute } from 'vue-router'
import ApiService from '../core/services/ApiService'
import { onMounted, ref } from 'vue'
import DigiTable from '@/components/kt-datatable/DigiTable.vue'

import ModalUserEdit from '@/components/modals/ModalUserEdit.vue'
import alert from '@/core/helpers/alert'
import { showModal } from '@/core/helpers/dom'
import { isArray } from '@vue/shared'
import { useI18n } from 'vue-i18n'
import { useLoadingStore } from '@/stores/loading'
import FiltersToolbar from '@/views/components/FiltersToolbar.vue'
import StreamsSettings from '@/views/components/StreamsSettings.vue'
import Editor from '@tinymce/tinymce-vue'

const loading = useLoadingStore()
const { t } = useI18n()
const route = useRoute()
const data = ref([])
const howItWorks = ref('')
const selectedId = ref('')
const page = ref(1)
const total = ref(0)

const changePage = (newPage) => {
  page.value = newPage
}

const init = async () => {
  loading.show()
  try {
    selectedId.value = ''
    const res = await ApiService.get('/auth/')
    data.value = res.data.users ?? []
    total.value = res.data.users.length
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

const onEditorReady = async (editor) => {
  loading.show()
  try {
    const resHowItWorks = await ApiService.get('/howitworks')
    howItWorks.value = resHowItWorks.data.howItWorks || ''
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

const saveEditor = async () => {
  loading.show()
  try {
    const data = {
      text: howItWorks.value
    }
    await ApiService.put('/howitworks', data)
    operationConfirm()
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

const searchedFields = ['email', 'displayName']
const search = ref('')
const headerConfig = ref([
  {
    columnName: '',
    columnLabel: 'actions',
    sortEnabled: false
  },
  {
    columnName: 'E-mail',
    columnLabel: 'email',
    sortEnabled: true
  },
  {
    columnName: 'Nome',
    columnLabel: 'displayName',
    sortEnabled: true
  },
  {
    columnName: 'Ruoli',
    columnLabel: 'customClaims',
    sortEnabled: false
  }
])
const { operationConfirm, warningAlert, dangerAlert } = alert()

const getRoles = (roles) => {
  return isArray(roles) ? roles.join(', ') : ''
}

const openItem = (uid, modal) => {
  selectedId.value = uid
  setTimeout(() => {
    showModal(modal)
  }, 100)
}

const deleteItem = async (uid) => {
  warningAlert(t('common.confirmMessage')).then(async (res) => {
    if (res.isConfirmed) {
      loading.show()
      try {
        const data = {
          uid
        }
        await ApiService.delete('/auth/', data)
        operationConfirm()
      } catch (e) {
        dangerAlert(e)
      } finally {
        loading.hide()
        await init()
      }
    }
  })
}

const onSearch = (newValue) => {
  search.value = newValue
}

onMounted(async () => {
  await init()
})
</script>
<template>
  <main class="page-container settings-view">
    <div class="page-title">
      <h1>
        <span class="title-icon custom-gear">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
            />
          </svg>
        </span>
        {{ route?.meta?.label }}
      </h1>
    </div>

    <div class="page-content">
      <section class="section streams-actions">
        <h2 class="section-title">Servizi</h2>
        <div class="section-content">
          <StreamsSettings />
        </div>
      </section>
      <hr />
      <section class="section users-info">
        <h2 class="section-title">Utenti</h2>

        <div class="row pb-3">
          <div class="col-6">
            <!-- <FiltersToolbar
              @on-search="onSearch"
              :prediction-filter="false"
              :range-filter="false"
            /> -->
          </div>
          <div class="col-6 text-end">
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_user_edit"
            >
              Aggiungi Utente
            </button>
          </div>
        </div>

        <DigiTable
          :data="data"
          :header="headerConfig"
          :searched-fields="searchedFields"
          :search="search"
          :cPage="page"
          :total="total"
          @page-change="changePage"
        >
          <template v-slot:actions="{ row: row }">
            <div class="d-flex gap-3">
              <a href="#" @click="openItem(row.uid, 'kt_modal_user_edit')"
                ><i class="fa-solid fa-pen-to-square text-primary fs-5"></i
              ></a>
              <a href="#" @click="deleteItem(row.uid)"
                ><i class="fa-solid fa-trash-can text-primary fs-5"></i
              ></a>
            </div>
          </template>
          <template v-slot:customClaims="{ row: row }">
            {{ getRoles(row?.customClaims?.user) }}
          </template>
        </DigiTable>
      </section>
      <hr />
      <section class="section users-info">
        <h2 class="section-title">Come funziona</h2>
        <Editor
          apiKey="xmk2k73g7ent4rr5i6qgrnma4vzs5gk3h1ispuegt6unb3to"
          :init="{
            toolbar_mode: 'sliding',
            plugins:
              'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount code',
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            language: 'it'
          }"
          @init="onEditorReady"
          v-model="howItWorks"
        />
        <div class="row pt-3">
          <div class="col-12 text-end">
            <button class="btn btn-primary" type="button" @click="saveEditor">Salva</button>
          </div>
        </div>
      </section>
    </div>
  </main>
  <ModalUserEdit :id="selectedId" @close-modal="init"></ModalUserEdit>
</template>
<style lang="scss">
.settings-view {
  .section {
    margin-bottom: 3.2rem;

    &.page-title {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .section-title {
      margin-bottom: 1rem;
    }

    .section-content {
      display: flex;
      gap: 3rem;

      border: 1px solid lightgrey;
      border-radius: 6px;
    }
  }

  @media screen and (max-width: 1400px) {
    .section {
    }
  }

  @media screen and (max-width: 992px) {
    .section {
    }
  }

  @media screen and (max-width: 768px) {
    .section {
    }
  }
}
</style>
