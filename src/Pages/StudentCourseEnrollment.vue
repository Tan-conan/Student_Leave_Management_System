<script setup>
import { ref, watch } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import StudentCourseList from '../components/Common/StudentCourseList.vue';
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';


const route = useRoute()
const topPageTitle = ref('Course Enrollment');
const userName = ref(route.query.userName || '<student name>');
const userType = ref(route.query.userType || '');
const selectedCourseList = ref([])
console.log('username is ' + userName.value)
console.log('user type is ' + userType.value);

const courseList = ref([
  { id: 1, course_name: "Database Systems", lecturer_name: "Dr. Tan", checkbox: false },
  { id: 2, course_name: "Operating Systems", lecturer_name: "Prof. Lim", checkbox: false },
  { id: 3, course_name: "Computer Networks", lecturer_name: "Dr. Wong", checkbox: false },
  { id: 4, course_name: "Software Engineering", lecturer_name: "Dr. Lee", checkbox: false },
  { id: 5, course_name: "Artificial Intelligence", lecturer_name: "Dr. Chan", checkbox: false },
  { id: 6, course_name: "Human Computer Interaction", lecturer_name: "Prof. Ong", checkbox: false }
]);

const userMenuModalVisible = ref(false)
const confirmCourseModalVisible = ref(false)

</script>

<template>
  <div class="flex flex-col gap-2">
    <ComfirmationModal modal-title="Selected Course Confirmation" :modal-message="`are you sure you want to select ${selectedCourseList}?`" 
     v-model:confirmationModalVisible="confirmCourseModalVisible"/>

    <UserMenuModal v-model:userMenuModalVisible="userMenuModalVisible" :user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <StudentCourseList v-model:courseList="courseList" v-model:selectedCourseList="selectedCourseList"
    v-model:confirmCourseModalVisible="confirmCourseModalVisible"/>

  </div>

</template>

<style scoped>

</style>
