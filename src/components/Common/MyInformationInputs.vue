<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';
import InputUI from '../UI/InputUI.vue';
import { useRouter } from 'vue-router'
import WordsUI from '../UI/WordsUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';
import DatePicker from '../UI/DatePicker.vue';

const router = useRouter()

const props = defineProps({
 viewerType:{type:String, default: ''},

 // target user information
 targetName:{type:String, default: ''},
 targetRole:{type:String, default: ''},
 targetProgramName:{type:String, default: ''},
 targetEmail:{type:String, default: ''},
 targetNum:{type:String, default: ''},
 targetDateJoined:{type:[Number, String], default: ''},
 targetSessionName:{type:String, default: ''},
 targetStatus:{type:String, default: ''},
 leaveBalance:{type:String, default: ''},
});

const emit = defineEmits([
    'update:targetName',
    'update:targetEmail',
    'update:targetNum',
    'update:targetDateJoined',
    'update:targetSessionName',
    'update:targetStatus',
    'update:leaveBalance',
]);

const stateArray = ref(['active','unactive'])

function backToLogin() {
  router.push('/')
}

</script>

<template>
<div class="flex justify-between items-center w-[100%] mx-auto px-0 gap-10">
    <ButtonUI word-class="Back to Login" width-class="w-auto" @click="backToLogin"/>
</div>

<div class="flex w-[100%] border-greenSoft border-b py-4">
    <div class="flex flex-col items-center w-[50%] mx-auto px-0 gap-2">
    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Username"/>
        <InputUI :input-value="targetName" width-class="flex-1" @update:input-value="val => emit('update:targetName',val)"
        :disabled="props.viewerType === 'hop' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Program"/>
        <InputUI :input-value="targetProgramName" width-class="flex-1"
        :disabled=true />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Contact No"/>
        <InputUI :input-value="targetNum" width-class="flex-1" @update:input-value="val => emit('update:targetNum',val)"
        :disabled="props.viewerType === 'hop' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Date Joined"/>
        <InputUI v-if="viewerType !== 'hop'" :input-value="new Date(targetDateJoined).toLocaleDateString('en-CA')" width-class="flex-1" @update:input-value="val => emit('update:targetDateJoined',val)"
        :disabled="true" />
        <DatePicker v-else :date-value="targetDateJoined" width-class="flex-1" type="date" @update:date-value="val => emit('update:targetDateJoined',val)"/>
    </div>

    <div v-if="targetRole === 'student'" class="flex gap-2 w-[100%]">
        <WordsUI word-class="Leave balance"/>
        <InputUI input-value="<leave balance>" width-class="flex-1" @update:input-value="val => emit('update:leaveBalance',val)"
          :disabled="true" />
    </div>

    </div>

    <div class="flex flex-col items-center w-[50%] mx-auto px-0 gap-2">

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Role"/>
        <InputUI :input-value="targetRole" width-class="flex-1" :disabled="true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Email Address"/>
        <InputUI :input-value="targetEmail" width-class="flex-1" @update:input-value="val => emit('update:targetEmail',val)"
        :disabled="props.viewerType === 'hop' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Session"/>
        <InputUI :input-value="targetSessionName" width-class="flex-1" :disabled=true />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Status"/>
        <DropdownUI v-if="props.viewerType === 'hop' && props.targetRole !== 'hop' " :options="stateArray" :dropdown-value="targetStatus"
        @update:dropdown-value="val => emit('update:targetStatus',val)"/>
        <InputUI v-else :input-value="targetStatus" width-class="flex-1" :disabled=true />
    </div>
    </div>
</div>

<WordsUI v-if="props.viewerType !== 'hop'" word-class="You may contact HOP Admins if any information are incorrect or needed to change."/>


</template>
<style>
</style>