<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    inputValue:{type:String, default:''},
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
    'border focus:outline-none border-greenSoft bg-ivory rounded-xl h-[50px]',
    ' placeholder-greenLight font-bold px-4 text-greenSoft',
     widthClass]" 
:placeholder="nameOfPlaceholder" :value="inputValue" @input="onInput" :disabled="disabled"
style="font-size:20px !important; line-height:1.2 !important"> <!--prevent naiveUI from changing inputUI text font size-->

</template>