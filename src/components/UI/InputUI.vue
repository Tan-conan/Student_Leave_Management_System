<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    inputValue:{type:String, default:''},
    nameOfInput:{type:String, default:''},
    widthClass:{type:String, default:'w-full'}
});

const emit = defineEmits(['update:inputValue']);

function onInput(e){
    emit('update:inputValue',e.target.value)
}

</script>

<template>

<input :class="[
    'border focus:outline-none border-greenSoft rounded-xl h-[50px] placeholder-greenLight text-[20px] font-bold px-4 text-greenSoft',
     widthClass]" 
:placeholder="nameOfInput" :value="inputValue" @input="onInput">

</template>