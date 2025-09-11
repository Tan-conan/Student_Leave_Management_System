<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    inputValue:{type:String, default:''},
    nameOfPlaceholder:{type:String, default:''},
    rows:{type:Number, default:''},
    maxLength:{type:Number, default:''},
    widthClass:{type:String, default:'w-full'}
});

const emit = defineEmits(['update:inputValue']);

function onInput(e){
    emit('update:inputValue',e.target.value)
}

</script>

<template>

<textarea :class="[
    'border focus:outline-none border-greenSoft resize-none bg-ivory rounded-xl',
    'placeholder-greenLight text-[20px] font-bold px-4 text-greenSoft',
     widthClass]" 
:placeholder="nameOfPlaceholder" :value="inputValue" :rows="rows" :maxlength="maxLength" @input="onInput">
</textarea>

</template>