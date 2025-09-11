<script setup>
import { defineProps, defineEmits } from 'vue'

const emit = defineEmits(['closeModal'])

function closeModal(){
    emit('closeModal')
}

</script>

<template>

<button class=" flex h-[40px] w-[40px] text-[30px] font-bold text-2xl px-2 text-greenSoft bg-cream 
rounded-full items-center justify-center border-2 border-greenSoft"
@click = "closeModal">
    <span class="relative -translate-y-[2px]">&times;</span> <!--higher the 'x' so it looks in center -->
</button>

</template>