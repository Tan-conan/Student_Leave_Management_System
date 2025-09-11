<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import InputUI from '../UI/InputUI.vue';

</script>

<template>

<div class="flex flex-col h-[95%] border-greenSoft border-2">

</div>

<div class="flex gap-2 w-[100%] justify-between bg-cream">
    <InputUI name-of-placeholder="ask something here" width-class="flex-1" />
    <ButtonUI word-class="Send Message" width-class="w-auto"/>
</div>

</template>

<style scoped>

</style>
