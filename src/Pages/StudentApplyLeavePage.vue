<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import StudentApplyleaveInputs from '../components/Common/StudentApplyleaveInputs.vue';
import LeaveFileAttachment from '../components/Common/LeaveFileAttachment.vue';
import LeaveLecturerSelection from '../components/Common/LeaveLecturerSelection.vue';
import ButtonUI from '../components/UI/ButtonUI.vue';
import ChatBotUI from '../components/Common/ChatBotUI.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';

const route = useRoute()
const topPageTitle = ref('Leave Form');
const userName = ref(route.query.userName || '<Student Name>');
const userType = ref(route.query.userType || '');
console.log('user type is ' + userType.value);

const userMenuModalVisible = ref(false)
const confirmFileModalVisible = ref(false)
const confirmSaveModalVisible = ref(false)
const confirmSendModalVisible = ref(false)

const requestName = ref('')
const selectedDateRange = ref(null)

const leaveReason = ref('');

const leaveFiles = ref([
  {id: 1 , file_name: 'medical_certificate.pdf' , checkbox: false},
  {id: 2 , file_name: 'parent_letter.jpg' , checkbox: false},
  {id: 3 , file_name: 'event_approval_form.pdf' , checkbox: false},
  {id: 4 , file_name: 'accident_report.png' , checkbox: false}
])

const lecturerCourses = ref([
  { id: 1, lecturer_name: 'Dr. Lim Wei Ming', course_name: 'Software Engineering', checkbox: false },
  { id: 2, lecturer_name: 'Prof. Tan Ai Ling', course_name: 'Database Systems', checkbox: false },
  { id: 3, lecturer_name: 'Mr. Ahmad Zulkifli', course_name: 'Operating Systems', checkbox: false },
  { id: 4, lecturer_name: 'Dr. Chong Mei Ling', course_name: 'Computer Networks', checkbox: false },
  { id: 5, lecturer_name: 'Ms. Nurul Aisyah', course_name: 'Human-Computer Interaction', checkbox: false }
])

watch(selectedDateRange, (newVal) => {
  let startDate = new Date(selectedDateRange.value[0])
  let endDate = new Date(selectedDateRange.value[1])
  
  console.log(startDate.toLocaleDateString())
  console.log(endDate.toLocaleDateString())   

})

</script>

<template>
  <div class="flex flex-col gap-2">
    <!--save modal-->
    <ComfirmationModal modal-title="Save confirmation" modal-message="Are you sure you want to save the record?"
     v-model:confirmationModalVisible="confirmSaveModalVisible"/>

    <!--no lecturer chosen modal-->
    <ComfirmationModal v-if="lecturerCourses.every(item => item.checkbox === false)" 
     modal-title="No lecturer selected" modal-message="You need to select at least one lecturer to send!" modal-type="Warning"
     v-model:confirmationModalVisible="confirmSendModalVisible"/>

    <!--send request modal-->
    <ComfirmationModal v-else modal-title="Send Record Confirmation" modal-message="are you sure you want to send the leave request?" 
     v-model:confirmationModalVisible="confirmSendModalVisible"/>

    <!--no file delete modal-->
    <ComfirmationModal v-if="leaveFiles.every(item => item.checkbox === false)" 
     modal-title="No files selected" modal-message="You have no selected files to delete!" modal-type="Warning"
     v-model:confirmationModalVisible="confirmFileModalVisible"/>

    <!--delete file modal-->
    <ComfirmationModal v-else modal-title="Delete file Confirmation" modal-message="are you sure you want to delete selected files?" 
     v-model:confirmationModalVisible="confirmFileModalVisible"/>

    <UserMenuModal v-model:userMenuModalVisible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <div class="flex w-full items-stretch gap-2">

      <!--left-->
      <div class="flex flex-col w-[60%] gap-2">
        <StudentApplyleaveInputs v-model:selected-date-range="selectedDateRange" v-model:user-name="userName" 
        v-model:user-type="userType" v-model:request-name="requestName" v-model:leave-reason="leaveReason"/>

        <LeaveFileAttachment v-model:user-type="userType" v-model:confirmFileModalVisible="confirmFileModalVisible"
        v-model:leaveFiles="leaveFiles"/>

        <LeaveLecturerSelection v-model:user-type="userType" v-model:lecturerCourses="lecturerCourses"/>

        <div class="flex gap-2 justify-end w-[100%]">
          <ButtonUI word-class="Save leave record" width-class="w-auto" @update:word-class="confirmSaveModalVisible = true"/>
          <ButtonUI word-class="Send leave record" width-class="w-auto" @update:word-class="confirmSendModalVisible = true"/>
        </div>

      </div>

      <!--right-->
      <div class="flex flex-col flex-1 gap-2 bg-ivory">
        <ChatBotUI/>
    
      </div>

    </div>

  </div>

</template>

<style scoped>

</style>
