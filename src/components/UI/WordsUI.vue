<script setup>

const props = defineProps({
    wordClass:{type:[String, Number], default:''},
    textColorClass:{type:String, default:'text-mainText'},
    widthClass:{type:String, default:'w-auto'},
    wordBoldClass:{type:String, default:''},
    wordsizeClass:{type:String, default:'text-[30px]'},
});

</script>

<template>

<p :class="['h-auto font-bold px-2 whitespace-normal break-words', textColorClass , widthClass, wordBoldClass, wordsizeClass]">
    {{wordClass}}
</p>

</template>