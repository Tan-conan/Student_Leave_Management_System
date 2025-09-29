<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import CourseList from '../components/Common/CourseList.vue';
import AddNewCourse from '../components/Common/AddNewCourse.vue';
import LecturerAssignCourse from '../components/Common/LecturerAssignCourse.vue';
import CourseInformationModal from '../components/Common/CourseInformationModal.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';

const route = useRoute()
const topPageTitle = ref('Course Management');
const userName = ref(route.query.userName || '<HOP Name>');
const userType = ref(route.query.userType || '');
console.log('user type is ' + userType.value);

const userMenuModalVisible = ref(false)
const courseMenuModalVisible = ref(false)
const SaveCourseModalVisible = ref(false)
const DeleteCourseModalVisible = ref(false)
const createCourseModalVisible = ref(false)
const assignLecturerModalVisible = ref(false)

const courseList = ref([
  { id: 1, course_code: 'CS101', course_name: 'Introduction to Computer Science', current_lecturer: 'Dr. Tan Wei Ming' },
  { id: 2, course_code: 'CS202', course_name: 'Data Structures and Algorithms', current_lecturer: 'Prof. Lim Jia Hui' },
  { id: 3, course_code: 'CS305', course_name: 'Database Systems', current_lecturer: 'Dr. Ong Kok Leong' },
  { id: 4, course_code: 'CS401', course_name: 'Operating Systems', current_lecturer: 'Dr. Chia Li Ling' },
  { id: 5, course_code: 'CS450', course_name: 'Artificial Intelligence', current_lecturer: 'Prof. Lee Chee Hong' }
])

const courseName = ref('')
const courseCode = ref('')
const courseLecturer = ref('')

function handleDelete(){
  courseMenuModalVisible.value = false
  DeleteCourseModalVisible.value = true
}

function handleSave(){
  courseMenuModalVisible.value = false
  SaveCourseModalVisible.value = true
}

</script>

<template>
  <div class="flex flex-col gap-2 h-screen">
    <ComfirmationModal modal-title="Delete Course" modal-message="are you sure you want to delete this course?" 
     v-model:confirmationModalVisible="DeleteCourseModalVisible"/>

    <ComfirmationModal modal-title="Save Course" modal-message="are you sure you want to save this course?" 
     v-model:confirmationModalVisible="SaveCourseModalVisible"/>

    <ComfirmationModal modal-title="Create Course" modal-message="are you sure you want to create this course?" 
     v-model:confirmationModalVisible="createCourseModalVisible"/>

    <ComfirmationModal modal-title="Assign Lecturer" modal-message="are you sure you want to assign the lecturer?" 
     v-model:confirmationModalVisible="assignLecturerModalVisible"/>

    <CourseInformationModal v-model:user-menu-modal-visible="courseMenuModalVisible" :courseName="courseName"
     :courseCode="courseCode" :courseLecturer="courseLecturer" @delete="handleDelete" @save="handleSave"/>

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <CourseList v-model:user-name="userName" v-model:user-type="userType" v-model:courseName="courseName"
     v-model:courseCode="courseCode" v-model:courseLecturer="courseLecturer" v-model:courseList="courseList"
     v-model:courseMenuModalVisible="courseMenuModalVisible"/>

    <div class="flex gap-2 h-full">
        <AddNewCourse @create-course="createCourseModalVisible = true"/>
        <LecturerAssignCourse @assign-lecturer="assignLecturerModalVisible = true"/>
    </div>

  </div>

</template>

<style scoped>

</style>
