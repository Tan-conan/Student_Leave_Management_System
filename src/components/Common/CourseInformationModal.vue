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

// watch props value
watch(
  () => props.userMenuModalVisible,
  (newVal) => {
    if (newVal) {
      console.log('courseLecturer:', props.courseLecturer)
      console.log('lecturerNameList:', props.lecturerNameList)
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
    <!--header-->
    <div class="flex gap-2">
        <ModalCloseUI @close-modal="MenuClosing"/>
        <WordsUI word-class="Course Information" text-color-class="text-wordTitle"/>
    </div>

    <div class="flex flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">

      <!--course name-->
        <div class="flex gap-2">
            <WordsUI word-class="Course Name:" text-color-class="text-wordSubTitle"/>
            <InputUI :input-value="`${courseName}`" width-class="w-[500px]" 
             @update:input-value="val => emit('update:courseName',val)"/>
        </div>

        <!--course code-->
        <div class="flex gap-2">
            <WordsUI word-class="Course Code:" text-color-class="text-wordSubTitle"/>
            <InputUI :input-value="`${courseCode}`" width-class="flex-1" 
             @update:input-value="val => emit('update:courseCode',val)"/>
        </div>

        <!--assign lecturer-->
        <div class="flex gap-2">
            <WordsUI word-class="Course Lecturer:" text-color-class="text-wordSubTitle"/>
            <DropdownUI v-if="userSessionStatus === 'unactivated'" :dropdown-value="`${courseLecturer}`" :options="lecturerNameList" width-class="flex-1"
             @update:dropdown-value="val => emit('update:courseLecturer', val)"/>
             <WordsUI v-else :word-class="courseLecturer"/>
        </div>
        
    </div>

    <div class="h-2"></div>

    <!--button-->
    <div class="flex gap-2 justify-end">
        <ButtonUI word-class="Delete" @update:word-class="deleting"/>
        <ButtonUI word-class="Save" @update:word-class="saving"/>
    </div>

  </ModalUI>

</template>
<style>
</style>