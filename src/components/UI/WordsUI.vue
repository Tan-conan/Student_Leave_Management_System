<script setup>

const props = defineProps({
    wordClass:{type:String, default:''},
    textColorClass:{type:String, default:'text-greenSoft'}
});

</script>

<template>

<p :class="['h-auto text-[30px] font-bold px-2 w-auto',textColorClass]">
    {{wordClass}}
</p>

</template>