<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import StudentTopPageUI from '../components/Common/StudentTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import StudentApplyleaveInputs from '../components/Common/StudentApplyleaveInputs.vue';
import LeaveFileAttachment from '../components/Common/LeaveFileAttachment.vue';
import LeaveLecturerSelection from '../components/Common/LeaveLecturerSelection.vue';
import ButtonUI from '../components/UI/ButtonUI.vue';
import ChatBotUI from '../components/Common/ChatBotUI.vue';

const route = useRoute()
const topPageTitle = ref('Leave Form');
const userName = ref(route.query.userName || '<Student Name>');
const userType = ref(route.query.userType || '');
console.log('user type is ' + userType.value);

const userMenuModalVisible = ref(false)
const requestName = ref('')
const selectedDateRange = ref(null)

const leaveReason = ref('');

watch(selectedDateRange, (newVal) => {
  let startDate = new Date(selectedDateRange.value[0])
  let endDate = new Date(selectedDateRange.value[1])
  
  console.log(startDate.toLocaleDateString())
  console.log(endDate.toLocaleDateString())   

})

</script>

<template>
  <div class="flex flex-col gap-2">

    <UserMenuModal v-model:userMenuModalVisible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <StudentTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <div class="flex w-full items-stretch gap-2">

      <!--left-->
      <div class="flex flex-col w-[60%] gap-2">
        <StudentApplyleaveInputs v-model:selected-date-range="selectedDateRange" 
        v-model:request-name="requestName" v-model:leave-reason="leaveReason"/>

        <LeaveFileAttachment/>

        <LeaveLecturerSelection/>

        <div class="flex gap-2 justify-end w-[100%]">
          <ButtonUI word-class="Save leave record" width-class="w-auto"/>
          <ButtonUI word-class="Send leave record" width-class="w-auto"/>
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
