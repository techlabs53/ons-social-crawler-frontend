<script setup>
import { ref, computed, defineProps } from 'vue'
import global from '../../core/helpers/functions.js'

const { decodeHtml, translate } = global()
const props = defineProps(['index', 'quiz'])
const index = computed(() => props.index)
const quiz = computed(() => props.quiz)
const hasAnswered = ref(false)
const revealAnswer = ref(false) // set true to debug quiz logic
const right = ref({
  aggr_phys: false,
  aggr_verb: false,
  discr: false,
  incivility: false
})
const selectedCategories = ref({
  aggr_phys: false,
  aggr_verb: false,
  discr: false,
  incivility: false
})

const checkCorrect = (value) => {
  if (quiz.value.dimensions) {
    return quiz.value.dimensions[value] > 0
  }

  return false
}

const isAnyCategorySelected = computed(() => {
  return Object.values(selectedCategories.value).some(category => category);
});

const isAllCategoriesCorrect = computed(() => {
  return checkCategoriesCorrectness();
});

const checkCategoriesCorrectness = () => {
  hasAnswered.value = true
  return Object.keys(selectedCategories.value).every(category => {
    const check = checkCorrect(category)
    return selectedCategories.value[category] ? check : !check
  });
};
</script>

<template>
  <div class="quiz-title-container">
    <span class="quiz-round-number">{{ index }}</span>
    <span>Scelta Categoria</span>
    <svg
      v-if="hasAnswered && isAllCategoriesCorrect"
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
      v-else-if="hasAnswered && !isAllCategoriesCorrect"
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
  <div><b>Il seguente messaggio contiene una o più categorie di attenzione:</b></div>
  <p>"{{ decodeHtml(quiz.description) }}"</p>
  <b>Quali categorie assoceresti?</b>
  <div class="row mt-2 gy-2">
    <div class="col-12 col-md-6">
      <button
        class="quiz-answer-button"
        :class="{
          right: hasAnswered && checkCorrect('aggr_phys'),
          wrong: hasAnswered && !checkCorrect('aggr_phys'),
          select: selectedCategories.aggr_phys
        }"
        @click="selectedCategories.aggr_phys = !selectedCategories.aggr_phys"
        :disabled="hasAnswered"
      >
        {{ translate('categories', 'aggr_phys') }} {{ revealAnswer ? checkCorrect('aggr_phys') ? '✅' : '❌' : ""}}
      </button>
    </div>
    <div class="col-12 col-md-6">
      <button
        class="quiz-answer-button"
        :class="{
          right: hasAnswered && checkCorrect('aggr_verb'),
          wrong: hasAnswered && !checkCorrect('aggr_verb'),
          select: selectedCategories.aggr_verb
        }"
        @click="selectedCategories.aggr_verb = !selectedCategories.aggr_verb"
        :disabled="hasAnswered"
      >
        {{ translate('categories', 'aggr_verb') }} {{ revealAnswer ? checkCorrect('aggr_verb') ? '✅' : '❌' : ""}}
      </button>
    </div>
    <div class="col-12 col-md-6">
      <button
        class="quiz-answer-button"
        :class="{
          right: hasAnswered && checkCorrect('discr'),
          wrong: hasAnswered && !checkCorrect('discr'),
          select: selectedCategories.discr
        }"
        @click="selectedCategories.discr = !selectedCategories.discr"
        :disabled="hasAnswered"
      >
        {{ translate('categories', 'discr') }} {{ revealAnswer ? checkCorrect('discr') ? '✅' : '❌' : ""}}
      </button>
    </div>
    <div class="col-12 col-md-6">
      <button
        class="quiz-answer-button"
        :class="{
          right: hasAnswered && checkCorrect('incivility'),
          wrong: hasAnswered && !checkCorrect('incivility'),
          select: selectedCategories.incivility
        }"
        @click="selectedCategories.incivility = !selectedCategories.incivility"
        :disabled="hasAnswered"
      >
        {{ translate('categories', 'incivility') }} {{ revealAnswer ? checkCorrect('incivility') ? '✅' : '❌' : ""}}
      </button>
    </div>
  </div>
  <div class="row mt-4">
    <div class="col-12">
      <button class="quiz-answer-check-button" 
      @click="checkCategoriesCorrectness"
      :disabled="!isAnyCategorySelected"
      >Verifica
    </button>
    </div>
  </div>
  <div class="row mt-2">
    <div class="col-12">
      <div v-if="hasAnswered" class="answer-details">
        <p><strong>{{ isAllCategoriesCorrect ? 'Corretto!' : 'Sbagliato!' }}</strong></p>
        <p>
          <strong>Parole chiave trovate:</strong> {{ quiz.tokens }}<br>
          <strong>Grado:</strong> {{ quiz.grade }}<br>
          <strong>Similarità:</strong> {{ quiz.similarity }}<br>
          <strong>Risposta:</strong> {{ quiz.answer !== 'miss' ? quiz.answer : 'Dati insufficienti per elaborare una risposta' }}
        </p>
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
  font-size: 16px;
  height: 100%;
}

.quiz-answer-button:hover {
  border: 2px solid #005b9c;
  background-color: #005b9c;
  color: white;
}

.quiz-answer-check-button {
  width: 100%;
  border: 2px solid #005b9c;
  background-color: #005b9c;
  border-radius: 8px;
  padding: 8px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  height: 100%;
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
.quiz-answer-button.select {
  border: 2px solid #005b9c;
  background-color: #005b9c;
  color: white;
}
.quiz-answer-check-button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>
