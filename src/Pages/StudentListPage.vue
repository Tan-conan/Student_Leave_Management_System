<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import StudentManageList from '../components/Common/StudentManageList.vue';
import PendingUserModal from '../components/Common/PendingUserModal.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const topPageTitle = ref('Student Account List');

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

// frontend stored user information
const userName = ref('');
const userType = ref('');
const userProgramId = ref('');
const userSessionID = ref('none');
const userSessionStatus = ref('none')
const userSessionName = ref('none')

const studentList = ref([])

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
  fetchStudentsList();

  if (userSessionID.value !== 'none' && userSessionStatus.value !== 'none') {
    sessionChecker();
  } else {
    userSessionName.value = 'none'
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

async function fetchStudentsList() {
  try {

    const res = await axios.post('http://localhost:3000/api/studentManage/fetchStudentsList', {
      programID: userProgramId.value,
    })

    const data = res.data.students

    studentList.value = data.map(item => ({
      student_id: item.student_id,
      student_name: item.student_name,
      status: item.student_status,
      date_join: new Date(item.date_join).toLocaleDateString('en-CA'),
      email: item.student_email,
      contact_no: item.contact_no
    }))

  } catch (err) {
    console.error(err);
    alert('fetch student error: ' + (err.response?.data?.message || err.message));
    lecturerList.value = []
  }
}

const studentName = ref('')
const studentEmail = ref('')
const studentContactNo = ref('')
const pendingType = ref('')

const selectedStudentRow = ref('')

const studentPendingModalVisible = ref(false)

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
  studentPendingModalVisible.value = false;
    confirmationModal.value = {
      visible: true,
      title: 'user Approvement',
      message: `Are you sure you want to approve ${selectedStudentRow.value.student_name} account into activate?`,
      action: approveStudent,
      modalType: 'confirmation',
    }
}

async function approveStudent() {
  await sessionChecker();
  try {
    const res = await axios.post('http://localhost:3000/api/studentManage/approveStudent', {
      student_id: selectedStudentRow.value.student_id,
    })

    confirmationModal.value = {
      visible: true,
      title: 'Student activated',
      message: res.data.message,
      action: null,
      modalType: 'warning'
    }

    fetchStudentsList()

  } catch (err) {
    console.error(err);
    alert('approve student error: ' + (err.response?.data?.message || err.message));
  }
}

function rejectModal() {
  studentPendingModalVisible.value = false;
    confirmationModal.value = {
      visible: true,
      title: 'user rejection',
      message: `Are you sure you want to reject ${selectedStudentRow.value.student_name} account? Rejected account will be deleted.`,
      action: rejectStudent,
      modalType: 'confirmation',
    }
}

async function rejectStudent() {
  await sessionChecker();
  try {
    const res = await axios.post('http://localhost:3000/api/studentManage/deleteStudent', {
      student_id: selectedStudentRow.value.student_id,
    })

    confirmationModal.value = {
      visible: true,
      title: 'Student rejected',
      message: res.data.message,
      action: null,
      modalType: 'warning'
    }

    fetchStudentsList()

  } catch (err) {
    console.error(err);
    alert('approve student error: ' + (err.response?.data?.message || err.message));
  }
}

function rowClickHandle(row) {
  console.log('this is row:', row)
  selectedStudentRow.value = row
  if (row.status === 'pending') {
    studentName.value = row.student_name;
    console.log('student name' + studentName.value)
    studentEmail.value = row.email;
    console.log('student email' + studentEmail.value)
    studentContactNo.value = row.contact_no;
    pendingType.value = 'Lecturer';
    console.log('pending type' + pendingType.value)
    studentPendingModalVisible.value = true;
  }
    
}

</script>

<template>
  <div class="flex flex-col gap-2">
    <ComfirmationModal :modal-title="confirmationModal.title" v-model:modelVisible="confirmationModal.visible" :modalType="confirmationModal.modalType"
    :modal-message="confirmationModal.message" @confirm="confirmModal"/>

    <PendingUserModal v-model:user-menu-modal-visible="studentPendingModalVisible" :userName="studentName"
     :userEmail="studentEmail" :contactNo="studentContactNo"
     :pendingType="pendingType" @approveClicked="approveModal" @rejectClicked="rejectModal"/>

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <StudentManageList v-model:user-name="userName" v-model:user-type="userType"
    @row-clicked-handle="row => rowClickHandle(row)" v-model:studentList="studentList"/>

  </div>

</template>

<style scoped>

</style>
