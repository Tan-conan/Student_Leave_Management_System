<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    dropdownValue:{type:String, default:''},
    options:{type:Array, required: true},
    widthClass:{type:String, default:'w-full'},
    placeholder:{type:String, default:''}
});

const emit = defineEmits(['update:dropdownValue']);

function selection(e){
    emit('update:dropdownValue',e.target.value)
}

</script>

<template>

<select :class="[
    'border focus:outline-none border-greenSoft rounded-xl h-[50px] bg-inputField',
    'placeholder-greenLight text-[20px] font-bold px-4 text-greenSoft',
     widthClass]" :value="dropdownValue" @change="selection">

<option disabled selected hidden value="">{{placeholder}}</option>

<option v-for="(option, index) in options" :key="index" :value="option">
  {{ option }}
</option>

</select>

</template>