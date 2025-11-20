<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    wordClass:{type:String, default:''},
    widthClass:{type:String, default:'w-full'}
});

const emit = defineEmits(['update:wordClass'])

// pass button word to paent component(simulate pressing button event)
function updateValue(e){
    emit('update:wordClass',props.wordClass)
}

</script>

<template>

<button :class="[
    'h-[50px] text-[30px] font-bold px-2 text-cream bg-defaultButton rounded-xl',
    'active:bg-pressedButton hover:bg-hoverButton hover:scale-[95%] transition duration-300', widthClass
    ]"
@click = "updateValue">
    {{wordClass}}
</button>

</template>