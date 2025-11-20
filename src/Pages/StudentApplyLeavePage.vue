<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios.js'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import StudentApplyleaveInputs from '../components/Common/StudentApplyleaveInputs.vue';
import LeaveFileAttachment from '../components/Common/LeaveFileAttachment.vue';
import LeaveLecturerSelection from '../components/Common/LeaveLecturerSelection.vue';
import ButtonUI from '../components/UI/ButtonUI.vue';
import ChatBotUI from '../components/Common/ChatBotUI.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';

const router = useRouter()

const topPageTitle = ref('Leave Form');

const userMenuModalVisible = ref(false)

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

// courses of this program
const lecturerCourses = ref([])

// frontend stored user information
const userName = ref('');
const userType = ref('');
const userProgramId = ref('');
const userSessionID = ref('');
const userSessionStatus = ref('')
const userCurrentLeave = ref('')
const userPredictedLeave = ref('')
const requestValidLeaveDay = ref('none')

const requestName = ref('')
const selectedDateRange = ref(null)
const dateRangeValidation = ref('')
const leaveType = ref('')

const leaveReason = ref('');

const leaveFiles = ref([])

async function uploadFiles(leaveId) {
  const formData = new FormData();
  formData.append('leave_id', leaveId);

  for (const file of leaveFiles.value) {
    formData.append('files', file.file_object); 
  }

  try {
    const res = await api.post('/leaveFileManage/uploadLeaveFiles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(res.data.message);
  } catch (err) {
    console.error('Upload failed:', err);
  }
}

async function verifyDateRange(newval) {
  try {

    if (!newval || newval.length < 2) {
      console.log('invalid leave date range')
      return;
    }

    const [startDateNum , endDateNum] = newval;

    const startDate = new Date(startDateNum)
    const endDate   = new Date(endDateNum)

    const res = await api.post('/leaveApplyManage/dateRangeValidation', {
      startDate, endDate
    })

    if (!res.data.successfully && res.data.invalidDay) {
      dateRangeValidation.value = false;
      requestValidLeaveDay.value = res.data.invalidDay
      console.log(res.data.message)
      return;
    } else {
      dateRangeValidation.value = true;
      console.log('calculated valid leave day is' + res.data.validLeaveDay)
      requestValidLeaveDay.value = res.data.validLeaveDay
    }
    

  } catch (err) {
    alert('date check failed: ' + (err.response?.data?.message || err.message));
    router.push('/');
  }
}

async function findSessionRange() {
  try {
    const res = await api.post('/leaveApplyManage/findSessionRange')

    console.log(res.data.sessionStartDate, res.data.sessionEndDate, res.data.sessionName)

    if (!res.data.sessionStartDate || !res.data.sessionEndDate || !res.data.sessionName) {
      topPageTitle.value = 'Leave Form || Session:None'
    } else {
      const startDate = new Date(res.data.sessionStartDate).toLocaleDateString('en-ca')
      const endDate = new Date(res.data.sessionEndDate).toLocaleDateString('en-ca')
      topPageTitle.value = `Leave Form || Session:${res.data.sessionName} (${startDate} - ${endDate})`
    }

  } catch (err) {
    alert('date check failed: ' + (err.response?.data?.message || err.message));
    router.push('/');
  }
}

watch(selectedDateRange, newval => {
  verifyDateRange(newval)
})

// user token verifier
async function verifyToken() {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('No token detected, back to login page.')
    router.push('/')
    return false
  }

  try {
    const res = await api.get('/mainFunction/verify')
    console.log('Token valid, user info:', res.data.user)
    return true
  } catch (err) {
    console.error('Token invalid or expired:', err)
    alert('Session expired, please log in again.')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
    return false
  }
}

// check got userinfo or not, no back to login page
// fetch current session and holidays
onMounted(async () => {
  const valid = await verifyToken()
  if (!valid) return

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

  sessionChecker();
  checkStudentLeaveBalance();
  findSessionRange();
  fetchCurrentCourses();

})

// check session is 
async function sessionChecker() {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('No token found, please login again.')
    router.push('/')
    return
  }

  try {
    const res = await api.post('/mainFunction/sessionChecker')

    // if new token given, replace with old one
    if (res.data.updated && res.data.token) {
      localStorage.setItem('token', res.data.token);
    }

    // still did not detect any activated/unactivated session
    if (res.data.session_id === 'none') {
      userSessionID.value = 'none'
      userSessionStatus.value = 'none'
      userInfo.sessionStatus = userSessionStatus.value
      userInfo.sessionId = userSessionID.value
      localStorage.setItem('user', JSON.stringify(userInfo));

    } else if (res.data.session_status === 'ended') { // found current session is ended
      alert('no current ongoing session, back to login page')
      router.push('/')

    } else { // update current session status
      userSessionID.value = res.data.session_id
      userSessionStatus.value = res.data.session_status
      userInfo.sessionStatus = userSessionStatus.value
      userInfo.sessionId = userSessionID.value
      localStorage.setItem('user', JSON.stringify(userInfo));
    }

  } catch (err) {
    alert('Session check failed: ' + (err.response?.data?.message || err.message));
    router.push('/');
  }
}

async function checkStudentLeaveBalance() {
  console.log('starting to check leave balance....')

  try{
    const res = await api.post('/leaveApplyManage/checkStudentLeaveBalance', {})
    
    if (!res.data.successfully) {
      confirmationModal.value = {
        visible: true,
        title: 'leave balance error',
        message: res.data.message,
        action: null,
        modalType: 'warning'
      }
      return;
    } else {
      console.log('fetching leave balance complete')
      userCurrentLeave.value = res.data.currentLeave
      userPredictedLeave.value = res.data.predictedLeave

      if (res.data.validLeaveDay) {
        requestValidLeaveDay.value = res.data.validLeaveDay
      }
    }

  } catch (err) {
    console.error(err)
    alert('Session error: ' + (err.response?.data?.message || err.message))
  }
  
}

async function fetchCurrentCourses() {
  console.log('now start fetching current courses in this program')
  try {
    const res = await api.post('/leaveApplyManage/fetchCurrentCourses')

    if (!res.data.successfully) {
      lecturerCourses.value = []
    } else {
      lecturerCourses.value = res.data.courses.map((c) => ({
      id: c.lecturer_id,
      course_code: c.course_code,
      course_name: c.course_name,
      lecturer_name: c.lecturer_name,
      checkbox: false,
    }))
    }

    console.log('Fetched course list:', lecturerCourses.value)
  } catch (err) {
    console.error(err);
    alert('Course fetching error: ' + (err.response?.data?.message || err.message));
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

function sendRequestModal() {
  // no empty form allowed

  console.log('files rows', leaveFiles.value)

  console.log('type of leave day', typeof(requestValidLeaveDay.value))
  if (!requestName.value ||  !selectedDateRange.value || selectedDateRange.value.length < 2 || !leaveReason.value
    || !leaveType.value) {
  confirmationModal.value = {
      visible: true,
      title: 'Fill in the form',
      message: 'Please fill in all the leave request form!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  // no error leave day allowed during session
  if (typeof(requestValidLeaveDay.value) !==  'number') {
  confirmationModal.value = {
      visible: true,
      title: 'send request failed',
      message: 'the leave range is not valid!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  // no leave request allowed during session
  if (userSessionStatus.value !==  'activated') {
  confirmationModal.value = {
      visible: true,
      title: 'send request failed',
      message: 'Unable to send a request when a session isnt start!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  // confirmation
  confirmationModal.value = {
    visible: true,
    title: 'Send request',
    message: 'Are you sure you want to Send this request?\n(sending notification email to lecturers and hop might take some time)',
    action: sendRequest,
    modalType: 'confirmation'
  }
}

async function sendRequest() {
  await sessionChecker();
  checkStudentLeaveBalance()

  const checked = lecturerCourses.value.filter(c => c.checkbox);

  if (checked.length ===  0) {
  confirmationModal.value = {
      visible: true,
      title: 'save request failed',
      message: 'no lecturer choosen to send!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  console.log('starting to send request....')

  const [startDateNum , endDateNum] = selectedDateRange.value;

  const startDate = new Date(startDateNum)
  const endDate   = new Date(endDateNum)

  try{
    const res = await api.post('/leaveApplyManage/sendRequest', {
      requestName: requestName.value,
      requestStartDate: startDate.toLocaleDateString('en-CA'),
      requestEndDate: endDate.toLocaleDateString('en-CA'),
      requestType: leaveType.value,
      leaveReason: leaveReason.value,
      requestValidLeaveDay: requestValidLeaveDay.value,
      selectedCourses: checked,
    })

    if (!res.data.successfully) {
      confirmationModal.value = {
        visible: true,
        title: 'Leave request submittion error',
        message: res.data.message,
        action: null,
        modalType: 'warning'
      }
      return;
    }

    if (res.data.successfully) {
      confirmationModal.value = {
        visible: true,
        title: 'Leave request submission complete',
        message: res.data.message,
        action: null,
        modalType: 'warning'
      }
      checkStudentLeaveBalance();
      uploadFiles(res.data.leaveId)
    }

  } catch (err) {
    console.error(err)
    alert('Session error: ' + (err.response?.data?.message || err.message))
  }
  
}

const confirmFileModalVisible = ref(false)

watch(selectedDateRange, (newVal) => {
  let startDate = new Date(selectedDateRange.value[0])
  let endDate = new Date(selectedDateRange.value[1])
  
  console.log(startDate.toLocaleDateString())
  console.log(endDate.toLocaleDateString())   

})

</script>

<template>
  <div class="flex flex-col gap-2 h-screen overflow-hidden">
    <ComfirmationModal :modal-title="confirmationModal.title" v-model:modelVisible="confirmationModal.visible" :modalType="confirmationModal.modalType"
    :modal-message="confirmationModal.message" @confirm="confirmModal"/>

    <UserMenuModal v-model:userMenuModalVisible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

     <!-- main container -->
    <div class="flex w-full flex-1 min-h-0 items-stretch gap-2 overflow-hidden">

      <!--left-->
      <div class="flex flex-col w-[60%] gap-2 overflow-y-auto min-h-0 [scrollbar-width:thin]">
        <StudentApplyleaveInputs v-model:selected-date-range="selectedDateRange" v-model:user-name="userName" 
        v-model:user-type="userType" v-model:request-name="requestName" v-model:leave-reason="leaveReason"
        v-model:leaveType="leaveType" :userCurrentLeave="userCurrentLeave" :userPredictedLeave="userPredictedLeave"
        :requestValidLeaveDay="requestValidLeaveDay"/>

        <LeaveFileAttachment v-model:user-type="userType" v-model:confirmFileModalVisible="confirmFileModalVisible"
        v-model:leaveFiles="leaveFiles"/>

        <LeaveLecturerSelection v-model:user-type="userType" v-model:lecturerCourses="lecturerCourses"/>

        <div class="flex gap-2 justify-end w-full">
          <ButtonUI word-class="Send leave record" width-class="w-auto" @update:word-class="sendRequestModal"/>
        </div>

      </div>

      <!--right-->
      <div class="flex flex-col flex-1 gap-2 overflow-hidden bg-ivory min-h-0">
        <ChatBotUI/>
    
      </div>

    </div>

  </div>

</template>

<style scoped>

</style>
