<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import StartNewSessionUI from '../components/Common/StartNewSessionUI.vue';
import HolidayManageUI from '../components/Common/HolidayManageUI.vue';
import HolidayInformationMOdal from '../components/Common/HolidayInformationMOdal.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';

const route = useRoute()

const topPageTitle = ref('Session Management');

const router = useRouter()

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

const userName = ref('');
const userType = ref('');
const userProgramId = ref('');

onMounted(() => {

    if(!userInfo) {
        alert('user info unfound, back to login page.')
        router.push('/')
    } else {
        userName.value = userInfo.name || '<user Name>';
        userType.value = userInfo.role || '';
        userProgramId.value = userInfo.program || '';
        console.log('user type is ' + userType.value);
    }
})

const userMenuModalVisible = ref(false)
const holidayMenuModalVisible = ref(false)
const startSesionModalVisible = ref(false)
const addHolidayModalVisible = ref(false)
const deleteHolidayModalVisible = ref(false)
const saveHolidayModalVisible = ref(false)

const sessionDate = ref(null)
const sessionName = ref(null)

const holidayDate = ref(null)

const selectedHolidayName = ref('')
const selectedholidayDate = ref(null)

function deleteHolidayHandle() {
  holidayMenuModalVisible.value = false;
  deleteHolidayModalVisible.value = true;
}

function saveHolidayHandle() {
  holidayMenuModalVisible.value = false;
  saveHolidayModalVisible.value = true;
}

async function createSession() {
  const [startDateNum , endDateNum] = sessionDate.value;

  const startDate = new Date(startDateNum)
  const endDate   = new Date(endDateNum)

  console.log('typeof startDate:', typeof startDate)
  console.log('typeof startDate:', typeof endDate)
  try{
    const res = await axios.post('http://localhost:3000/api/sessionManage/createSession', {
      sessionName: sessionName.value,
      sessionStartDate: startDate.toLocaleDateString('en-CA'),
      sessionEndDate: endDate.toLocaleDateString('en-CA'),
      programID: userProgramId.value,
    })

    alert('session information: ' + res.data.message)
  } catch (err) {
    console.error(err)
    alert('Session error: ' + (err.response?.data?.message || err.message))
  }
  
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <ComfirmationModal modal-title="Start Session" modal-message="are you SURE you want to start the session? ONCE START UNABLE TO REDO" 
     v-model:confirmationModalVisible="startSesionModalVisible"/>

    <ComfirmationModal modal-title="Add Holiday" modal-message="are you sure you want to add the new holiday?" 
     v-model:confirmationModalVisible="addHolidayModalVisible"/>

    <ComfirmationModal modal-title="Delete Holiday" modal-message="are you sure you want to delete this holiday?" 
     v-model:confirmationModalVisible="deleteHolidayModalVisible"/>

    <ComfirmationModal modal-title="save Holiday" modal-message="are you sure you want to save this holiday?" 
     v-model:confirmationModalVisible="saveHolidayModalVisible"/>

    <HolidayInformationMOdal v-model:user-menu-modal-visible="holidayMenuModalVisible" :holiday-name="selectedHolidayName"
     :selected-date-range="selectedholidayDate" @deleteHoliday="deleteHolidayHandle" @saveHoliday="saveHolidayHandle"/>

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <div class="flex gap-2 h-full overflow-hidden">
        <StartNewSessionUI v-model:sessionDate="sessionDate" @startSession="createSession"
        v-model:sessionName="sessionName"/>
        <HolidayManageUI v-model:holidayDate="holidayDate" v-model:holidayMenuModalVisible="holidayMenuModalVisible"
        v-model:selectedHolidayDate="selectedholidayDate" @addHoliday="addHolidayModalVisible = true"
        v-model:selectedHolidayName="selectedHolidayName"/>
    </div>

  </div>

</template>

<style scoped>

</style>
