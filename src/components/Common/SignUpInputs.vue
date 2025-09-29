<script setup>
import DatePicker from '../UI/DatePicker.vue';
import InputUI from '../UI/InputUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  userName:{type:String, default:''},
  userEmail:{type:String, default:''},
  userPassword:{type:String, default:''},
  userConfirmPass:{type:String, default:''},
  userSID:{type:String, default:''},
  userContactNum:{type:String, default:''},
  currentRadioValue:{type:String, default:''},
  joinDate:{type:[String, Number], default:null},
});

const emit = defineEmits([
'update:userName',
'update:userEmail',
'update:userPassword',
'update:userConfirmPass',
'update:userSID',
'update:userContactNum',
'update:joinDate'
]);

</script>

<template>
<div class="flex flex-col items-center justify-center w-[100%] mx-auto px-0 gap-4">

    <div class="flex w-[100%]">

        <div class="flex w-[50%]">
            <WordsUI word-class="Username"/>
            <InputUI :input-value="props.userName" @update:input-value="val => emit('update:userName', val)" 
            name-of-input="e.g. John" width-class="flex-1"/>
        </div>

        <div class="flex w-[50%]">
            <WordsUI word-class="Email"/>
            <InputUI :input-value="props.userEmail" @update:input-value="val => emit('update:userEmail', val)" 
            name-of-input="e.g. John@gmail.com" width-class="flex-1"/>
        </div>

    </div>

    <div class="flex w-[100%]">

        <div class="flex w-[50%]">
            <WordsUI word-class="Password"/>
            <InputUI :input-value="props.userPassword" @update:input-value="val => emit('update:userPassword', val)" 
            name-of-input="e.g. 123456John@" width-class="flex-1"/>
        </div>

        <div class="flex w-[50%]">
            <WordsUI word-class="Confirm Password"/>
            <InputUI :input-value="props.userConfirmPass" @update:input-value="val => emit('update:userConfirmPass', val)" 
            name-of-input="e.g. 123456John@" width-class="flex-1"/>
        </div>

    </div>

    <div class="flex w-[100%]">
        <div class="flex w-[50%]">
            <WordsUI word-class="Contact No"/>
            <InputUI :input-value="props.userContactNum" @update:input-value="val => emit('update:userContactNum', val)" 
            name-of-input="e.g. 6012-345-6789" width-class="flex-1"/>
        </div>

        <div v-if="currentRadioValue === 'student'" class="flex w-[50%]">
            <WordsUI word-class="Student ID"/>
            <InputUI :input-value="props.userSID" @update:input-value="val => emit('update:userSID', val)" 
            name-of-input="e.g. ID123456" width-class="flex-1"/>
        </div>

    </div>

    <div class="flex w-[100%]">

        <div class="flex w-[50%] items-center">
            <WordsUI word-class="Join Date"/>
            <DatePicker type="date" :joinDate="joinDate" @update:date-value="val => emit('update:joinDate', val)" :dateValue="joinDate" width-class="flex-1"/>
        </div>

    </div>


</div>

</template>
<style>
</style>