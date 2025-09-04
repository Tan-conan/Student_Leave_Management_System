<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    currentRadioValue:{type:String, default:'none'},
    thisRadioValue:{type:String, required:true}
});

const emit = defineEmits(['update:currentRadioValue'])

function updateValue(e){
    emit('update:currentRadioValue',e.target.value)
}

</script>

<template>
    <input type="radio" class="w-6 h-6 border-greenSoft" :value="thisRadioValue"
        :checked = "props.currentRadioValue === props.thisRadioValue" @change="updateValue"/>
</template>