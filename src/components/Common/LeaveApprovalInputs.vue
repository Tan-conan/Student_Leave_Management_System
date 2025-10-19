<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import { useRouter } from 'vue-router'
import { ref, defineProps, defineEmits } from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import TextAreaUI from '../UI/TextAreaUI.vue';

const router = useRouter()

const props = defineProps({
 studentName:{type:String, default: ''},
 requestName:{type:String, default: ''},
 leaveType:{type:String, default: ''},
 leaveStatus:{type:String, default: ''},
 startDate:{type:String, default: 'not available'},
 endDate:{type:String, default: 'not available'},
 userName:{type:String, default: ''},
 userType:{type:String, default: ''},
 leaveReason:{type:String, default: ''},
 submissionDate:{type:String, default: ''},
 userCurrentLeave:{type:[String, Number], default: ''},
 userPredictedLeave:{type:[String, Number], default: ''},
 requestValidLeaveDay:{type:[String, Number], default: ''}
});

const emit = defineEmits([
    'update:selectedDateRange',
    'update:requestName',
    'update:leaveReason'
]);

function backToLeaveRequests() {
    router.back()
}

function updateLeaveReason(val) {
    emit('update:leaveReason', val)
}


</script>

<template>
<div class="flex justify-between items-center w-[100%] mx-auto px-0 gap-5">
    <ButtonUI word-class="Back to leave records" width-class="w-auto" @click="backToLeaveRequests"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Student Name:"/>
    <WordsUI :word-class="studentName"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Request Name:"/>
    <WordsUI :word-class="requestName"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Leave Type:"/>
    <WordsUI :word-class="leaveType"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Leave Status:"/>
    <WordsUI :word-class="leaveStatus"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="From"/>
    <WordsUI :word-class="startDate"/>
    <WordsUI word-class="to"/>
    <WordsUI :word-class="endDate"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Submission Date:"/>
    <WordsUI :word-class="submissionDate"/>
</div>

<div class="flex">
    <WordsUI word-class="Student Current Leave Balance:"/>
    <WordsUI :word-class="userCurrentLeave" width-class="flex-1"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Student Predicted Leave Balance:"/>
    <WordsUI :word-class="userPredictedLeave"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Valid leave Day:"/>
    <WordsUI :word-class="requestValidLeaveDay"/>
</div>

<WordsUI word-class="Reason to leave:"/>
<TextAreaUI :inputValue="leaveReason" :rows="5" :maxLength="500" widthClass="w-[100%]" 
@update:input-value="updateLeaveReason" :disabled="true"/>


</template>
<style>
</style>