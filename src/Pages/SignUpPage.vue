<script setup>
import axios from 'axios'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import WordsUI from '../components/UI/WordsUI.vue'
import ButtonUI from '../components/UI/ButtonUI.vue'
import SignUpInputs from '../components/Common/SignUpInputs.vue'
import SignupProgram from '../components/Common/SignupProgram.vue'
import SignupCheckboxes from '../components/Common/SignupCheckboxes.vue'

const router = useRouter()

function backToLogin() {
  router.push('/')
}

const userName = ref('')
const userEmail = ref('')
const userPassword = ref('')
const userConfirmPass = ref('')
const userSID = ref('')
const userContactNum = ref('')
const dropdownValue = ref('')
const currentRadioValue = ref('')
const joinDate = ref(null)

watch(userName, (newVal) => {
  console.log('userName is now:', newVal)
})

watch(userEmail, (newVal) => {
  console.log('userEmail is now:', newVal)
})

watch(userPassword, (newVal) => {
  console.log('userPassword is now:', newVal)
})

watch(userConfirmPass, (newVal) => {
  console.log('userConfirmPass is now:', newVal)
})

watch(userSID, (newVal) => {
  console.log('userSID is now:', newVal)
})

watch(userContactNum, (newVal) => {
  console.log('userContactNum is now:', newVal)
})

watch(dropdownValue, (newVal) => {
  console.log('dropdownValue is now:', newVal)
})

watch(currentRadioValue, (newVal) => {
  console.log('currentRadioValue is now:', newVal)
})

watch(joinDate, (newVal) => {
  console.log('joinDate is now:', newVal)
})

async function registerUser() {
  // password not = confirm pass, reject
  if (userPassword.value !== userConfirmPass.value) {
    alert('Password and Confirm Password do not match!')
    return
  }

  const date = new Date(joinDate.value)
  const formattedDate = date.toLocaleDateString('en-CA') // to local date


  try {
    const res = await axios.post('http://localhost:3000/api/auth/register', {
      name: userName.value,
      email: userEmail.value,
      password: userPassword.value,
      student_id: userSID.value,
      contact_no: userContactNum.value,
      program_name: dropdownValue.value,
      role: currentRadioValue.value,
      date_join: formattedDate,
      status: 'pending',
      leave_balance: 10
    })

    //if register success
    alert('Register success: ' + res.data.message)
    router.push('/')
  } catch (err) { // catch error if failed
    console.error(err)
    alert('Register failed: ' + (err.response?.data?.message || err.message))
  }
}

</script>

<template>
  <div class="flex flex-col gap-5">
    <p></p>
    <ButtonUI word-class="Back to Login" width-class="w-[20%]" @click="backToLogin"/>
    <SignUpInputs v-model:user-name="userName" v-model:user-email="userEmail" v-model:user-password="userPassword"
                  v-model:user-confirm-pass="userConfirmPass" v-model:user-s-i-d="userSID" 
                  v-model:user-contact-num="userContactNum" :currentRadioValue="currentRadioValue"
                  v-model:joinDate="joinDate"
    />
    <div class="flex gap-2">
      <SignupProgram v-model:dropdown-value="dropdownValue"/>
      <SignupCheckboxes v-model:current-radio-value="currentRadioValue"/>
    </div>
    <WordsUI word-class="Warning: Please make sure your email for registeration is actually exist!"/>
    <WordsUI word-class="(Your Account will send to HOP to approve for activation)"/>
    <ButtonUI word-class="Sign Up" width-class="w-[20%]" @update:word-class="registerUser"/>
  </div>
</template>

<style scoped>

</style>
