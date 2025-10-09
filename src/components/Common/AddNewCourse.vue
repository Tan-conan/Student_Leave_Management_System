<script setup>
import { ref, watch, defineEmits, defineProps} from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import ButtonUI from '../UI/ButtonUI.vue';

const props = defineProps({
 newCourseName:{type:String, default: ''},
 newCourseCode:{type:String, default: ''}
});

const emit = defineEmits(['createCourse','update:newCourseName','update:newCourseCode'])

</script>

<template>
  <div class="flex flex-col gap-2 w-[50%] h-full border-r-2 border-greenSoft pr-2">
    <WordsUI word-class="Add New Course"/>
    <div class="flex gap-2">
        <WordsUI word-class="Course Name:"/>
        <InputUI width-class="flex-1" :input-value="newCourseName" @update:input-value="val => emit('update:newCourseName',val)"/>
    </div>
    <div class="flex gap-2">
        <WordsUI word-class="Course Code :"/>
        <InputUI width-class="flex-1" :input-value="newCourseCode" @update:input-value="val => emit('update:newCourseCode',val)"/>
    </div>
    <div class="flex-1"></div>
    <div class="flex justify-end">
      <ButtonUI word-class="Create" width-class="min-w-auto w-[25%]" @update:word-class="emit('createCourse')"/>
    </div>
  </div>

</template>

<style scoped>

</style>
