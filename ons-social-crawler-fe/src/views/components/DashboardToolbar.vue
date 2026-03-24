<template>
    <div class="dashboard-toolbar">
        <div class="dashboard-element d-flex align-items-center position-relative my-1">
            <DateRange :entries="range" @update:model-value="updateRange" />
        </div>
        <div class="dashboard-element d-flex align-items-center position-relative my-1">
            <SocialFilter  ref="socialFilter" @onSocial="updateSelectedOption" />
        </div>
        <div class="dashboard-element d-flex align-items-center position-relative my-1">
            <button ref="goButton" class="btn btn-primary" style="background-color: var(--primary-color) !important; text-align: start;" @click="navigateToPage">Vai ai contenuti</button>
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs, defineProps, defineExpose, defineEmits, toRaw } from 'vue';
import DateRange from "./DateRange.vue";
import SocialFilter from "./SocialFilter.vue";

const props = defineProps({
  range: Object,
});


const { range } = toRefs(props);

const selectedOption = ref('all');

const socialFilter = ref(null);

const focusSocialFilter = () => {
    socialFilter.value.focus();
}

const emit = defineEmits(["updateRange", "updateSocial", "navigateToPage"]);

const updateRange = (value) => {
    //console.log("updateRange", value)
    emit("updateRange", toRaw(value));
};

const updateSelectedOption = (value) => {
    // console.log("updateSelectedOption", value)
    selectedOption.value = value;
    emit("updateSocial", value)
};

const navigateToPage = () => {
    // console.log("navigateToPage", selectedOption.value)
    emit("navigateToPage", selectedOption.value);
};

defineExpose({
  updateRange,
  updateSelectedOption,
  navigateToPage,
  focusSocialFilter,
});

</script>

<style lang="scss">
.dashboard-toolbar {
  display: flex;
  gap: 2rem;
  .dashboard-element {
    .dashboard-element__label {
      font-size: 1.2rem;
      font-weight: 400;
      display: inline-block;
      padding: 0.5rem;
    }
  }
}
</style>