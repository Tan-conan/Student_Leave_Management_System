<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios.js'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import MyInformationInputs from '../components/Common/MyInformationInputs.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';
import ButtonUI from '../components/UI/ButtonUI.vue';

const route = useRoute()

const lecturerId = ref('')
lecturerId.value = route.query.lecturerId
console.log('lecturer ID:', lecturerId.value)

const studentId = ref('')
studentId.value = route.query.studentId
console.log('student ID:', studentId.value)

const topPageTitle = ref('User Information');

const router = useRouter()
const userMenuModalVisible = ref(false)

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const viewerInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

// frontend stored viewer information (the user that view the page)
const viewerName = ref('');
const viewerType = ref('');
viewerType.value = route.query.viewerType
const viewerProgramId = ref('');
const viewerSessionID = ref('none');
const viewerSessionStatus = ref('none')
const viewerSessionName = ref('none')

// frontend stored target information (the user that information shown in the page)
const targetName = ref('');
const targetRole = ref('');
const targetProgramName = ref('');
const targetEmail = ref('');
const targetNum = ref('')
const targetDateJoined = ref(null)
const targetSessionName = ref('')
const targetStatus = ref('')

// student only
const currentLeaveBalance = ref('')
const predictedLeaveBalance = ref('')
const sessionLeaveBalance = ref('')

// lecturer only
const assignedClass = ref('')

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

async function checkViewerAndTarget() {
  // if hop viewing lecturer, lecturerid wil pass into this page
  // fetch user information using lecturer id
  if (lecturerId.value && viewerType.value === 'hop') {
  console.log('this is hop viewing lecturer infomation')
  console.log('hop ID:', viewerInfo.id)
  console.log('lecturer ID:', lecturerId.value)
  fecthLecturerInfo()
  }

  // if hop viewing student, studentid wil pass into this page,
  // fetch user information using student id
  if (studentId.value && viewerType.value === 'hop') {
  console.log('this is hop viewing student infomation')
  console.log('hop ID:', viewerInfo.id)
  console.log('student ID:', studentId.value)
  fetchStudentInfo()
  }

  // if found none of id pass, means student/lecturer/hop view their own information, 
  // then fetch the user information using token's user id and user role
  if (!studentId.value && !lecturerId.value) {
  console.log('this is user viewing own information')
  fetchOwnInfo()
  }
}

// check got userinfo or not, no back to login page
// fetch current session and holidays
onMounted(async () => {
  const valid = await verifyToken()
  if (!valid) return

  if(!viewerInfo) {
      alert('user info unfound, back to login page.')
      router.push('/')
  } else {
      viewerName.value = viewerInfo.name || '<user Name>';
      viewerType.value = viewerInfo.role || '';
      viewerProgramId.value = viewerInfo.program || '';
      viewerSessionID.value = viewerInfo.sessionId || 'none';
      viewerSessionStatus.value = viewerInfo.sessionStatus || 'none';
      console.log('user type is ' + viewerType.value);
  }

  await sessionChecker();
  await checkViewerAndTarget();
})

// check session is 
async function sessionChecker() {
  try {
    const res = await api.post('/mainFunction/sessionChecker')

    console.log('session id received will be ', res.data.session_id )

    console.log('session_status received will be ', res.data.session_status )

    console.log('session_name received will be ', res.data.session_name )

    // still did not detect any activated/unactivated session
    if (res.data.session_id === 'none') {
      viewerSessionStatus.value = 'none'
      viewerSessionStatus.value = 'none'
      viewerSessionName.value = 'none'

    } else if (res.data.session_status === 'ended') { // found current session is ended
      alert('no current ongoing session, back to login page')
      router.push('/')

    } else { // update current session status
      viewerSessionID.value = res.data.session_id
      viewerSessionStatus.value = res.data.session_status
      viewerSessionName.value = res.data.session_name
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
  action: null,
  modalType: 'confirmation',
})

function confirmModal() {
  if (confirmationModal.value.action) {
    confirmationModal.value.action()
  }
  confirmationModal.value.visible = false;
}

async function fecthLecturerInfo() {
  console.log('fetch user info using lecturer id', lecturerId.value )
  targetRole.value = 'lecturer'
  targetSessionName.value = viewerSessionName.value

  const res = await api.post('/userManage/fetchLecturerUser',{
    lecturerId: lecturerId.value
  })
  
  if (!res.data.successfully) {
    confirmationModal.value = {
      visible: true,
      title: 'fetching error',
      message: res.data.message,
      action: null,
      modalType: 'warning',
    }
  return;
  }

  targetName.value = res.data.lecturer[0].lecturer_name
  targetEmail.value = res.data.lecturer[0].lecturer_email
  targetNum.value = res.data.lecturer[0].contact_no
  targetDateJoined.value = new Date(res.data.lecturer[0].date_join).getTime();;
  targetStatus.value = res.data.lecturer[0].lecturer_status
  targetProgramName.value = res.data.programName[0].program_name
  assignedClass.value = res.data.assignedCourse
}

async function fetchStudentInfo() {
  console.log('fetch user info using student id', studentId.value )
  targetRole.value = 'student'
  targetSessionName.value = viewerSessionName.value

  const res = await api.post('/userManage/fetchStudentUser',{
    studentId: studentId.value
  })
  
  if (!res.data.successfully) {
    confirmationModal.value = {
      visible: true,
      title: 'fetching error',
      message: res.data.message,
      action: null,
      modalType: 'warning',
    }
  return;
  }

  targetName.value = res.data.students[0].student_name
  targetEmail.value = res.data.students[0].student_email
  targetNum.value = res.data.students[0].contact_no
  targetDateJoined.value = new Date(res.data.students[0].date_join).getTime();;
  targetStatus.value = res.data.students[0].student_status
  targetProgramName.value = res.data.programName[0].program_name
  currentLeaveBalance.value = res.data.currentLeave
  predictedLeaveBalance.value = res.data.predictedLeave
  sessionLeaveBalance.value = res.data.sessionLeave
}

async function fetchOwnInfo() {
  console.log('fetch user info using own id',  )
  targetRole.value = viewerType.value
  targetSessionName.value = viewerSessionName.value

  const res = await api.post('/userManage/fetchOwnUser')

  if (!res.data.successfully) {
    confirmationModal.value = {
      visible: true,
      title: 'fetching error',
      message: res.data.message,
      action: null,
      modalType: 'warning',
    }
  return;
  }

  targetProgramName.value = res.data.programName[0].program_name
  targetNum.value = res.data.user[0].contact_no
  targetDateJoined.value = new Date(res.data.user[0].date_join).getTime();

  if (viewerType.value === 'student') {
    targetName.value = res.data.user[0].student_name
    targetEmail.value = res.data.user[0].student_email
    targetStatus.value = res.data.user[0].student_status
    currentLeaveBalance.value = res.data.currentLeave
    predictedLeaveBalance.value = res.data.predictedLeave
    sessionLeaveBalance.value = res.data.sessionLeave
  }

  if (viewerType.value === 'lecturer') {
    targetName.value = res.data.user[0].lecturer_name
    targetEmail.value = res.data.user[0].lecturer_email
    targetStatus.value = res.data.user[0].lecturer_status
    assignedClass.value = res.data.assignedCourse
  }

  if (viewerType.value === 'hop') {
    targetName.value = res.data.user[0].hop_name
    targetEmail.value = res.data.user[0].hop_email
    targetStatus.value = res.data.user[0].hop_status
  }
  
}

function opensaveUserModal() {
  if (!targetName.value || !targetEmail.value || !targetNum.value || !targetStatus.value || !targetDateJoined.value) {
  confirmationModal.value = {
      visible: true,
      title: 'Fill in the form',
      message: 'Please fill in all the user forms!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  const regex = /^[0-9]{8,15}$/;

  if (!regex.test(targetNum.value)) {
    confirmationModal.value = {
      visible: true,
      title: 'error phone format',
      message: 'invalid phone number format!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(targetEmail.value)) {
    confirmationModal.value = {
      visible: true,
      title: 'error email format',
      message: 'invalid email format!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  confirmationModal.value = {
    visible: true,
    title: 'Save User',
    message: 'Are you sure you want to save user current information?',
    action: saveUserInfo,
    modalType: 'confirmation'
  }
}

async function saveUserInfo() {
  console.log('saving user info')
  await sessionChecker();
  confirmationModal.visible = false;

  let userId = null;

  if (!lecturerId.value && !studentId.value) {
    userId = 'own'
  } else if (lecturerId.value) {
    userId = lecturerId.value;
  } else if (studentId.value) {
    userId = studentId.value;
  }

  const res = await api.post('/userManage/saveUserInfo', {
    userId: userId,
    userRole: targetRole.value,
    userName: targetName.value,
    userEmail: targetEmail.value,
    userNum: targetNum.value,
    userJoinDate: new Date(targetDateJoined.value).toLocaleDateString('en-CA'),
    userStatus: targetStatus.value
  })

  confirmationModal.value = {
    visible: true,
    title: 'saving success',
    message: res.data.message,
    action: null,
    modalType: 'warning',
  }

  // update viewer name
  if (res.data.successfully && userId === 'own') {
    console.log('updating name............')
    console.log(targetName.value)
    viewerInfo.name = targetName.value;
    viewerName.value = targetName.value;
    localStorage.setItem('user', JSON.stringify(viewerInfo));
  }

  await checkViewerAndTarget();
}

</script>

<template>
  <div class="flex flex-col gap-2">
    <ComfirmationModal :modal-title="confirmationModal.title" v-model:modelVisible="confirmationModal.visible" :modalType="confirmationModal.modalType"
    :modal-message="confirmationModal.message" @confirm="confirmModal"/>

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="viewerName" v-model:user-type="viewerType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="viewerName" v-model:user-type="viewerType"
     @menu-clicked="userMenuModalVisible = true"/>

      <MyInformationInputs v-model:viewerType="viewerType" :target-role="targetRole" v-model:targetName="targetName" 
      v-model:targetRole="targetRole" :targetProgramName="targetProgramName" v-model:targetEmail="targetEmail" 
      v-model:targetNum="targetNum" v-model:targetDateJoined="targetDateJoined" :targetSessionName="targetSessionName" 
      v-model:targetStatus="targetStatus" :currentLeaveBalance="currentLeaveBalance" :predictedLeaveBalance="predictedLeaveBalance" 
      :sessionLeaveBalance="sessionLeaveBalance" :assignedClass="assignedClass"/>

    <ButtonUI v-if="viewerType === 'hop'" word-class="Save" width-class="w-[20%]" @click="opensaveUserModal"/>
    

  </div>

</template>

<style scoped>

</style>
