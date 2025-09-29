<script setup>

const props = defineProps({
    wordClass:{type:String, default:''},
    textColorClass:{type:String, default:'text-greenSoft'},
    widthClass:{type:String, default:'w-auto'},
});

</script>

<template>

<p :class="['h-auto text-[30px] font-bold px-2 whitespace-normal break-words', textColorClass , widthClass]">
    {{wordClass}}
</p>

</template>