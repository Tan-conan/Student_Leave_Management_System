<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';
import ModalUI from '../UI/ModalUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import ModalCloseUI from '../UI/ModalCloseUI.vue';
import InputUI from '../UI/InputUI.vue';
import DatePicker from '../UI/DatePicker.vue';

const props = defineProps({
  holidayName:{type:String, default: ''},
  userMenuModalVisible:{type:Boolean, default:false},
  selectedDateRange:{type:Array, default: [null, null]},
});

const emit = defineEmits(['update:selectedDateRange','update:holidayName', 'deleteHoliday', 'saveHoliday'])

function MenuClosing(){
    emit('update:userMenuModalVisible',false)
}

</script>

<template>

  <ModalUI name="Holiday information" :visible="userMenuModalVisible" width-class="w-auto" height-class="h-auto">
    <div class="flex gap-2">
        <ModalCloseUI @close-modal="MenuClosing"/>
        <WordsUI word-class="Holiday Information"/>
    </div>

    <div class="flex  flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        <div class="flex gap-2">
            <WordsUI word-class="Holiday Name:"/>
            <InputUI :input-value="`${holidayName}`" width-class="flex-1"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="holiday Date Range"/>
            <DatePicker :date-value="selectedDateRange" width-class="flex-1" type="daterange" 
             placeholder="Select date range" @update:date-value=""/>
        </div>
        
    </div>

    <div class="h-2"></div>

    <div class="flex gap-2 justify-end">
        <ButtonUI word-class="Delete" @update:word-class="emit('deleteHoliday')"/>
        <ButtonUI word-class="Save" @update:word-class="emit('saveHoliday')"/>
    </div>

  </ModalUI>

</template>
<style>
</style>