<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios.js'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import StudentRecordList from '../components/Common/StudentRecordList.vue';
import UserMenuModal from '../components/Common/UserMenuModal.vue';
// student own records page

const route = useRoute()
const router = useRouter()

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

const topPageTitle = ref('Your leave record');

const userMenuModalVisible = ref(false)

// frontend stored user information
const userName = ref('');
const userType = ref('');
const userProgramId = ref('');
const userSessionID = ref('');
const userSessionStatus = ref('')

// student leave records
const leaveRecords = ref([])

async function fetchOwnStudentLeaveRequest() {
  try {
    const res = await api.post('/LRListManage/fetchOwnStudentLeaveRequest')

    if (res.data.successfully) {
      leaveRecords.value = res.data.rows.map((d) => ({
        id: d.leave_id,
        start_date: new Date(d.leave_date).toLocaleDateString('en-ca'),
        end_date: new Date(d.end_date).toLocaleDateString('en-ca'),
        name: d.leave_name,
        type: d.leave_type,
        status: d.leave_status,
        sent_date: new Date(d.submission_date).toLocaleDateString('en-ca')
      }))
    } else {
      leaveRecords.value = []
    }

  } catch (err) {
    console.log('error occured during leave record fetching!', err)
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
  fetchOwnStudentLeaveRequest();

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

function openLeaveRequest(row) {
  console.log('this is the row of', row)
  router.push({
            path:'/LeaveApprovalPage',
            query: { 
              leaveId: row.id ,
            }
          })
}


</script>

<template>
  <div class="flex flex-col gap-2">

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <StudentRecordList v-model:user-name="userName" v-model:user-type="userType" v-model:leaveRecords="leaveRecords" @rowClickedHandle="openLeaveRequest"/>

  </div>

</template>

<style scoped>

</style>
