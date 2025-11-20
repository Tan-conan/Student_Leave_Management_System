<script setup>
import InputUI from '../UI/InputUI.vue';
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  userName:{type:String, default:''},
  userPassword:{type:String, default:''},
});

const emit = defineEmits(['update:userName','update:userPassword']);

</script>

<template>
<div class="flex flex-col items-center justify-center w-[100%] mx-auto px-0 gap-10">

  <p class="font-bold text-[90px] text-[var(--color-greenSoft)]">HavaBreak</p>
  <InputUI :input-value="props.userName" 
    @update:input-value="val => emit('update:userName', val)" name-of-placeholder="Email" width-class="w-[80%]"/>
  <InputUI :input-value="props.userPassword"
    @update:input-value="val => emit('update:userPassword', val)" name-of-placeholder="Password" width-class="w-[80%]" type="password"/>


</div>

</template>
<style>
</style>