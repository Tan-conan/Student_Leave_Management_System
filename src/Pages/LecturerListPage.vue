<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import LecturerManageList from '../components/Common/LecturerManageList.vue';
import PendingUserModal from '../components/Common/PendingUserModal.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';
import api from '../api/axios.js'

const route = useRoute()
const router = useRouter()
const topPageTitle = ref('Lecturer Account List');

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

// frontend stored user information
const userName = ref('');
const userType = ref('');
const userProgramId = ref('');
const userSessionID = ref('none');
const userSessionStatus = ref('none')
const userSessionName = ref('none')

const lecturerList = ref([])

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
  fetchLecturersList()

  if (userSessionID.value !== 'none' && userSessionStatus.value !== 'none') {
    sessionChecker();
  } else {
    userSessionName.value = 'none'
  }

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

async function fetchLecturersList() {
  try {

    const res = await api.post('/lecturerManage/fetchLecturersList')

    const data = res.data.lecturers

    lecturerList.value = data.map(item => ({
      lecturer_id: item.lecturer_id,
      lecturer_name: item.lecturer_name,
      status: item.lecturer_status,
      date_join: new Date(item.date_join).toLocaleDateString('en-CA'),
      email: item.lecturer_email,
      contact_no: item.contact_no
    }))

  } catch (err) {
    console.error(err);
    alert('fetch lecturer error: ' + (err.response?.data?.message || err.message));
    lecturerList.value = []
  }
}

const lecturerName = ref('')
const lecturerEmail = ref('')
const lecturerContactNo = ref('')
const pendingType = ref('')

const remark = ref('')

const selectedLecturerRow = ref('')

const lecturerPendingModalVisible = ref(false)

const userMenuModalVisible = ref(false)

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

function approveModal() {
  lecturerPendingModalVisible.value = false;
    confirmationModal.value = {
      visible: true,
      title: 'user Approvement',
      message: `Are you sure you want to approve ${selectedLecturerRow.value.lecturer_name} account into activate?`,
      action: approveLecturer,
      modalType: 'confirmation',
    }
}

async function approveLecturer() {
  await sessionChecker();
  try {
    const res = await api.post('/lecturerManage/approveLecturer', {
      lecturer_id: selectedLecturerRow.value.lecturer_id,
      remark: remark.value ? remark.value : 'none',
    })

    confirmationModal.value = {
      visible: true,
      title: 'Lecturer activated',
      message: res.data.message,
      action: null,
      modalType: 'warning'
    }

    fetchLecturersList()

  } catch (err) {
    console.error(err);
    alert('approve lecturer error: ' + (err.response?.data?.message || err.message));
  }
}

function rejectModal() {
  lecturerPendingModalVisible.value = false;
    confirmationModal.value = {
      visible: true,
      title: 'user rejection',
      message: `Are you sure you want to reject ${selectedLecturerRow.value.lecturer_name} account? Rejected account will be deleted.`,
      action: rejectLecturer,
      modalType: 'confirmation',
    }
}

async function rejectLecturer() {
  await sessionChecker();
  try {
    const res = await api.post('/lecturerManage/deleteLecturer', {
      lecturer_id: selectedLecturerRow.value.lecturer_id,
      remark: remark.value ? remark.value : 'none',
    })

    confirmationModal.value = {
      visible: true,
      title: 'Lecturer rejected',
      message: res.data.message,
      action: null,
      modalType: 'warning'
    }

    fetchLecturersList()

  } catch (err) {
    console.error(err);
    alert('approve lecturer error: ' + (err.response?.data?.message || err.message));
  }
}

function rowClickHandle(row) {
  console.log('this is row:', row)
  selectedLecturerRow.value = row
  if (row.status === 'pending') {
    lecturerName.value = row.lecturer_name;
    console.log('lecturer name' + lecturerName.value)
    lecturerEmail.value = row.email;
    console.log('lecturer email' + lecturerEmail.value)
    lecturerContactNo.value = row.contact_no;
    pendingType.value = 'Lecturer';
    console.log('pending type' + pendingType.value)
    lecturerPendingModalVisible.value = true;
  } else {
    router.push({
            path:'/UserInformationPage',
            query: { 
              lecturerId: row.lecturer_id ,
              viewerType: 'hop',
            }
          })
  }
}

</script>

<template>
  <div class="flex flex-col gap-2">
    <ComfirmationModal :modal-title="confirmationModal.title" v-model:modelVisible="confirmationModal.visible" :modalType="confirmationModal.modalType"
    :modal-message="confirmationModal.message" @confirm="confirmModal"/>

    <PendingUserModal v-model:user-menu-modal-visible="lecturerPendingModalVisible" :userName="lecturerName"
     :userEmail="lecturerEmail" :contactNo="lecturerContactNo" v-model:remark="remark"
     :pendingType="pendingType" @approveClicked="approveModal" @rejectClicked="rejectModal"/>

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <LecturerManageList v-model:user-name="userName" v-model:user-type="userType" 
    @row-clicked-handle="row => rowClickHandle(row)" v-model:lecturerList="lecturerList"/>

  </div>

</template>

<style scoped>

</style>
