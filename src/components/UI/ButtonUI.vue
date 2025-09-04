<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    wordClass:{type:String, default:''},
    widthClass:{type:String, default:'w-full'}
});

const emit = defineEmits(['update:wordClass'])

function updateValue(e){
    emit('update:wordClass',props.wordClass)
}

</script>

<template>

<button :class="['h-[50px] text-[30px] font-bold px-2 text-cream bg-greenSoft rounded-xl active:bg-pressedButton hover:bg-hoverButton', widthClass]"
@click = "updateValue">
    {{wordClass}}
</button>

</template>