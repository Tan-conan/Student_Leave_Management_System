<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import LeaveFileAttachment from '../components/Common/LeaveFileAttachment.vue';
import LeaveLecturerSelection from '../components/Common/LeaveLecturerSelection.vue';
import ButtonUI from '../components/UI/ButtonUI.vue';
import ChatBotUI from '../components/Common/ChatBotUI.vue';
import LeaveApprovalInputs from '../components/Common/LeaveApprovalInputs.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';

const route = useRoute()
const topPageTitle = ref('Student Leave Form');
const userName = ref(route.query.userName || '<Lecturer / HOP Name>');
const userType = ref(route.query.userType || '');

const userMenuModalVisible = ref(false)
const approveModalVisible = ref(false)
const rejectModalVisible = ref(false)

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
    <ComfirmationModal modal-title="Approve confirmation" modal-message="Are you sure you want to approve this record?"
     v-model:confirmationModalVisible="approveModalVisible"/>
    
    <ComfirmationModal modal-title="Reject confirmation" modal-message="Are you sure you want to reject this record?"
     v-model:confirmationModalVisible="rejectModalVisible"/>

    <UserMenuModal v-model:userMenuModalVisible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <div class="flex w-full items-stretch gap-2">

      <!--left-->
      <div class="flex flex-col w-[60%] gap-2">
        <LeaveApprovalInputs v-model:selected-date-range="selectedDateRange" v-model:user-name="userName" v-model:user-type="userType"
        v-model:request-name="requestName" v-model:leave-reason="leaveReason"/>

        <LeaveFileAttachment v-model:user-type="userType" v-model:leaveFiles="leaveFiles"/>

        <LeaveLecturerSelection v-if="userType === 'HOP'" v-model:user-type="userType" v-model:lecturerCourses="lecturerCourses"/>

        <div class="flex gap-2 justify-end w-[100%]">
          <ButtonUI word-class="Approve leave" width-class="w-auto" @update:word-class="approveModalVisible = true"/>
          <ButtonUI word-class="Reject leave" width-class="w-auto" @update:word-class="rejectModalVisible = true"/>
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
