<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import InputUI from '../UI/InputUI.vue';
import DatePicker from '../UI/DatePicker.vue';
import { useRouter } from 'vue-router'
import { ref, defineProps, defineEmits } from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';
import TextAreaUI from '../UI/TextAreaUI.vue';

const router = useRouter()

const props = defineProps({
 selectedDateRange:{type:Array, default: [null, null]},
 requestName:{type:String, default: ''},
 leaveType:{type:String, default: ''},
 leaveReason:{type:String, default: ''},
 userName:{type:String, default: ''},
 userType:{type:String, default: ''},
 userCurrentLeave:{type:[String, Number], default: ''},
 userPredictedLeave:{type:[String, Number], default: ''},
 requestValidLeaveDay:{type:[String, Number], default: ''}
});

const emit = defineEmits([
    'update:selectedDateRange',
    'update:requestName',
    'update:leaveReason',
    'update:leaveType'
]);

const leaveTypeArray = ref([
    'sick leave',
    'emergency leave',
    'personal leave',
    'family leave',
    'official leave',
    'study leave',
    'other'
])

function backToLeaveRecords() {
    router.push({
            path:'/StudentRecordPage',
            query:{
                userName:props.userName,
                userType:props.userType
            }
    })
}

function passDate(val) {
    emit('update:selectedDateRange', val)
}

function updateLeaveReason(val) {
    emit('update:leaveReason', val)
}


</script>

<template>
<div class="flex justify-between items-center w-[100%] mx-auto px-0 gap-5">
    <ButtonUI word-class="Back to leave records" width-class="w-auto" @click="backToLeaveRecords"/>
    <div class="flex">
        <WordsUI word-class="Leave Balance:"/>
        <WordsUI :word-class="userCurrentLeave" width-class="flex-1"/>
    </div>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Request Name"/>
    <InputUI :input-value="requestName" width-class="flex-1" @update:input-value="val => emit('update:requestName',val)"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Leave Type"/>
    <DropdownUI :options="leaveTypeArray" :dropdown-value="leaveType" @update:dropdown-value="val => emit('update:leaveType', val)"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Select Leave Date Range"/>
    <DatePicker :date-value="selectedDateRange" width-class="flex-1" type="daterange" placeholder="Select date range" @update:date-value="passDate"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Predicted Leave Balance:"/>
    <WordsUI :word-class="userPredictedLeave"/>
</div>

<div class="flex items-center w-[100%] mx-auto px-0 gap-2">
    <WordsUI word-class="Valid leave Day:"/>
    <WordsUI :word-class="requestValidLeaveDay"/>
</div>

<WordsUI word-class="Reason to leave:"/>
<TextAreaUI :inputValue="leaveReason" :rows="5" :maxLength="500" widthClass="w-[100%] min-h-[240px]" @update:input-value="updateLeaveReason"/>


</template>
<style>
</style>