<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';
import ModalUI from '../UI/ModalUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import ModalCloseUI from '../UI/ModalCloseUI.vue';

const props = defineProps({
  modalTitle:{type:String, default: ''},
  modalType:{type:String, default: 'confirmation'},
  modalMessage:{type:String, default: ''},
  confirmationModalVisible:{type:Boolean, default:false},
});

const emit = defineEmits(['update:confirmationModalVisible'])

function MenuClosing(){
    emit('update:confirmationModalVisible',false)
}

</script>

<template>

  <ModalUI name="course information" :visible="confirmationModalVisible" width-class="w-auto" height-class="h-auto">
    <div class="flex gap-2">
        <ModalCloseUI @close-modal="MenuClosing"/>
        <WordsUI :word-class="modalTitle"/>
    </div>

    <div class="flex  flex-col border-greenSoft border-t-2 gap-2 py-2 ">
        <WordsUI :word-class="modalMessage" width-class="max-w-[40ch]"/>
    </div>

    <div class="h-2"></div>

    <div v-if="modalType === 'confirmation'" class="flex gap-2 justify-end">
        <ButtonUI word-class="Yes"/>
        <ButtonUI word-class="No" @update:word-class="MenuClosing"/>
    </div>

    <div v-else class="flex justify-end">
        <ButtonUI word-class="OK" width-class="w-[20%]" @update:word-class="MenuClosing"/>
    </div>

  </ModalUI>

</template>
<style>
</style>