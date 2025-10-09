<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import ButtonUI from '../UI/ButtonUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';

const props = defineProps({
 coursesList:{type:Array, default: []},
 selectedCourse:{type:String, default: ''},
 lecturersList:{type:Array, default: []},
 selectedLecturer:{type:String, default: ''},
});

const emit = defineEmits(['assignLecturer','update:selectedCourse','update:selectedLecturer'])

</script>

<template>
  <div class="flex flex-col gap-2 w-[50%] border-r-2 border-greenSoft pr-2">
    <WordsUI word-class="Course Assignment"/>
    <DropdownUI :options="coursesList" :dropdown-value="selectedCourse" @update:dropdown-value="val => emit('update:selectedCourse',val)"/>
    <WordsUI word-class="Assign For"/>
    <DropdownUI :options="lecturersList" :dropdown-value="selectedLecturer" @update:dropdown-value="val => emit('update:selectedLecturer',val)"/>
    <WordsUI word-class="(Course assign will be reseted after semester ends)"/>
    <div class="flex justify-end">
      <ButtonUI word-class="Assign" width-class="min-w-auto w-[25%]" @update:word-class="emit('assignLecturer')"/>
    </div>
  </div>

</template>

<style scoped>

</style>
