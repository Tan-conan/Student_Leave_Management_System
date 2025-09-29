<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ChatGPT_UniversityPic from '../assets/ChatGPT_UniversityPic.png'
import LoginInputs from '../components/Common/LoginInputs.vue';
import LoginCheckboxes from '../components/Common/LoginCheckboxes.vue';
import LoginButtons from '../components/Common/LoginButtons.vue';
import LoginModals from '../components/Common/LoginModals.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';

const router = useRouter()

//user information
const userEmail = ref('');
const userPassword = ref('');

const currentRadioValue = ref('') // user role selection
const clickedButtonValue = ref('') // detect which button clicked

const forgotPassModalVisible = ref(false) // toggle forgot password modals on and off
const noRoleModalVisible = ref(false)

watch(userEmail, (newVal) => {
  console.log('userEmail is now:', newVal)
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
  } else if (newVal === 'Login') {
    userLogin()
  }
  clickedButtonValue.value = ''
})

function goSignUp() {
  router.push('/Signup')
}

async function userLogin() {
  if (!currentRadioValue.value) {
    return noRoleModalVisible.value = true;
  }

  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      role: currentRadioValue.value,
      email: userEmail.value,
      password: userPassword.value,
    })

    //if login success
    alert('Login success: ' + res.data.message)
    localStorage.setItem('token', res.data.token) // token data for backend use
    localStorage.setItem('user', JSON.stringify(res.data.user)) // user data only for frontend displayment and user role

    const userInformation = res.data.user

    switch(userInformation.role){
      case 'student':
        router.push('/StudentRecordPage')
        break;
      case 'lecturer':
      case 'hop':
        router.push('/LeaveRequestsPage')
        break;
}
  } catch (err) { // catch error if failed
    console.error(err)
    alert('Login failed: ' + (err.response?.data?.message || err.message))
  }
}

onMounted(() => {
  // everytime user visit login page clear all login records
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  console.log('localStorage cleared on LoginPage')
})

</script>

<template>

  <LoginModals v-model:forgot-pass-modal-visible="forgotPassModalVisible"/>

  <ComfirmationModal modal-title="Role Unselected" modal-message="Please select a role to login!" 
   modal-type="Warning" v-model:confirmationModalVisible="noRoleModalVisible"/>

  <div class="flex w-full h-screen">

    <div class="flex flex-col w-[70%] h-[100%] gap-6">

    <LoginInputs v-model:user-name = 'userEmail' v-model:user-password='userPassword'/>
    <LoginCheckboxes v-model:current-radio-value = 'currentRadioValue'/>
    <LoginButtons v-model:clicked-button-value = 'clickedButtonValue' @forgotPassClicked="forgotPassModalVisible=!forgotPassModalVisible"/>

    </div>

    <div class="flex w-[30%] h-[100%] justify-center items-center">

      <img :src="ChatGPT_UniversityPic" class="object-cover h-full" alt="Login page" />

    </div>

  </div>

</template>

<style scoped>

</style>
