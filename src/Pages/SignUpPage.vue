<script setup>
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

</script>

<template>
  <div class="flex flex-col gap-5">
    <p></p>
    <ButtonUI word-class="Back to Login" width-class="w-[20%]" @click="backToLogin"/>
    <SignUpInputs v-model:user-name="userName" v-model:user-email="userEmail" v-model:user-password="userPassword"
                  v-model:user-confirm-pass="userConfirmPass" v-model:user-s-i-d="userSID" v-model:user-contact-num="userContactNum"
    />
    <div class="flex gap-2">
      <SignupProgram v-model:dropdown-value="dropdownValue"/>
      <SignupCheckboxes v-model:current-radio-value="currentRadioValue"/>
    </div>
    <WordsUI word-class="(Your Account will send to HOP to approve for activation)"/>
    <ButtonUI word-class="Sign Up" width-class="w-[20%]"/>
  </div>
</template>

<style scoped>

</style>
