<script setup>

const props = defineProps({
    wordClass:{type:String, default:''}
});

</script>

<template>

<p :class="['h-[50px] text-[30px] font-bold px-2 text-greenSoft w-auto']">
    {{wordClass}}
</p>

</template>