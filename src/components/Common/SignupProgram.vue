<script setup>
import WordsUI from '../UI/WordsUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  dropdownValue:{type:String, default:''},
});

const emit = defineEmits(['update:dropdownValue']);
const programList = ref(['one','two','three','four'])

function updateselection(val){
    emit('update:dropdownValue',val)
}

</script>

<template>
<div class="flex items-center w-[50%] mx-auto px-0 gap-4">
    <WordsUI word-class="Program"/>
    <DropdownUI :dropdown-value="dropdownValue" :options="programList" placeholder="Select your program"
    width-class="flex-1" @update:dropdown-value="updateselection"/>

</div>

</template>
<style>
</style>