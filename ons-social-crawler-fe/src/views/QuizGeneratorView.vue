<script setup>
import { useRoute } from 'vue-router'
import ApiService from '../core/services/ApiService'
import FileSaver from 'file-saver'
import { onMounted, ref } from 'vue'
import alert from '@/core/helpers/alert'
import { useLoadingStore } from '@/stores/loading'
import { computed } from 'vue'
import QuizGeneratorTrueFalse from './components/QuizGeneratorTrueFalse.vue'
import QuizGeneratorAnswer from './components/QuizGeneratorAnswer.vue'
import QuizGeneratorCategories from './components/QuizGeneratorCategories.vue'
import axios from 'axios'
import { isArray } from '@vue/shared'
import { useAuthStore } from '../stores/auth'

const loading = useLoadingStore()
const authStore = useAuthStore()
const route = useRoute()
const { dangerAlert, operationConfirm } = alert()

const quizType = ref(0)
const quizQta = ref(1)
const createdQuiz = ref([])

const init = async () => {
  loading.show()
  try {
    quizType.value = 0
    quizQta.value = 1
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

// TODO: could be global
const hasAccess = (roles) => {
  return !isArray(roles) ? false : roles.some((x) => authStore.userRoles.includes(x))
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToNewQuiz = () => {
  setTimeout(() => {
    const firstNewQuizIndex = createdQuiz.value.length - quizQta.value + 1;
    const newQuizElement = document.getElementById(`quiz_${firstNewQuizIndex}`);
    if (newQuizElement) {
      newQuizElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.log("New quiz element not found.");
    }
  }, 500); // delay needed because of operationConfirm()
};

const selecteQuizType = (type) => {
  quizType.value = type
}

const generateQuiz = async () => {
  loading.show()
  try {
    for (let i = 0; i < quizQta.value; i++) {
      const data = {
        type: quizType.value
      }
      const res = await ApiService.post('/quiz', data)
      const quiz = res.data
      createdQuiz.value.push(quiz)
    }
    operationConfirm().then(scrollToNewQuiz);
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

const generateRandomQuiz = async () => {
  loading.show()
  try {
    for (let i = 0; i < quizQta.value; i++) {
      const type = Math.floor(Math.random() * 3) + 1
      const data = {
        type
      }
      const res = await ApiService.post('/quiz', data)
      const quiz = res.data
      createdQuiz.value.push(quiz)
    }
    operationConfirm().then(scrollToNewQuiz);
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

const exportQuiz = async () => {
  loading.show()
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}quiz/export`,
      {
        quiz: createdQuiz.value
      },
      {
        responseType: 'blob'
      }
    )
    handleDownload(response)
  } catch (e) {
    dangerAlert(e)
  } finally {
    loading.hide()
  }
}

const handleDownload = (response) => {
  try {
    const filename = `quiz_${Date.now()}.xlsx`

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    FileSaver.saveAs(blob, filename)
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await init()
})

const existCreatedQuiz = computed(() => createdQuiz.value.length > 0)
</script>
<template>
  <main class="page-container settings-view">
    <div class="page-title">
      <h1>
        <span class="title-icon custom-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M192 104.8c0-9.2-5.8-17.3-13.2-22.8C167.2 73.3 160 61.3 160 48c0-26.5 28.7-48 64-48s64 21.5 64 48c0 13.3-7.2 25.3-18.8 34c-7.4 5.5-13.2 13.6-13.2 22.8c0 12.8 10.4 23.2 23.2 23.2H336c26.5 0 48 21.5 48 48v56.8c0 12.8 10.4 23.2 23.2 23.2c9.2 0 17.3-5.8 22.8-13.2c8.7-11.6 20.7-18.8 34-18.8c26.5 0 48 28.7 48 64s-21.5 64-48 64c-13.3 0-25.3-7.2-34-18.8c-5.5-7.4-13.6-13.2-22.8-13.2c-12.8 0-23.2 10.4-23.2 23.2V464c0 26.5-21.5 48-48 48H279.2c-12.8 0-23.2-10.4-23.2-23.2c0-9.2 5.8-17.3 13.2-22.8c11.6-8.7 18.8-20.7 18.8-34c0-26.5-28.7-48-64-48s-64 21.5-64 48c0 13.3 7.2 25.3 18.8 34c7.4 5.5 13.2 13.6 13.2 22.8c0 12.8-10.4 23.2-23.2 23.2H48c-26.5 0-48-21.5-48-48V343.2C0 330.4 10.4 320 23.2 320c9.2 0 17.3 5.8 22.8 13.2C54.7 344.8 66.7 352 80 352c26.5 0 48-28.7 48-64s-21.5-64-48-64c-13.3 0-25.3 7.2-34 18.8C40.5 250.2 32.4 256 23.2 256C10.4 256 0 245.6 0 232.8V176c0-26.5 21.5-48 48-48H168.8c12.8 0 23.2-10.4 23.2-23.2z"
            />
          </svg>
        </span>
        {{ route?.meta?.label }}
      </h1>
    </div>

    <div class="page-content">
      <h3>Scegli la tipologia di quiz</h3>
      <div class="row">
        <div class="col-12 col-md-4">
          <button
            class="choose-type-quiz-button"
            :class="{ select: quizType === 1 }"
            @click="selecteQuizType(1)"
          >
            Vero o Falso
          </button>
        </div>
        <div class="col-12 col-md-4">
          <button
            class="choose-type-quiz-button"
            :class="{ select: quizType === 2 }"
            @click="selecteQuizType(2)"
          >
            Risposta a frase
          </button>
        </div>
        <div class="col-12 col-md-4">
          <button
            class="choose-type-quiz-button"
            :class="{ select: quizType === 3 }"
            @click="selecteQuizType(3)"
          >
            Scelta categoria
          </button>
        </div>
      </div>
      <h3>Genera quiz</h3>
      <div class="row">
        <div class="col-12 col-md-4">
          <input v-model="quizQta" type="number" class="generator-quiz-number" min="1" max="10" />
        </div>
        <div class="col-12 col-md-4">
          <button class="generator-quiz-button" :disabled="quizType === 0" @click="generateQuiz">
            Genera
          </button>
        </div>
        <div class="col-12 col-md-4">
          <button class="generator-quiz-button" @click="generateRandomQuiz">Genera random</button>
        </div>
      </div>

      <template v-if="existCreatedQuiz">
        <hr />
        <div class="row">
          <div class="col-12 col-md-8">
            <h3>Quiz Generati</h3>
          </div>
          <div class="col-12 col-md-4">
            <button v-if="hasAccess(['Admin', 'Teacher'])" class="generator-quiz-export" @click="exportQuiz">
              <!-- :disabled="true"
              style="opacity: 0.3" -->
              Esporta Excel
            </button>
          </div>
        </div>
        <div class="row">
          <div v-for="(q, index) in createdQuiz" :key="q.id" class="col-12" :id="'quiz_' + (index + 1)">
            <QuizGeneratorTrueFalse
              v-if="q.type === 1"
              :index="index + 1"
              :quiz="q"
            ></QuizGeneratorTrueFalse>
            <QuizGeneratorAnswer
              v-else-if="q.type === 2"
              :index="index + 1"
              :quiz="q"
            ></QuizGeneratorAnswer>
            <QuizGeneratorCategories
              v-else-if="q.type === 3"
              :index="index + 1"
              :quiz="q"
            ></QuizGeneratorCategories>
          </div>
        </div>
        <div class="row justify-content-end">
          <div class="col-12 col-md-4">
            <button @click="scrollToTop" class="generator-quiz-button">Torna su</button>
          </div>
        </div>
      </template>
    </div>
  </main>
  
</template>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.choose-type-quiz-button {
  width: 100%;
  border: 2px solid lightgray;
  background-color: lightgray;
  border-radius: 8px;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
}

.choose-type-quiz-button:hover {
  border: 2px solid #005b9c;
}

.choose-type-quiz-button.select {
  border: 2px solid #005b9c;
  background-color: #005b9c;
  color: white;
}

.generator-quiz-button {
  width: 100%;
  border: 2px solid #005b9c;
  background-color: #005b9c;
  border-radius: 8px;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  color: white;
}

.generator-quiz-export {
  width: 100%;
  border: 2px solid #33c481;
  background-color: #33c481;
  border-radius: 8px;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  color: white;
}

.generator-quiz-button:disabled {
  width: 100%;
  border: 2px solid #005b9c;
  background-color: #005b9c;
  border-radius: 8px;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  color: white;
  opacity: 0.5;
}

.generator-quiz-number {
  width: 100%;
  border-radius: 8px;
  height: 100%;
  padding: 20px;
}
</style>
