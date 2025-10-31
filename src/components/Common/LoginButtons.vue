<script setup>
import { defineProps, defineEmits } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';

const props = defineProps({
  clickedButtonValue:{type:String, default:''}
})

const emit = defineEmits(['update:clickedButtonValue','forgotPassClicked'])

function updateValue(val) {
  emit('update:clickedButtonValue',val);
}

</script>

<template>
<div class="flex flex-col items-center justify-center w-[100%] px-0">
  <div class="flex gap-30 w-full justify-center">
    <ButtonUI width-class="w-[30%]" word-class="Login" @click="updateValue('Login')"/>
    <ButtonUI width-class="w-[30%]" word-class="Sign Up" @click="updateValue('Sign Up')"/>
  </div>
</div>

</template>
<style>
</style>