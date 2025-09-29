<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';
import InputUI from '../UI/InputUI.vue';
import { useRouter } from 'vue-router'
import WordsUI from '../UI/WordsUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';

const router = useRouter()

const props = defineProps({
 selectedDateRange:{type:Array, default: [null, null]},
 requestName:{type:String, default: ''},
 leaveReason:{type:String, default: ''},
 userType:{type:String, default: ''},
});

const emit = defineEmits([
    'update:selectedDateRange',
    'update:requestName',
    'update:leaveReason'
]);

const userName = ref('')
const userProgram = ref('')
const contactNo = ref('')
const dateJoined= ref('')
const assignedCourse= ref('')
const userRole = ref('')
const emailAddress = ref('')
const session = ref('')
const status = ref('')

const stateArray = ref(['available','unavailable','retired','guaduated'])

function backToLogin() {
  router.push('/')
}

watch(userName, (newVal) => {
  console.log('userName is now:', newVal)
})

watch(userProgram, (newVal) => {
  console.log('userProgram is now:', newVal)
})

watch(contactNo, (newVal) => {
  console.log('contactNo is now:', newVal)
})

watch(dateJoined, (newVal) => {
  console.log('dateJoined is now:', newVal)
})

watch(assignedCourse, (newVal) => {
  console.log('assignedCourse is now:', newVal)
})

watch(userRole, (newVal) => {
  console.log('userRole is now:', newVal)
})

watch(emailAddress, (newVal) => {
  console.log('emailAddress is now:', newVal)
})

watch(session, (newVal) => {
  console.log('session is now:', newVal)
})

watch(status, (newVal) => {
  console.log('status is now:', newVal)
})


</script>

<template>
<div class="flex justify-between items-center w-[100%] mx-auto px-0 gap-10">
    <ButtonUI word-class="Back to Login" width-class="w-auto" @click="backToLogin"/>
</div>

<div class="flex w-[100%] border-greenSoft border-b py-4">
    <div class="flex flex-col items-center w-[50%] mx-auto px-0 gap-2">
    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Username"/>
        <InputUI v-model:input-value="userName" width-class="flex-1" :disabled="props.userType === 'HOP' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Program"/>
        <InputUI v-model:input-value="userProgram" width-class="flex-1" :disabled="props.userType === 'HOP' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Contact No"/>
        <InputUI v-model:input-value="contactNo" width-class="flex-1" :disabled="props.userType === 'HOP' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Date Joined"/>
        <InputUI v-model:input-value="dateJoined" width-class="flex-1" :disabled="props.userType === 'HOP' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Assigned Course"/>
        <InputUI v-model:input-value="assignedCourse" width-class="flex-1" :disabled="props.userType === 'HOP' ? false : true" />
    </div>
    </div>

    <div class="flex flex-col items-center w-[50%] mx-auto px-0 gap-2">

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Role"/>
        <InputUI v-model:input-value="userRole" width-class="flex-1" :disabled="props.userType === 'HOP' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Email Address"/>
        <InputUI v-model:input-value="emailAddress" width-class="flex-1" :disabled="props.userType === 'HOP' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Session"/>
        <InputUI v-model:input-value="session" width-class="flex-1" :disabled="props.userType === 'HOP' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Status"/>
        <DropdownUI v-if="props.userType === 'HOP'" :options="stateArray" v-model:dropdown-value="status"/>
        <InputUI v-else input-value="<status>" width-class="flex-1" :disabled=true />
    </div>
    </div>
</div>

<WordsUI word-class="You may contact HOP Admins if any information are incorrect or needed to change."/>


</template>
<style>
</style>