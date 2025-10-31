<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';
import ModalUI from '../UI/ModalUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import ModalCloseUI from '../UI/ModalCloseUI.vue';
import InputUI from '../UI/InputUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';

const props = defineProps({
  courseName:{type:String, default: ''},
  courseCode:{type:String, default: ''},
  courseLecturer:{type:String, default: ''},
  userSessionStatus:{type:String, default: ''},
  lecturerNameList:{type:Array, default:[]},
  userMenuModalVisible:{type:Boolean, default:false},
});

watch(
  () => props.userMenuModalVisible,
  (newVal) => {
    if (newVal) {
      console.log('courseLecturer:', props.courseLecturer)
      console.log('lecturerNameList:', props.lecturerNameList)
      console.log('typeof first element:', typeof props.lecturerNameList[0])
    }
  }
)

const emit = defineEmits(['update:userMenuModalVisible','delete','save','update:courseLecturer',
'update:courseName','update:courseCode'])

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
            <InputUI :input-value="`${courseName}`" width-class="w-[500px]" 
             @update:input-value="val => emit('update:courseName',val)"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Course Code:"/>
            <InputUI :input-value="`${courseCode}`" width-class="flex-1" 
             @update:input-value="val => emit('update:courseCode',val)"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Course Lecturer:"/>
            <DropdownUI v-if="userSessionStatus === 'unactivated'" :dropdown-value="`${courseLecturer}`" :options="lecturerNameList" width-class="flex-1"
             @update:dropdown-value="val => emit('update:courseLecturer', val)"/>
             <WordsUI v-else :word-class="courseLecturer"/>
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