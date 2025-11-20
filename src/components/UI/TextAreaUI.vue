<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    inputValue:{type:String, default:''},
    nameOfPlaceholder:{type:String, default:''},
    rows:{type:Number, default:''},
    maxLength:{type:Number, default:''},
    widthClass:{type:String, default:'w-full'},
    disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:inputValue']);

function onInput(e){
    emit('update:inputValue',e.target.value)
}

</script>

<template>

<textarea :class="[
    'border focus:outline-none border-greenSoft resize-none bg-inputField rounded-xl',
    'placeholder-greenLight text-[20px] font-bold px-4 text-greenSoft',
     'focus:ring-emerald-500 focus:ring-2 transition duration-300 hover:border-3',
     widthClass]" 
:placeholder="nameOfPlaceholder" :value="inputValue" :rows="rows" :maxlength="maxLength" @input="onInput" :disabled="props.disabled">
</textarea>

</template>