<script setup>
import { ref, watch } from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import ButtonUI from '../UI/ButtonUI.vue';
import DatePicker from '../UI/DatePicker.vue';

const props = defineProps({
    sessionName:{type:String, default:''},
    sessionDate:{type:Array, default: [null, null]},
    currentSessionName:{type:String, default:''},
    currentSessionStartDate:{type:String, default:''},
    currentSessionEndDate:{type:String, default:''},
    currentSessionState:{type:String, default:''},
})

const emit = defineEmits(['update:sessionDate','startSession','update:sessionName'])

function passDate(val) {
    emit('update:sessionDate', val)
}

</script>

<template>
  <div class="flex flex-col gap-2 w-[50%] h-full border-r-2 border-greenSoft pr-2">
    <WordsUI word-class="Start a new session"/>
    <div class="flex gap-2">
        <WordsUI word-class="Session Name:"/>
        <InputUI width-class="flex-1" :input-value="sessionName" @update:input-value="val => {emit('update:sessionName',val)}"/>
    </div>
    <div class="flex gap-2 items-center">
        <WordsUI word-class="Start Date :"/>
        <DatePicker :date-value="sessionDate" width-class="flex-1" type="daterange" placeholder="Select date range" @update:date-value="passDate"/>
    </div>
    <div class="flex flex-col">
        <WordsUI word-class="Caution:"/>
        <WordsUI word-class=" once a new Session starts unable to start another new session until current one ends!"/>
    </div>

    <div class="flex flex-col bg-ivory rounded-2xl border-greenSoft border-2">
        <WordsUI word-class="Current session"/>
        <div class="flex gap-2">
            <WordsUI word-class="Session Name:"/>
            <WordsUI :word-class="currentSessionName"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Start Date:"/>
            <WordsUI :word-class="currentSessionStartDate"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="End Date:"/>
            <WordsUI :word-class="currentSessionEndDate"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Current State:"/>
            <WordsUI :word-class="currentSessionState"/>
        </div>
    </div>
    
    <div class="flex-1"></div>
    <div class="flex justify-end">
        <ButtonUI word-class="Start" width-class="min-w-auto w-[25%]" @update:word-class="emit('startSession')"/>
    </div>
  </div>

</template>

<style scoped>

</style>
