<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import LeaveRequestsList from '../components/Common/LeaveRequestsList.vue';
// lecturer/hop student requests page

const route = useRoute()
const router = useRouter()

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

const userName = ref('');
const userType = ref('');
const userProgramId = ref('')

onMounted(() => {

    if(!userInfo) {
        alert('user info unfound, back to login page.')
        router.push('/')
    } else {
        userName.value = userInfo.name || '<user Name>';
        userType.value = userInfo.role || '';
        userProgramId.value = userInfo.program || '';
    }
})

const topPageTitle = ref('Student leave requests');

console.log('user type is ' + userType.value);

const userMenuModalVisible = ref(false)

</script>

<template>
  <div class="flex flex-col gap-2">

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <LeaveRequestsList v-model:user-name="userName" v-model:user-type="userType" />

  </div>

</template>

<style scoped>

</style>
