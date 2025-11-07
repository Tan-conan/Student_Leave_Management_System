<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ButtonUI from '../UI/ButtonUI.vue';
import ModalUI from '../UI/ModalUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import ModalCloseUI from '../UI/ModalCloseUI.vue';

const router = useRouter();

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

console.log('userinfo is' + userInfo)

const userName = ref('');
const userType = ref('');

onMounted(() => {

    if(!userInfo) {
        alert('user info unfound, back to login page.')
        router.push('/')
    } else {
        userName.value = userInfo.name || '<user Name>';
        userType.value = userInfo.role || '';
        console.log('user role is' + userType.value)
    }
})

const props = defineProps({
    userMenuModalVisible:{type:Boolean, default:false}
});

const emit = defineEmits(['update:userMenuModalVisible'])
console.log('username is ' + userName)

function MenuClosing(){
    emit('update:userMenuModalVisible',false)
}

function openPage(val){

    switch(val){

        case 'My Information':
        console.log('user wanna to open information page')
        router.push({
            path:'/UserInformationPage',
        })
        break;

        case 'Apply for leave':
        console.log('user wanna to open apply leave record page')
        router.push({
            path:'/StudentApplyLeavePage',
        })
        break;

        case 'My Leave Records':
        console.log('user wanna to open Leave Records list page')
        router.push({
            path:'/StudentRecordPage',
        })
        break;

        case 'Student Leave Requests':
        console.log('user wanna to open student leave requests page')
        router.push({
            path:'/LeaveRequestsPage',
        })
        break;

        case 'Student List':
        console.log('user wanna to open student list page')
        router.push({
            path:'/StudentListPage',
        })
        break;

        case 'Lecturer List':
        console.log('user wanna to open lecturer list page')
        router.push({
            path:'/LecturerListPage',
        })
        break;

        case 'Manage Courses':
        console.log('user wanna to open manage course page')
        router.push({
            path:'/ManageCoursePage',
        })
        break;

        case 'Manage Sessions':
        console.log('user wanna to open manage session page')
        router.push({
            path:'/SessionManagePage',
        })
        break;

        case 'Leave Report':
        console.log('user wanna to open leave report page')
        router.push({
            path:'/HOPReportPage',
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

    <div v-if="userType === 'student' " class="flex  flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        <ButtonUI word-class="My Information" @update:word-class="openPage"/>
        <ButtonUI word-class="Apply for leave" @update:word-class="openPage"/>
        <ButtonUI word-class="My Leave Records" @update:word-class="openPage"/>

    </div>

    <div v-if="userType === 'lecturer' " class="flex  flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        <ButtonUI word-class="My Information" @update:word-class="openPage"/>
        <ButtonUI word-class="Student Leave Requests" @update:word-class="openPage"/>

    </div>

    <div v-if="userType === 'hop' " class="flex  flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
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