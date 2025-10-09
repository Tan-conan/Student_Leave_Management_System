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

// open/close user menu
const userMenuModalVisible = ref(false)

// HOP entered new session name and date
const sessionDate = ref(null)
const sessionName = ref(null)

// HOP entered new holiday name and date
const newHolidayDate = ref(null)
const newHolidayName = ref('')

// current holiday under ongoing session fetch from database
const holidayList = ref([])

// frontend stored user information
const userName = ref('');
const userType = ref('');
const userProgramId = ref('');
const userSessionID = ref('none');
const userSessionStatus = ref('none')
const userSessionName = ref('none')
const userSessionStartDate = ref('none')
const userSessionEndDate = ref('none')

// check got userinfo or not, no back to login page
// fetch current session and holidays
onMounted(() => {

  if(!userInfo) {
      alert('user info unfound, back to login page.')
      router.push('/')
  } else {
      userName.value = userInfo.name || '<user Name>';
      userType.value = userInfo.role || '';
      userProgramId.value = userInfo.program || '';
      userSessionID.value = userInfo.sessionId || 'none';
      userSessionStatus.value = userInfo.sessionStatus || 'none';
      console.log('user type is ' + userType.value);
  }

  if (userSessionID.value === 'none' && userSessionStatus.value === 'none') {
    userSessionName.value = 'none'
    userSessionStartDate.value = 'none'
    userSessionEndDate.value = 'none'
  } else {
    sessionChecker();
    currentSession();
    currentHolidays();
  }
})

// check session is 
async function sessionChecker() {
  try {
    const res = await axios.post('http://localhost:3000/api/mainFunction/sessionChecker', {
      programId: userProgramId.value,
      sessionId: userSessionID.value
    })

    console.log('session id received will be ', res.data.session_id )

    console.log('session_status received will be ', res.data.session_status )

    // still did not detect any activated/unactivated session
    if (res.data.session_id === 'none') {
      userSessionStatus.value = 'none'
      userSessionStatus.value = 'none'

    } else if (res.data.session_status === 'ended') { // found current session is ended
      alert('no current ongoing session, back to login page')
      router.push('/')

    } else { // update current session status
      userSessionID.value = res.data.session_id
      userSessionStatus.value = res.data.session_status
    }

  } catch (err) {
    console.error(err);
    alert('Session error: ' + (err.response?.data?.message || err.message));
  }
}

// user click on one row of holiday will pop up this window
const HolidayDetailModal = ref({
  visible: false,
  title: 'Holiday detail',
  holidayName: '',
  holidayDate: null,
  saveAction: null,
  deleteAction: null,
})

function openHolidayDetailModal(selectedHoliday) {
  HolidayDetailModal.value = {
    visible: true,
    title: 'Holiday Detail',
    holidayName: selectedHoliday.holiday_name,
    holidayDate: [selectedHoliday.starting_date, selectedHoliday.ending_date],
    saveAction: () => openSaveHolidayModal(selectedHoliday.holiday_id),
    deleteAction: () => openDeleteHolidayModal(selectedHoliday.holiday_id),
  }
}

async function openSaveHolidayModal(holidayId) {
  const { holidayName, holidayDate } = HolidayDetailModal.value

  if (!holidayName || !holidayDate || holidayDate.length < 2) {
    confirmationModal.value = {
      visible: true,
      title: 'Fill in the form',
      message: 'Please fill in all the holiday forms!',
      action: null,
      modalType: 'warning',
    }

    HolidayDetailModal.value.visible = false
    return
  }

  HolidayDetailModal.value.visible = false
  confirmationModal.value = {
  visible: true,
  title: 'Warning',
  message: 'Are you sure you want to save this holiday?',
  action: () => saveHoliday(holidayId, holidayName, holidayDate),
  modalType: 'confirmation',
  }

}

async function saveHoliday(holidayId, holidayName, holidayDate) {
  await sessionChecker();
  let startDate = new Date(holidayDate[0])
  let endDate = new Date(holidayDate[1])

  startDate = startDate.toLocaleDateString('en-CA')
  endDate = endDate.toLocaleDateString('en-CA')

  HolidayDetailModal.value.visible = false

  try {

    const res = await axios.post('http://localhost:3000/api/sessionManage/editHoliday', {
      programID: userProgramId.value,
      holidayId: holidayId,
      holidayName: holidayName,
      holidayStartDate: startDate,
      holidayEndDate: endDate,
    })

    await currentHolidays()

    confirmationModal.value = {
      visible: true,
      title: 'Holiday Edition',
      message: res.data.message,
      action: null,
      modalType: 'warning',
    }

  } catch (err) {
    console.error(err);
    alert('Session error: ' + (err.response?.data?.message || err.message));
  }
}

async function openDeleteHolidayModal(holidayId) {
  HolidayDetailModal.value.visible = false
  confirmationModal.value = {
  visible: true,
  title: 'Warning',
  message: 'Are you sure you want to delete this holiday?',
  action: () => deleteHoliday(holidayId),
  modalType: 'confirmation',
  }
}

async function deleteHoliday(holidayId) {
  await sessionChecker();
  try {

    const res = await axios.post('http://localhost:3000/api/sessionManage/deleteHoliday', {
      holidayId: holidayId,
    })

    await currentHolidays()
    
    confirmationModal.value = {
      visible: true,
      title: 'Holiday Deleted',
      message: res.data.message,
      action: null,
      modalType: 'warning',
    }

  } catch (err) {
    console.error(err);
    alert('Session error: ' + (err.response?.data?.message || err.message));
  }
}

const confirmationModal = ref({
  visible: false,
  title: '',
  message: '',
  action: null, //functions
  modalType: 'confirmation',
})

function confirmModal() {
  if (confirmationModal.value.action) {
    confirmationModal.value.action()
  }
  confirmationModal.value.visible = false;
}

function openCreateSessionModal() {

  if (!sessionDate.value || sessionDate.value.length < 2 || !sessionName.value) {
  confirmationModal.value = {
      visible: true,
      title: 'Fill in the form',
      message: 'Please fill in all the session forms!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  confirmationModal.value = {
      visible: true,
      title: 'create session',
      message: 'Are you sure you want to create a new session?',
      action: createSession,
      modalType: 'confirmation'
    }
}

function openAddHolidayModal() {
  if (!newHolidayDate.value || newHolidayDate.value.length < 2 || !newHolidayName.value) {
  confirmationModal.value = {
      visible: true,
      title: 'Fill in the form',
      message: 'Please fill in all the holiday forms!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  confirmationModal.value = {
    visible: true,
    title: 'Add Holiday',
    message: 'Are you sure you want to add a new holiday?',
    action: addHoliday,
    modalType: 'confirmation'
  }
}

async function createSession() {
  await sessionChecker();
  
  const [startDateNum , endDateNum] = sessionDate.value;

  const startDate = new Date(startDateNum)
  const endDate   = new Date(endDateNum)
  console.log(userProgramId.value)

  console.log('typeof startDate:', typeof startDate)
  console.log('typeof startDate:', typeof endDate)

  try{
    const res = await axios.post('http://localhost:3000/api/sessionManage/createSession', {
      sessionName: sessionName.value,
      sessionStartDate: startDate.toLocaleDateString('en-CA'),
      sessionEndDate: endDate.toLocaleDateString('en-CA'),
      programID: userProgramId.value,
    })

    confirmationModal.value = {
    visible: true,
    title: 'session creation',
    message: res.data.message,
    action: null,
    modalType: 'warning'
  }

  if (res.data.successfully) {
    currentSession();
    currentHolidays();
  }

  } catch (err) {
    console.error(err)
    alert('Session error: ' + (err.response?.data?.message || err.message))
  }
  
}

// get current unactivated/ activated session
async function currentSession() {
  try {
    const res = await axios.post('http://localhost:3000/api/sessionManage/fetchCurrentSession', {
      programId: userProgramId.value
    })

    console.log(res.data.session);

    if (res.data.session?.[0]) {
      userSessionName.value = res.data.session[0].session_name
      userSessionStartDate.value = res.data.session[0].starting_date
      userSessionEndDate.value = res.data.session[0].ending_date
      userSessionID.value = res.data.session[0].session_id
      userSessionStatus.value = res.data.session[0].session_status

      userInfo.sessionStatus = res.data.session[0].session_status;
      userInfo.sessionId = res.data.session[0].session_id
      localStorage.setItem('user', JSON.stringify(userInfo));

      userSessionStartDate.value = new Date(userSessionStartDate.value).toLocaleDateString('en-CA')
      userSessionEndDate.value = new Date(userSessionEndDate.value).toLocaleDateString('en-CA')
    }

  } catch (err) {
    console.error(err);
    alert('Session error: ' + (err.response?.data?.message || err.message));
  }
}

async function currentHolidays() {
  try {
    const res = await axios.post('http://localhost:3000/api/sessionManage/fetchHolidays', {
      sessionId: userSessionID.value,
    })

    console.log('holiday is ', res.data.holidays)
    console.log('sessionState is ', res.data.sessionState)

    holidayList.value = res.data.holidays.map((h) => ({
      holiday_id: h.holiday_id,
      holiday_name: h.holiday_name,
      starting_date: new Date(h.starting_date).toLocaleDateString('en-CA'),
      ending_date: new Date(h.ending_date).toLocaleDateString('en-CA'),
    }))

    console.log(holidayList.value)

  } catch (err) {
    console.error(err);
    alert('Session error: ' + (err.response?.data?.message || err.message));
  }
}

async function addHoliday() {
  await sessionChecker();
  try {
  
    const [startDateNum , endDateNum] = newHolidayDate.value;

    const startDate = new Date(startDateNum)
    const endDate   = new Date(endDateNum)

    const res = await axios.post('http://localhost:3000/api/sessionManage/addHoliday', {
      programID: userProgramId.value,
      holidayName: newHolidayName.value,
      holidayStartDate: startDate.toLocaleDateString('en-CA'),
      holidayEndDate: endDate.toLocaleDateString('en-CA'),
    })

    await currentHolidays()

    confirmationModal.value = {
      visible: true,
      title: 'Holiday Added',
      message: res.data.message,
      action: null,
      modalType: 'warning'
    }

  } catch (err) {
    console.error(err);
    alert('Session error: ' + (err.response?.data?.message || err.message));
  }
}

</script>

<template>
  <div class="flex flex-col h-screen">
    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <ComfirmationModal :modal-title="confirmationModal.title" v-model:modelVisible="confirmationModal.visible" :modalType="confirmationModal.modalType"
    :modal-message="confirmationModal.message" @confirm="confirmModal"/>

    <HolidayInformationMOdal v-model:holiday-name="HolidayDetailModal.holidayName" v-model:selected-date-range="HolidayDetailModal.holidayDate"
    v-model:userMenuModalVisible="HolidayDetailModal.visible" @deleteHoliday="HolidayDetailModal.deleteAction"
    @saveHoliday="HolidayDetailModal.saveAction"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <div class="flex gap-2 h-full overflow-hidden">
        <StartNewSessionUI v-model:sessionDate="sessionDate" @startSession="openCreateSessionModal"
        v-model:sessionName="sessionName" :currentSessionName = "userSessionName" 
        :currentSessionStartDate = userSessionStartDate :currentSessionEndDate="userSessionEndDate"
        :currentSessionState="userSessionStatus"/>
        <HolidayManageUI v-model:newHolidayDate="newHolidayDate" @row-clicked="row => openHolidayDetailModal(row)"
         @addHoliday="openAddHolidayModal" :holidayList="holidayList" v-model:newHolidayName="newHolidayName" 
         :userSessionStatus="userSessionStatus"/>
    </div>

  </div>

</template>

<style scoped>

</style>
