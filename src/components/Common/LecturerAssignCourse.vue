<script setup>
import { ref, watch, defineEmits } from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import ButtonUI from '../UI/ButtonUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';

const emit = defineEmits(['assignLecturer'])

const courses = ref(['none','one','two','three','four'])
const lecturers = ref(['none','one','two','three','four'])

</script>

<template>
  <div class="flex flex-col gap-2 w-[50%] border-r-2 border-greenSoft pr-2">
    <WordsUI word-class="Course Assignment"/>
    <DropdownUI :options="courses"/>
    <WordsUI word-class="Assign For"/>
    <DropdownUI :options="lecturers"/>
    <WordsUI word-class="(Course assign will be reseted after semester ends)"/>
    <div class="flex justify-end">
      <ButtonUI word-class="Assign" width-class="min-w-auto w-[25%]" @update:word-class="emit('assignLecturer')"/>
    </div>
  </div>

</template>

<style scoped>

</style>
