<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    inputValue:{type:[String, Number], default:''},
    nameOfPlaceholder:{type:String, default:''},
    disabled:{type:Boolean, default:false},
    widthClass:{type:String, default:'w-full'}
});

const emit = defineEmits(['update:inputValue']);

function onInput(e){
    emit('update:inputValue',e.target.value)
}

</script>

<template>

<input :class="[
    'border focus:outline-none border-greenSoft bg-inputField rounded-xl h-[45px]',
    ' placeholder-greenLight font-bold px-4 text-greenSoft !text-[20px]',
     widthClass]" 
:placeholder="nameOfPlaceholder" :value="inputValue" @input="onInput" :disabled="disabled"> 

</template>