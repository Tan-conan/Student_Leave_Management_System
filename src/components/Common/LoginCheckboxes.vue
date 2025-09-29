<script setup>
import RadioUI from '../UI/RadioUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import {defineProps, defineEmits} from 'vue'

const props = defineProps({
    currentRadioValue:{type:String, default:'none'}
});

const emit = defineEmits(['update:currentRadioValue'])

function updateValue(val){
    emit('update:currentRadioValue',val)
}

</script>

<template>
<div class="flex items-center justify-center w-[100%] mx-auto px-0 gap-10">
    <WordsUI word-class="I am..."/>

    <div class="flex items-center gap-1">
        <WordsUI word-class="Student"/>
        <RadioUI this-radio-value="student" :current-radio-value="props.currentRadioValue" @update:currentRadioValue = "updateValue"/>
    </div>

    <div class="flex items-center gap-1">
        <WordsUI word-class="Lecturer"/>
        <RadioUI this-radio-value="lecturer" :current-radio-value="props.currentRadioValue" @update:currentRadioValue = "updateValue"/>
    </div>

    <div class="flex items-center gap-1">
        <WordsUI word-class="HOP"/>
        <RadioUI this-radio-value="hop" :current-radio-value="props.currentRadioValue" @update:currentRadioValue = "updateValue"/>
    </div>
    
</div>

</template>
<style>
</style>