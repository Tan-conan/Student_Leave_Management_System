<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonUI from '../UI/ButtonUI.vue';
import ModalUI from '../UI/ModalUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import ModalCloseUI from '../UI/ModalCloseUI.vue';

const router = useRouter();

const props = defineProps({
    userMenuModalVisible:{type:Boolean, default:false},
    userName:{type:String, default:''},
    userType:{type:String, default:''},
})

const emit = defineEmits(['update:userMenuModalVisible'])
console.log('username is ' + props.userName)

function MenuClosing(){
    emit('update:userMenuModalVisible',false)
}

function openPage(val){

    switch(val){

        case 'My Information':
        console.log('user wanna to open information page')
        router.push({
            path:'/UserInformationPage',
            query:{
                userName:props.userName,
                userType:props.userType
            }
        })
        break;

        case 'Enrollment':
        console.log('user wanna to open Enrollment page')
        router.push({
            path:'/StudentCourseEnrollment',
            query:{
                userName:props.userName,
                userType:props.userType
            }
        })
        break;

        case 'Apply for leave':
        console.log('user wanna to open apply leave record page')
        router.push({
            path:'/StudentApplyLeavePage',
            query:{
                userName:props.userName,
                userType:props.userType
            }
        })
        break;

        case 'My Leave Records':
        console.log('user wanna to open Leave Records list page')
        router.push({
            path:'/StudentRecordPage',
            query:{
                userName:props.userName,
                userType:props.userType
            }
        })
        break;

        case 'Student Leave Requests':
        console.log('user wanna to open student leave requests page')
        router.push({
            path:'/LeaveRequestsPage',
            query:{
                userName:props.userName,
                userType:props.userType
            }
        })
        break;

        default:
        console.log('error on user wanna to open page')
    }
}

</script>

<template>

    <!--Student modal-->
  <ModalUI name="forgot password" :visible="userMenuModalVisible" width-class="w-auto" height-class="h-auto">
    <div class="flex gap-2">
        <ModalCloseUI @close-modal="MenuClosing"/>
        <WordsUI :word-class="`${userType} Menu`"/>
    </div>

    <div v-if="userType === 'Student' " class="flex  flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        <ButtonUI word-class="My Information" @update:word-class="openPage"/>
        <ButtonUI word-class="Enrollment" @update:word-class="openPage"/>
        <ButtonUI word-class="Apply for leave" @update:word-class="openPage"/>
        <ButtonUI word-class="My Leave Records" @update:word-class="openPage"/>

    </div>

    <div v-if="userType === 'Lecturer' " class="flex  flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        <ButtonUI word-class="My Information" @update:word-class="openPage"/>
        <ButtonUI word-class="Student Leave Requests" @update:word-class="openPage"/>

    </div>

    <div v-if="userType === 'HOP' " class="flex  flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        <ButtonUI word-class="My Information" @update:word-class="openPage"/>
        <ButtonUI word-class="Student Leave Requests" @update:word-class="openPage"/>
        <ButtonUI word-class="Student List" @update:word-class="openPage"/>
        <ButtonUI word-class="Lecturer List" @update:word-class="openPage"/>
        <ButtonUI word-class="Manage Courses" @update:word-class="openPage"/>
        <ButtonUI word-class="Manage Sessions" @update:word-class="openPage"/>
        <ButtonUI word-class="Leave Report" @update:word-class="openPage"/>
        
    </div>

    

  </ModalUI>

</template>
<style>
</style>