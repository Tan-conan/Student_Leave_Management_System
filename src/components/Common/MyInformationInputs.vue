<script setup>
import { ref, defineProps, defineEmits } from 'vue'
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
 targetName:{type:String, default: 'none'},
 targetRole:{type:String, default: 'none'},
 targetProgramName:{type:String, default: 'none'},
 targetEmail:{type:String, default: 'none'},
 targetNum:{type:String, default: 'none'},
 targetDateJoined:{type:[Number, String], default: 'none'},
 targetSessionName:{type:String, default: 'none'},
 targetStatus:{type:String, default: 'none'},

 // leave balance for student
 currentLeaveBalance:{type:[Number, String], default: 'none'},
 predictedLeaveBalance:{type:[Number, String], default: 'none'},
 sessionLeaveBalance:{type:[Number, String], default: 'none'},

 // assign class for lecturer
 assignedClass:{type:[Array, String], default: () => []},
});

const emit = defineEmits([
    'update:targetName',
    'update:targetEmail',
    'update:targetNum',
    'update:targetDateJoined',
    'update:targetSessionName',
    'update:targetStatus',
]);

const stateArray = ref(['active','unactive'])

function backToPrevious() {
  router.back()
}

</script>

<template>
<div class="flex justify-between items-center w-[100%] mx-auto px-0 gap-10">
    <ButtonUI word-class="Back" width-class="w-[10%]" @click="backToPrevious"/>
</div>

<!--Overall User Information-->
<div class="big-card">
    <div class="flex w-[100%] border-greenSoft py-4">

    <!--left side-->
    <div class="flex flex-col items-center w-[50%] mx-auto px-0 gap-2">
    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Username" text-color-class="text-wordSubTitle"/>
        <InputUI :input-value="targetName" width-class="flex-1" @update:input-value="val => emit('update:targetName',val)"
        :disabled="props.viewerType === 'hop' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Program" text-color-class="text-wordSubTitle"/>
        <InputUI :input-value="targetProgramName" width-class="flex-1"
        :disabled=true />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Contact No" text-color-class="text-wordSubTitle"/>
        <InputUI :input-value="targetNum" width-class="flex-1" @update:input-value="val => emit('update:targetNum',val)"
        :disabled="props.viewerType === 'hop' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Date Joined" text-color-class="text-wordSubTitle"/>
        <InputUI v-if="viewerType !== 'hop'" :input-value="new Date(targetDateJoined).toLocaleDateString('en-CA')" width-class="flex-1" @update:input-value="val => emit('update:targetDateJoined',val)"
        :disabled="true" />
        <DatePicker v-else :date-value="targetDateJoined" width-class="flex-1" type="date" @update:date-value="val => emit('update:targetDateJoined',val)"/>
    </div>
    </div>

    <!--right side-->
    <div class="flex flex-col items-center w-[50%] mx-auto px-0 gap-2">
    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Role" text-color-class="text-wordSubTitle"/>
        <InputUI :input-value="targetRole" width-class="flex-1" :disabled="true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Email Address" text-color-class="text-wordSubTitle"/>
        <InputUI :input-value="targetEmail" width-class="flex-1" @update:input-value="val => emit('update:targetEmail',val)"
        :disabled="props.viewerType === 'hop' ? false : true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Session" text-color-class="text-wordSubTitle"/>
        <InputUI :input-value="targetSessionName" width-class="flex-1" :disabled=true />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Status" text-color-class="text-wordSubTitle"/>
        <DropdownUI v-if="props.viewerType === 'hop' && props.targetRole !== 'hop' " :options="stateArray" :dropdown-value="targetStatus"
        @update:dropdown-value="val => emit('update:targetStatus',val)"/>
        <InputUI v-else :input-value="targetStatus" width-class="flex-1" :disabled=true />
    </div>
    </div>
</div>
</div>

<!--Leave Balance Information for student-->
<div class="big-card" v-if= "targetRole === 'student'">
    <div class="flex w-[100%] border-greenSoft py-4">

    <!--left side-->
    <div class="flex flex-col items-center w-[50%] mx-auto px-0 gap-2">
    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Session Leave balance" text-color-class="text-wordSubTitle"/>
        <InputUI :input-value="sessionLeaveBalance" width-class="flex-1" :disabled="true" />
    </div>

    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Predicted Leave balance" text-color-class="text-wordSubTitle"/>
        <InputUI :input-value="predictedLeaveBalance" width-class="flex-1" :disabled="true" />
    </div>
    </div>

    <!--right side-->
    <div class="flex flex-col items-center w-[50%] mx-auto px-0 gap-2">
    <div class="flex gap-2 w-[100%]">
        <WordsUI word-class="Current Leave balance" text-color-class="text-wordSubTitle"/>
        <InputUI :input-value="currentLeaveBalance" width-class="flex-1" :disabled="true" />
    </div>
    </div>

</div>
</div>

<!--Assigned Class Information for Lecturer-->
<div class="big-card" v-if= "targetRole === 'lecturer'"> 
<div class="flex flex-col gap-2 w-[100%]">
    <WordsUI word-class="currently assigned class" text-color-class="text-wordSubTitle"/>
    <div class="flex flex-wrap gap-2">
        <WordsUI v-for="value in assignedClass" :key="value" :word-class="value"
        text-color-class="text-greenSoft bg-cautionCard rounded-2xl px-3 py-1 border-2 border-greenSoft" />
    </div>
</div>
</div>

<WordsUI v-if="props.viewerType !== 'hop'" word-class="You may contact HOP Admins if any information are incorrect or needed to change."/>


</template>
<style>
</style>