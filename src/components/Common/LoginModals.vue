<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';
import ModalUI from '../UI/ModalUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';
import ModalCloseUI from '../UI/ModalCloseUI.vue';

const currentForgotPassStep = ref(1)

const roleArray = ref(['Student','Lecturer','HOP'])

const props = defineProps({
    forgotPassModalVisible:{type:Boolean, default:false},
})

const emit = defineEmits(['update:forgotPassModalVisible'])

function forgotPassHandling(){
  if (currentForgotPassStep.value < 4) {
    currentForgotPassStep.value++;
  } else {
    emit('update:forgotPassModalVisible',false)
    currentForgotPassStep.value = 1;
  }
}

</script>

<template>

    <!--forgot password modal-->
  <ModalUI name="forgot password" :visible="forgotPassModalVisible" width-class="w-[50%]" height-class="h-auto">

    <!--enter email modal-->
    <div v-if="currentForgotPassStep === 1">

      <div class="flex gap-2">
        <ModalCloseUI @close-modal="{emit('update:forgotPassModalVisible',false); currentForgotPassStep = 1}"/>
        <WordsUI word-class="Enter your registered email"/>
      </div>

      <div class="flex flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        
        <div class="flex gap-2 justify-between">
          <WordsUI word-class="Email:"/>
          <InputUI width-class="w-[80%]"/>
        </div>

        <div class="flex gap-2 justify-between">
          <WordsUI word-class="Role:"/>
          <DropdownUI width-class="w-[80%]" :options="roleArray"/>
        </div>

      </div>
      
    </div>

    <!--enter code modal-->
    <div v-if="currentForgotPassStep === 2">

      <div class="flex gap-2">
        <ModalCloseUI @close-modal="{emit('update:forgotPassModalVisible',false); currentForgotPassStep = 1}"/>
        <WordsUI word-class="Enter the code"/>
      </div>

      <div class="flex flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        
        <div class="flex gap-2 justify-between">
          <WordsUI word-class="Code:"/>
          <InputUI width-class="w-[80%]"/>
        </div>

        <div class="flex gap-2 justify-between">
          <WordsUI word-class="A code has been send to your email, 
          please check it and type the code here to proceed to resetting password within 5 minutes."/>
        </div>

      </div>
      
    </div>

    <!--reset pass modal-->
    <div v-if="currentForgotPassStep === 3">

      <div class="flex gap-2">
        <ModalCloseUI @close-modal="{emit('update:forgotPassModalVisible',false); currentForgotPassStep = 1}"/>
        <WordsUI word-class="Resetting your password"/>
      </div>

      <div class="flex flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        
        <div class="flex gap-2 justify-between">
          <WordsUI word-class="New Password"/>
          <InputUI width-class="w-[60%]"/>
        </div>

        <div class="flex gap-2 justify-between">
          <WordsUI word-class="Confirm Password"/>
          <InputUI width-class="w-[60%]"/>
        </div>

      </div>
      
      
    </div>

    <!--reset pass success modal-->
    <div v-if="currentForgotPassStep === 4">

      <div class="flex gap-2">
        <ModalCloseUI @close-modal="{emit('update:forgotPassModalVisible',false); currentForgotPassStep = 1}"/>
        <WordsUI word-class="Resetting your password"/>
      </div>

      <div class="flex flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        <div class="flex gap-2 justify-between">
          <WordsUI word-class="Your password has been resetted!"/>
        </div>

      </div>
      
    </div>

    <div class="flex justify-end py-2">
      <ButtonUI word-class="Next" width-class="w-[15%]" @update:word-class="forgotPassHandling"/>
    </div>

  </ModalUI>

</template>
<style>
</style>