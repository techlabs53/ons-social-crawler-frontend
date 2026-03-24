<script>
export default {
  name: 'streams-settings'
}
</script>
<script setup>
import { onMounted, ref } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import alert from '@/core/helpers/alert'
import StreamSwitch from '@/views/components/StreamSwitch.vue'
import ApiService from '@/core/services/ApiService'

const loading = useLoadingStore()
const { operationConfirm, dangerAlert } = alert()
const statusData = ref({})

const formData = ref({})
formData.value.youTubeStatus = false
formData.value.twitterStatus = false
formData.value.twitchStatus = false
formData.value.youTubeRecordLength = 0
formData.value.twitterRecordLength = 0
formData.value.twitchRecordLength = 0

const minStreamNumber = 250
const maxStreamNumber = 2500
const stepStreamNumber = 250

const onUpdate = () => {
  loading.show()
  try {
    ApiService.put(`/stream/status`, formData.value)
    operationConfirm()
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

const onUpdateStream = (stream, active = null) => {
  // todo: rinominare in onSubmit
  const key = stream + 'Status'
  formData.value[key] = active.active
}

const init = async () => {
  try {
    const tempStreamsStatus = await ApiService.get('/stream/status')
    statusData.value = tempStreamsStatus?.data ?? {}

    formData.value.youTubeStatus = statusData.value?.youTubeFlag ?? false
    formData.value.twitterStatus = statusData.value?.twitterFlag ?? false
    formData.value.twitchStatus = statusData.value?.twitchFlag ?? false

    let fallBackNumber = 250
    formData.value.youTubeRecordLength = statusData.value?.youTubeLength ?? fallBackNumber
    formData.value.twitterRecordLength = statusData.value?.twitterLength ?? fallBackNumber
    formData.value.twitchRecordLength = statusData.value?.twitchLength ?? fallBackNumber
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

onMounted(async () => {
  await init()
})

const btnMessage = ref('')
</script>
<template>
  <div class="streams-container streams-settings">
    <div class="streams-description">
      <h4></h4>
    </div>
    <div class="streams-controls">
      <!--      <form @submit.prevent="onUpdate"> {{formData.twitchRecordLength}} {{formData.twitchStatus}}-->
      <div class="streams-controls__inputs">
        <div class="stream-control__container">
          <h4><i class="title-icon fa-brands fa-youtube"></i> YouTube</h4>
          <StreamSwitch
            label="Aggiornamento"
            label-icon=""
            name="youTube"
            :disabled="false"
            :btn-message="btnMessage"
            @on-update="onUpdateStream"
            :isActive="formData.youTubeStatus"
          />
          <div class="stream-record-number">
            <label for="youTube-record-number" class="stream-record-number__label"
              >Q.tà commenti</label
            >
            <input
              id="youTube-record-number"
              name="youTube"
              class="stream-record-number__input"
              type="number"
              :min="minStreamNumber"
              :max="maxStreamNumber"
              :step="stepStreamNumber"
              placeholder="250"
              v-model="formData.youTubeRecordLength"
            />
          </div>
        </div>

        <div class="stream-control__container">
          <h4><i class="title-icon fa-brands fa-twitch"></i> Twitch</h4>
          <StreamSwitch
            label="Aggiornamento"
            label-icon=""
            name="twitch"
            :disabled="false"
            :btn-message="btnMessage"
            @on-update="onUpdateStream"
            :isActive="formData.twitchStatus"
          />
          <div class="stream-record-number">
            <label for="twitch-record-number" class="stream-record-number__label"
              >Q.tà commenti</label
            >
            <input
              id="twitch-record-number"
              name="twitch"
              class="stream-record-number__input"
              type="number"
              :min="minStreamNumber"
              :max="maxStreamNumber"
              :step="stepStreamNumber"
              placeholder="250"
              v-model="formData.twitchRecordLength"
            />
          </div>
        </div>

        <div class="stream-control__container">
          <h4><i class="title-icon fa-brands fa-x-twitter"></i> Twitter</h4>
          <StreamSwitch
            label="Aggiornamento"
            label-icon=""
            name="twitter"
            :disabled="false"
            :btn-message="btnMessage"
            @on-update="onUpdateStream"
            :isActive="formData.twitterStatus"
          />
          <div class="stream-record-number">
            <label for="twitter-record-number" class="stream-record-number__label"
              >Q.tà commenti</label
            >
            <input
              id="twitter-record-number"
              name="twitter"
              class="stream-record-number__input"
              type="number"
              :min="minStreamNumber"
              :max="maxStreamNumber"
              :step="stepStreamNumber"
              placeholder="250"
              v-model="formData.twitterRecordLength"
            />
          </div>
        </div>
      </div>

      <div class="streams-control__actions">
        <button @click="onUpdate" class="btn btn-primary">Invia</button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.streams-settings p {
  margin: 0;
}

.streams-settings {
  .stream-record-number {
  }
}

.streams-settings {
  width: 100%;
  padding: 1rem;
  position: relative;
  overflow: hidden;

  .streams-description,
  .streams-message {
  }

  .streams-description {
    p {
      font-weight: 400;
    }
  }

  .streams-controls {
    .streams-controls__inputs {
      display: flex;
      justify-content: space-around;
      flex-direction: row;
      column-gap: 3rem;
      row-gap: 5rem;
      padding-top: 2rem;
      padding-bottom: 2.7rem;
      flex-wrap: wrap;

      .stream-control__container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        min-width: fit-content;

        .stream-record-number {
          text-align: right;

          .stream-record-number__label {
            font-weight: 400;
            font-size: 1rem;
            line-height: 1.2rem;
            margin-right: 1rem;
          }

          .stream-record-number__input {
            border-radius: 4px;
            border: 1px solid lightgrey;
            padding: 0.15rem 0rem 0.15rem 0.5rem;
          }

          input[type='number'] {
          }

          input[type='number']::-webkit-inner-spin-button,
          input[type='number']::-webkit-outer-spin-button {
            opacity: 1;
            cursor: pointer;
          }
        }
      }
    }

    .streams-control__actions {
      display: flex;
      justify-content: flex-end;

      button {
        border-radius: 4px;
        border: none;
      }
    }
  }

  .streams-message {
    $stream-message--transition-time: 0.25s;
    display: inline-block;
    width: 100%;
    background-color: red;
    border-radius: 0 0 4px 4px;
    padding: 0.5rem 1.25rem;
    color: white;

    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 150%);
    transition: transform $stream-message--transition-time;

    &.streams-message--visible {
      transform: translate(-50%, 0%);
      transition: transform $stream-message--transition-time;
    }

    p {
      margin-bottom: 0;
      font-weight: 600;
      overflow-x: auto;
      width: 100%;
      white-space: nowrap;
    }
  }

  @media screen and (max-width: 992px) {
    .stream-control__container {
    }
  }
}
</style>
