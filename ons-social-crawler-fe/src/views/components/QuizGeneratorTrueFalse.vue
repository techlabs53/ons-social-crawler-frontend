<script setup>
import { ref, computed, defineProps } from 'vue'
import global from '../../core/helpers/functions.js'

const { decodeHtml, translate } = global()
const props = defineProps(['index', 'quiz'])
const index = computed(() => props.index)
const quiz = computed(() => props.quiz)
const hasAnswered = ref(false)
const right = ref(false)

const formatDimensions = (categories) => {
  const categoryKeys = Object.keys(categories).filter(key => categories[key] !== 0);
  const translatedCategories = categoryKeys.map(key => translate('categories', key));
  return translatedCategories.join(', ');
}

const checkAnswer = (value) => {
  hasAnswered.value = true
  //console.log('Quiz Object:', quiz)
  if (value == quiz.value.hasHate) {
    right.value = true
  } else {
    right.value = false
  }
}
</script>

<template>
  <div class="quiz-title-container">
    <span class="quiz-round-number">{{ index }}</span>
    <span>Vero o Falso</span>
    <svg
      v-if="hasAnswered && right"
      xmlns="http://www.w3.org/2000/svg"
      height="30"
      width="30"
      fill="turquoise"
      viewBox="0 0 512 512"
    >
      <path
        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
      />
    </svg>
    <svg
      v-if="hasAnswered && !right"
      xmlns="http://www.w3.org/2000/svg"
      height="30"
      width="30"
      fill="tomato"
      viewBox="0 0 512 512"
    >
      <path
        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
      />
    </svg>
  </div>
  <p>"{{ decodeHtml(quiz.description) }}"</p>
  <b>Il seguente messaggio contiene aggressività fisica, verbale, discriminazione e/o linguaggio volgare:</b>
  <div class="row mt-2">
    <div class="col-12 col-md-6">
      <button
        class="quiz-answer-button"
        :class="{
          right: hasAnswered && quiz.hasHate,
          wrong: hasAnswered && !quiz.hasHate
        }"
        @click="checkAnswer(true)"
        :disabled="hasAnswered"
      >
        Vero
      </button>
    </div>
    <div class="col-12 col-md-6">
      <button
        class="quiz-answer-button"
        :class="{
          right: hasAnswered && !quiz.hasHate,
          wrong: hasAnswered && quiz.hasHate
        }"
        @click="checkAnswer(false)"
        :disabled="hasAnswered"
      >
        Falso
      </button>
    </div>
    <div class="row mt-2">
      <div class="col-12">
        <div v-if="hasAnswered && quiz.hasHate" class="answer-details">
          <p><strong>{{ right ? 'Corretto!' : 'Sbagliato! Risposta corretta: Vero' }}</strong></p>
          <p>
            <strong>Parole chiave trovate:</strong> {{ quiz.tokens }}<br>
            <strong>Dimensioni: </strong>{{ formatDimensions(quiz.dimensions) }}<br>
            <strong>Grado:</strong> {{ quiz.grade }}<br>
            <strong>Similarità:</strong> {{ quiz.similarity }}<br>
            <strong>Risposta:</strong> {{ quiz.answer !== 'miss' ? quiz.answer : 'Dati insufficienti per elaborare una risposta' }}
          </p>
        </div>
        <div v-if="hasAnswered && !quiz.hasHate" class="answer-details">
          <p><strong>{{ right ? 'Corretto!' : 'Sbagliato! Risposta corretta: Falso' }}</strong></p>
          <p>Non sono state trovate parole chiave o similarità con altri contenuti.</p>
        </div>
      </div>
    </div>
  </div>
  <hr />
</template>

<style scoped>
.answer-details {
  border-color: green;
  border-style: dashed;
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
}

.quiz-title-container {
  display: flex;
  gap: 10px;
  align-items: center;
}
.quiz-round-number {
  height: 25px;
  width: 25px;
  background-color: #005b9c;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
  color: white;
}
.quiz-answer-button {
  width: 100%;
  border: 2px solid lightgray;
  background-color: lightgray;
  border-radius: 8px;
  padding: 8px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
}

.quiz-answer-button:hover {
  border: 2px solid #005b9c;
  background-color: #005b9c;
  color: white;
}

.quiz-answer-button.right {
  border: 2px solid turquoise;
  background-color: turquoise;
  color: white;
}
.quiz-answer-button.wrong {
  border: 2px solid tomato;
  background-color: tomato;
  color: white;
}
.quiz-answer-button.wrong:disabled {
  opacity: 0.2;
}
</style>
