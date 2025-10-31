<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios.js'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import ReportList from '../components/Common/ReportList.vue';

const route = useRoute()
const router = useRouter()

const topPageTitle = ref('Report List');

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

const userMenuModalVisible = ref(false)

// frontend stored user information
const userName = ref('');
const userType = ref('');
const userProgramId = ref('');
const userSessionID = ref('');
const userSessionStatus = ref('')

const sessionList = ref([])
const selectedSession = ref('')
const sessionLeaveBalance = ref('none')

// student leave infos list
const reportList = ref([])

watch(selectedSession, (newVal, oldVal) => {
  console.log('selected:', newVal)
  fetchLeaveReport()
})

async function fetchSessionList() {
  try {
    const res = await api.post('/reportManage/fetchSessionList')

    if (res.data.existingSessions) {
      sessionList.value = res.data.existingSessions.map(row => row.session_name);
    }

  } catch (err) {
    console.error('error occured:', err)
 
  }
}

async function fetchLeaveReport() {
  try {
    const res = await api.post('/reportManage/fetchLeaveReport',{
      sessionName: selectedSession.value
    })

    if (res.data.reportRows) {
      console.log(res.data.reportRows)
      reportList.value = res.data.reportRows.map(row => ({
        sid: row.student_id,
        student_name: row.student_name,
        total_leave_days: row.total_leave_days,
        current_leave: row.current_leave,
        predicted_leave: row.predicted_leave,
        attendance_rate: row.attendance_rate,
        email: row.student_email
      }));
      sessionLeaveBalance.value = res.data.total_session_days
      console.log(sessionLeaveBalance.value)
    }

  } catch (err) {
    console.error('error occured:', err)
  }
}

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
  fetchSessionList();
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

</script>

<template>
  <div class="flex flex-col gap-2">

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <ReportList v-model:user-name="userName" v-model:user-type="userType" v-model:reportList="reportList" 
    :session-list="sessionList" v-model:selectedSession="selectedSession" :sessionLeaveBalance="sessionLeaveBalance"/>

  </div>

</template>

<style scoped>

</style>
