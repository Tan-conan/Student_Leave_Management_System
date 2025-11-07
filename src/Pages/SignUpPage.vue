<script setup>
import axios from 'axios'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import WordsUI from '../components/UI/WordsUI.vue'
import ButtonUI from '../components/UI/ButtonUI.vue'
import SignUpInputs from '../components/Common/SignUpInputs.vue'
import SignupProgram from '../components/Common/SignupProgram.vue'
import SignupCheckboxes from '../components/Common/SignupCheckboxes.vue'
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';

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

const confirmationModal = ref({
  visible: false,
  title: '',
  message: '',
  action: null, //functions
  modalType: 'confirmation',
})

function confirmModal() {
  if (confirmationModal.value.action) {
    confirmationModal.value.action()
  }
  confirmationModal.value.visible = false;
}

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
    confirmationModal.value = {
      visible: true,
      title: 'Siggn up warning',
      message: 'Password and Confirm Password do not match!',
      action: null,
      modalType: 'warning',
    }
    return
  }

  const regex = /^[0-9]{8,15}$/;

  if (!regex.test(userContactNum.value)) {
    confirmationModal.value = {
      visible: true,
      title: 'error phone format',
      message: 'invalid phone number format!',
      action: null,
      modalType: 'warning',
    }
  return;
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
    })

    if(!res.data.successfully) {
      confirmationModal.value = {
      visible: true,
      title: 'Sign up Warning',
      message: res.data.message,
      action: null,
      modalType: 'warning',
    }
    return;
    }

    //if register success
    confirmationModal.value = {
      visible: true,
      title: 'Sign up completed',
      message: res.data.message,
      action: null,
      modalType: 'warning',
    }

    console.log('visible:', confirmationModal.value.visible )
    watch(() => confirmationModal.value.visible, (newVal) => {
      console.log('visible:', confirmationModal.value.visible )
      if(newVal === false) {
        router.push('/')
      }
    })
    
  } catch (err) { // catch error if failed
    console.error(err)
    alert('Register failed: ' + (err.response?.data?.message || err.message))
  }
}

</script>

<template>
  <ComfirmationModal :modal-title="confirmationModal.title" v-model:modelVisible="confirmationModal.visible" :modalType="confirmationModal.modalType"
  :modal-message="confirmationModal.message" @confirm="confirmModal"/>

  <div class="flex flex-col gap-5">
    <p></p>
    <ButtonUI word-class="Back to Login" width-class="w-[20%]" @click="backToLogin"/>
    <div class="flex flex-col big-card">
      <SignUpInputs v-model:user-name="userName" v-model:user-email="userEmail" v-model:user-password="userPassword"
                  v-model:user-confirm-pass="userConfirmPass" v-model:user-s-i-d="userSID" 
                  v-model:user-contact-num="userContactNum" :currentRadioValue="currentRadioValue"
                  v-model:joinDate="joinDate"/>
    <div class="flex gap-2 ">
      <SignupProgram v-model:dropdown-value="dropdownValue"/>
      <SignupCheckboxes v-model:current-radio-value="currentRadioValue"/>
    </div>
    </div>
    <div class="flex flex-col big-card">
      <WordsUI word-class="Warning:" text-color-class="text-wordSubTitle"/>
      <div class="flex flex-col caution-card">
        <WordsUI word-class="Please make sure your email for registeration is actually exist!"/>
        <WordsUI word-class="(Your Account will send to HOP to approve for activation)"/>
      </div>
    </div>
    <ButtonUI word-class="Sign Up" width-class="w-[20%]" @update:word-class="registerUser"/>
  </div>
</template>

<style scoped>

</style>
