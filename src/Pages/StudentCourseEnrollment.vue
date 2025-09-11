<script setup>
import { ref, watch } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import StudentTopPageUI from '../components/Common/StudentTopPageUI.vue'
import StudentCourseList from '../components/Common/StudentCourseList.vue';
import UserMenuModal from '../components/Common/UserMenuModal.vue';


const route = useRoute()
const topPageTitle = ref('Course Enrollment');
const userName = ref(route.query.userName || '<student name>');
const userType = ref(route.query.userType || '');
console.log('username is ' + userName.value)
console.log('user type is ' + userType.value);


const userMenuModalVisible = ref(false)

</script>

<template>
  <div class="flex flex-col gap-2">
    <UserMenuModal v-model:userMenuModalVisible="userMenuModalVisible" :user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <StudentTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <StudentCourseList/>

  </div>

</template>

<style scoped>

</style>
