<script setup>
import { ref, watch } from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import ButtonUI from '../UI/ButtonUI.vue';
import DatePicker from '../UI/DatePicker.vue';

const props = defineProps({
    sessionName:{type:String, default:''},
    sessionDate:{type:Array, default: [null, null]},
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
        <WordsUI word-class=" once a new Session starts unable to edit the start date and end date until the end of session!"/>
    </div>

    <div class="flex flex-col bg-ivory rounded-2xl border-greenSoft border-2">
        <WordsUI word-class="Current session"/>
        <div class="flex gap-2">
            <WordsUI word-class="Session Name:"/>
            <WordsUI word-class="<session name>"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Start Date:"/>
            <WordsUI word-class="<start date>"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="End Date:"/>
            <WordsUI word-class="<end date>"/>
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
