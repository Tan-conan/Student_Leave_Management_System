<script setup>
import { defineEmits, defineProps} from 'vue'
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
  <div class="flex flex-col gap-2 h-full border-greenSoft pr-2">

    <!--title-->
    <div class="small-card"><WordsUI word-class="ADD NEW COURSE" text-color-class="text-cream" word-bold-class="font-black" wordsize-class="text-[35px]" /></div>
    
    <!--course name field-->
    <div class="flex gap-2">
        <WordsUI word-class="Course Name:" text-color-class="text-wordSubTitle"/>
        <InputUI width-class="flex-1" :input-value="newCourseName" @update:input-value="val => emit('update:newCourseName',val)"/>
    </div>

    <!--course code field-->
    <div class="flex gap-2">
        <WordsUI word-class="Course Code :" text-color-class="text-wordSubTitle"/>
        <InputUI width-class="flex-1" :input-value="newCourseCode" @update:input-value="val => emit('update:newCourseCode',val)"/>
    </div>
    <div class="flex-1"></div>

    <!--course create button-->
    <div class="flex justify-end">
      <ButtonUI word-class="Create" width-class="min-w-auto w-[25%]" @update:word-class="emit('createCourse')"/>
    </div>
  </div>

</template>

<style scoped>

</style>
