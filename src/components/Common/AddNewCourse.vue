<script setup>
import { ref, watch, defineEmits} from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import ButtonUI from '../UI/ButtonUI.vue';

const emit = defineEmits(['createCourse'])

</script>

<template>
  <div class="flex flex-col gap-2 w-[50%] h-full border-r-2 border-greenSoft pr-2">
    <WordsUI word-class="Add New Course"/>
    <div class="flex gap-2">
        <WordsUI word-class="Course Name:"/>
        <InputUI width-class="flex-1"/>
    </div>
    <div class="flex gap-2">
        <WordsUI word-class="Course Code :"/>
        <InputUI width-class="flex-1"/>
    </div>
    <div class="flex-1"></div>
    <div class="flex justify-end">
      <ButtonUI word-class="Create" width-class="min-w-auto w-[25%]" @update:word-class="emit('createCourse')"/>
    </div>
  </div>

</template>

<style scoped>

</style>
