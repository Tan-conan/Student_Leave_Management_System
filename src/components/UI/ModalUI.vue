<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    visible:{type:Boolean, default:false},
    widthClass:{type:String, default:'w-auto'},
    heightClass:{type:String, default:'h-auto' },
});

</script>
<template>
<div v-if="visible" class="fixed z-50 items-center flex justify-center inset-0">
    <div class="absolute flex justify-center items-center bg-black/50 inset-0"></div>
    <div :class="['relative bg-ivory rounded-3xl p-2 justify-center  border-greenSoft border-2', widthClass, heightClass]">
        <slot></slot>
    </div>
</div>
</template>