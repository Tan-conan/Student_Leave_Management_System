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
 selectedDateRange:{type:Array, default: [null, null]},
 requestName:{type:String, default: ''},
 startDate:{type:String, default: 'not available'},
 endDate:{type:String, default: 'not available'},
 userName:{type:String, default: ''},
 userType:{type:String, default: ''},
 leaveReason:{type:String, default: ''}
});

const emit = defineEmits([
    'update:selectedDateRange',
    'update:requestName',
    'update:leaveReason'
]);

function backToLeaveRequests() {
    router.push({
            path:'/LeaveRequestsPage',
            query:{
                userName:props.userName,
                userType:props.userType
            }
    })
}

function updateLeaveReason(val) {
    emit('update:leaveReason', val)
}


</script>

<template>
<div class="flex justify-between items-center w-[100%] mx-auto px-0 gap-10">
    <ButtonUI word-class="Back to Leave requests" width-class="w-auto" @click="backToLeaveRequests"/>
    <WordsUI word-class="Leave Balance:<Balance>"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Request Name"/>
    <WordsUI word-class="<Request Name>"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="From"/>
    <WordsUI word-class="<start date>"/>
    <WordsUI word-class="to"/>
    <WordsUI word-class="<end date>"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Valid leave Day:"/>
    <WordsUI word-class="(Days of leave after deducted holidays and weekends)"/>
</div>

<WordsUI word-class="Reason to leave:"/>
<TextAreaUI :inputValue="leaveReason" :rows="5" :maxLength="500" widthClass="w-[100%]" 
@update:input-value="updateLeaveReason" :disabled="true"/>


</template>
<style>
</style>