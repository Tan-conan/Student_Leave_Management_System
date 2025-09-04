<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ChatGPT_UniversityPic from '../assets/ChatGPT_UniversityPic.png'
import LoginInputs from '../components/Common/LoginInputs.vue';
import LoginCheckboxes from '../components/Common/LoginCheckboxes.vue';
import LoginButtons from '../components/Common/LoginButtons.vue';

const router = useRouter()
const userName = ref('');
const userPassword = ref('');
const currentRadioValue = ref('')
const clickedButtonValue = ref('')

watch(userName, (newVal) => {
  console.log('userName is now:', newVal)
})

watch(userPassword, (newVal) => {
  console.log('userPassword is now:', newVal)
})

watch(currentRadioValue, (newVal) => {
  console.log('radioValue is now:', newVal)
})

watch(clickedButtonValue, (newVal) => {
  if (!newVal) return // if newVal is empty or null return instead
  console.log('now the user is clicking:', newVal)
  if (newVal === 'Sign Up') {
    goSignUp()
  }
  clickedButtonValue.value = ''
})

function goSignUp() {
  router.push('/signup')
}

</script>

<template>
  <div class="flex w-full h-screen">
      <div class="flex flex-col w-[70%] h-[100%] gap-6">
    <LoginInputs v-model:user-name = 'userName' v-model:user-password='userPassword'/>
    <LoginCheckboxes v-model:current-radio-value = 'currentRadioValue'/>
    <LoginButtons v-model:clicked-button-value = 'clickedButtonValue'/>
  </div>
  <div class="flex w-[30%] h-[100%] justify-center items-center">
    <img :src="ChatGPT_UniversityPic" class="object-cover h-full" alt="Login page" />
  </div>
  </div>

</template>

<style scoped>

</style>
