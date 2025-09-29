<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';
import ModalUI from '../UI/ModalUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import ModalCloseUI from '../UI/ModalCloseUI.vue';
import InputUI from '../UI/InputUI.vue';

const props = defineProps({
  courseName:{type:String, default: ''},
  courseCode:{type:String, default: ''},
  courseLecturer:{type:String, default: ''},
  userMenuModalVisible:{type:Boolean, default:false},
});

const emit = defineEmits(['update:userMenuModalVisible','delete','save'])

function MenuClosing(){
    emit('update:userMenuModalVisible',false)
}

function deleting(){
    emit('delete')
}

function saving(){
    emit('save')
}

</script>

<template>

    <!--pending information modal-->
  <ModalUI name="course information" :visible="userMenuModalVisible" width-class="w-auto" height-class="h-auto">
    <div class="flex gap-2">
        <ModalCloseUI @close-modal="MenuClosing"/>
        <WordsUI word-class="Course Information"/>
    </div>

    <div class="flex  flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        <div class="flex gap-2">
            <WordsUI word-class="Course Name:"/>
            <InputUI :input-value="`${courseName}`" width-class="w-[500px]"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Course Code:"/>
            <InputUI :input-value="`${courseCode}`" width-class="flex-1"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Course Lecturer:"/>
            <InputUI :input-value="`${courseLecturer}`" width-class="flex-1"/>
        </div>
        
    </div>

    <div class="h-2"></div>

    <div class="flex gap-2 justify-end">
        <ButtonUI word-class="Delete" @update:word-class="deleting"/>
        <ButtonUI word-class="Save" @update:word-class="saving"/>
    </div>

  </ModalUI>

</template>
<style>
</style>