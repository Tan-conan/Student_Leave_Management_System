<script setup>
import { defineProps, defineEmits } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';
import ModalUI from '../UI/ModalUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import ModalCloseUI from '../UI/ModalCloseUI.vue';

const props = defineProps({
  modalTitle:{type:String, default: ''},
  modalType:{type:String, default: 'confirmation'},
  modalMessage:{type:String, default: ''},
  modelVisible:{type:Boolean, default: false},
});

const emit = defineEmits(['confirm', 'update:modelVisible'])

</script>

<template>

  <ModalUI name="course information" :visible="modelVisible" height-class="h-auto">
    <!--header-->
    <div class="flex gap-2">
        <ModalCloseUI @close-modal="emit('update:modelVisible', false)"/>
        <WordsUI :word-class="modalTitle"/>
    </div>

    <!--confirmation message-->
    <div class="flex flex-col border-greenSoft border-t-2 gap-2 py-2 ">
        <WordsUI :word-class="modalMessage" width-class="max-w-[40ch]"/>
    </div>

    <div class="h-2"></div>

    <!--button 1-->
    <div v-if="modalType === 'confirmation'" class="flex gap-2 justify-end">
        <ButtonUI word-class="Yes" @click="() => { console.log('modal emit confirm'); emit('confirm') }"/>
        <ButtonUI word-class="No" @click="emit('update:modelVisible', false)"/>
    </div>

    <!--button 2-->
    <div v-else class="flex justify-end">
        <ButtonUI word-class="OK" width-class="w-[20%]" @update:word-class="emit('update:modelVisible', false)"/>
    </div>

  </ModalUI>

</template>
<style>
</style>