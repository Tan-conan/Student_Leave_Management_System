<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import InputUI from '../UI/InputUI.vue';
import DatePicker from '../UI/DatePicker.vue';
import { useRouter } from 'vue-router'
import { ref, defineProps, defineEmits } from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import TextAreaUI from '../UI/TextAreaUI.vue';

const router = useRouter()

const props = defineProps({
 selectedDateRange:{type:Array, defult: [null, null]},
 requestName:{type:String, defult: ''},
 leaveReason:{type:String, defult: ''}
});

const emit = defineEmits([
    'update:selectedDateRange',
    'update:requestName',
    'update:leaveReason'
]);

function backToLogin() {
  router.push('/')
}

function passDate(val) {
    emit('update:selectedDateRange', val)
}

function updateLeaveReason(val) {
    emit('update:leaveReason', val)
}


</script>

<template>
<div class="flex justify-between items-center w-[100%] mx-auto px-0 gap-10">
    <ButtonUI word-class="Back to Login" width-class="w-auto" @click="backToLogin"/>
    <WordsUI word-class="Leave Balance:<Balance>"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Request Name"/>
    <InputUI :input-value="requestName" width-class="flex-1" @update:input-value="emit('update:requestName',val)"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Select Leave Date Range"/>
    <DatePicker :date-value="selectedDateRange" width-class="flex-1" type="daterange" placeholder="Select date range" @update:date-value="passDate"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Valid leave Day:"/>
    <WordsUI word-class="(Days of leave after deducted holidays and weekends)"/>
</div>

<WordsUI word-class="Reason to leave:"/>
<TextAreaUI :inputValue="leaveReason" :rows="5" :maxLength="500" widthClass="w-[100%]" @update:input-value="updateLeaveReason"/>


</template>
<style>
</style>