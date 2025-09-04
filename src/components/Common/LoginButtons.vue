<script setup>
import { defineProps, defineEmits } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';

const props = defineProps({
  clickedButtonValue:{type:String, default:''}
})

const emit = defineEmits(['update:clickedButtonValue'])

function updateValue(val) {
  emit('update:clickedButtonValue',val);
}

</script>

<template>
<div class="flex flex-col items-center justify-center w-[100%] px-0">
  <div class="flex gap-30 w-full justify-center">
    <ButtonUI width-class="w-[30%]" word-class="Login" @update:word-class="updateValue"/>
    <ButtonUI width-class="w-[30%]" word-class="Sign Up" @update:word-class="updateValue"/>
  </div>
  <div class="flex gap-30 w-full justify-center pt-3">
    <a href="" class="font-bold text-blue-400 w-[30%] text-center">Forgot Password?</a>
    <p class="w-[30%]"></p>
  </div>
</div>

</template>
<style>
</style>