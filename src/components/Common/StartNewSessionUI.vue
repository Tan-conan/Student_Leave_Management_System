<script setup>
import { defineProps } from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import ButtonUI from '../UI/ButtonUI.vue';
import DatePicker from '../UI/DatePicker.vue';

const props = defineProps({
    sessionName:{type:String, default:''},
    sessionDate:{type:Array, default: [null, null]},
    sessionLeaveBalance:{type:String, default: ''},
    currentSessionName:{type:String, default:''},
    currentSessionStartDate:{type:String, default:''},
    currentSessionEndDate:{type:String, default:''},
    currentSessionState:{type:String, default:''},
})

const emit = defineEmits(['update:sessionDate','startSession','update:sessionName','update:sessionLeaveBalance'])

function passDate(val) {
    emit('update:sessionDate', val)
}

</script>

<template>
  <div class="flex flex-col gap-2 w-[50%] h-full border-greenSoft pr-2">
    <div class="big-card flex-1">
        <div class="small-card"><WordsUI word-class="START A NEW SESSION" text-color-class="text-cream" word-bold-class="font-black" wordsize-class="text-[35px]" /></div>
    <div class="flex gap-2">
        <WordsUI word-class="Session Name:" text-color-class="text-wordSubTitle"/>
        <InputUI width-class="flex-1" :input-value="sessionName" @update:input-value="val => {emit('update:sessionName',val)}"/>
    </div>
    <div class="flex gap-2 items-center">
        <WordsUI word-class="Start Date :" text-color-class="text-wordSubTitle"/>
        <DatePicker :date-value="sessionDate" width-class="flex-1" type="daterange" placeholder="Select date range" @update:date-value="passDate"/>
    </div>
    <div class="flex gap-2 items-center">
        <WordsUI word-class="Leave Balance :" text-color-class="text-wordSubTitle"/>
        <InputUI width-class="flex-1" :input-value="sessionLeaveBalance" @update:input-value="val => {emit('update:sessionLeaveBalance',val)}"/>
    </div>
    <div class="flex flex-col">
        <WordsUI word-class="Caution:" text-color-class="text-wordTitle"/>
        <div class="caution-card"><WordsUI word-class=" once a new Session starts unable to start another new session until current one ends!"/></div>
    </div>
    <div class="flex justify-end px-2">
        <ButtonUI word-class="Start" width-class="min-w-auto w-[25%]" @update:word-class="emit('startSession')"/>
    </div>
    </div>
    
    <div class="big-card flex-1">
        <div class="small-card"><WordsUI word-class="CURRENT SESSION" text-color-class="text-cream" word-bold-class="font-black" wordsize-class="text-[35px]" /></div>
        <div class="flex gap-2">
            <WordsUI word-class="Session Name:" text-color-class="text-wordSubTitle"/>
            <WordsUI :word-class="currentSessionName"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Start Date:" text-color-class="text-wordSubTitle"/>
            <WordsUI :word-class="currentSessionStartDate"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="End Date:" text-color-class="text-wordSubTitle"/>
            <WordsUI :word-class="currentSessionEndDate"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Current State:" text-color-class="text-wordSubTitle"/>
            <WordsUI :word-class="currentSessionState"/>
        </div>
    </div>
    
  </div>

</template>

<style scoped>

</style>
