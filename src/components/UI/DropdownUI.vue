<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    dropdownValue:{type:String, default:''},
    options:{type:Array, required: true},
    widthClass:{type:String, default:'w-full'},
    placeholder:{type:String, default:''}
});

const emit = defineEmits(['update:dropdownValue']);

// pass dropdown value to parent component
function selection(e){
    emit('update:dropdownValue',e.target.value)
}

</script>

<template>

<select :class="[
    'border focus:outline-none focus:ring-2 focus:ring-emerald-500 border-greenSoft rounded-xl h-[50px] bg-inputField',
    'placeholder-greenLight text-[20px] font-bold px-4 text-greenSoft transition duration-300 hover:border-3',
     widthClass]" :value="dropdownValue" @change="selection">

<option disabled selected hidden value="">{{placeholder}}</option>

<option v-for="(option, index) in options" :key="index" :value="option">
  {{ option }}
</option>

</select>

</template>