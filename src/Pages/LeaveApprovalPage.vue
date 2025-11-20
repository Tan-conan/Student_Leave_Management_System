<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios.js'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import LeaveFileAttachment from '../components/Common/LeaveFileAttachment.vue';
import sendLecturerList from '../components/Common/sendLecturerList.vue';
import ButtonUI from '../components/UI/ButtonUI.vue';
import LeaveApprovalInputs from '../components/Common/LeaveApprovalInputs.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';
import RemarkUI from '../components/Common/RemarkUI.vue';

const route = useRoute()
const router = useRouter()

const topPageTitle = ref('Student Leave Form');

const userMenuModalVisible = ref(false)

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

// leave id
const leave_id = ref('')
leave_id.value = route.query.leaveId
console.log('leave id is', leave_id.value)


// lecturer approvement info
const lecturerApprovement = ref([])

// frontend stored user information
const userName = ref('');
const userType = ref('');
const userProgramId = ref('');
const userSessionID = ref('');
const userSessionStatus = ref('')
const userCurrentLeave = ref('')
const userPredictedLeave = ref('')
const requestValidLeaveDay = ref('none')

// leave info
const studentName = ref('')
const requestName = ref('')
const leaveStatus = ref('')
const leaveType = ref('')
const submissionDate = ref('')
const leaveReason = ref('');

const startDate = ref('')
const endDate = ref('')

const leaveFiles = ref([])

// check lecturer/hop approved/rejected this leave before or not
const viewerDicision = ref('') // lecturer/hop approved or not

const newMessage = ref('') // new remark

// remarkmessage
const remarkMessages = ref([])

async function fetchLeaveFiles() {
  try {
    const res = await api.get(`/leaveFileManage/getLeaveFiles/${leave_id.value}`);
    if (res.data.files) {
      //file list
      leaveFiles.value = res.data.files.map((f, index) => ({
        id: f.file_id,  // use file id as unique id
        file_name: f.file_name,
        file_url: `/api/leaveFileManage/downloadLeaveFile/${f.file_id}`, // create download id
      }));
    }
  } catch (err) {
    console.error("Error fetching leave files:", err);
  }
}

// send remark
function sendRemarkModal() {
  if (!newMessage.value) {
    confirmationModal.value = {
    visible: true,
    title: 'Send error',
    message: 'The remark cannot be empty!',
    action: '',
    modalType: 'warning'
  }
  return;
  }

  confirmationModal.value = {
    visible: true,
    title: 'Send Confirmation',
    message: 'Are you sure you want to send the remark?',
    action: sendRemark,
    modalType: 'confirmation'
  }
}

async function sendRemark() {
  try{
    const res = await api.post('/remarkManage/sendRemark', {
      remarkMessage: newMessage.value,
      leave_id: leave_id.value
    })

    confirmationModal.value = {
      visible: true,
      title: res.data.successfully ? 'send successfully' : 'Send error',
      message: res.data.message,
      action: '',
      modalType: 'warning'
    }

    newMessage.value =''
    fetchRemark()

  } catch(err){
    alert('error occured when sending remark!');
    return
  }
}

async function fetchRemark() {
  try{
    const res = await api.post('/remarkManage/fetchRemark', {
      leave_id: leave_id.value
    })

    // if got remark
    if (res.data.remarkRows.length > 0) {
      remarkMessages.value = res.data.remarkRows.map((r) => ({
        id: r.remark_id,
        role: r.role,
        name: r.name,
        content: r.remark_content,
        time: new Date(r.remark_date).toLocaleDateString('en-ca')
      }))
    }

  } catch(err){
    console.log('error occured when fetching remark!');
    return
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

async function fetchViewerDicision() {
  try {
    const res = await api.post('/leaveApproveManage/fetchViewerDicision', {
      leave_id: leave_id.value
    })

    viewerDicision.value = res.data.dicision
    console.log('decision value', viewerDicision.value)

  } catch (err) {
    alert('date check failed: ' + (err.response?.data?.message || err.message));
    router.push('/');
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

async function checkStudentLeaveBalanceLA() {
  console.log('starting to check leave balance....')

  try{
    const res = await api.post('/leaveApproveManage/checkStudentLeaveBalanceLA', {
      leave_id: leave_id.value
    })
    
    if (!res.data.successfully) {
      console.log(res.data.message)
      return;
    } else {
      console.log('fetching leave balance complete')
      userCurrentLeave.value = res.data.currentLeave
      userPredictedLeave.value = res.data.predictedLeave
    }

  } catch (err) {
    console.error(err)
    alert('Session error: ' + (err.response?.data?.message || err.message))
  }
  
}

async function fetchLeaveRequestInfo() {
  console.log('starting to check leave balance....')

  try{
    const res = await api.post('/leaveApproveManage/fetchLeaveRequestInfo', {
      leave_id: leave_id.value
    })

    if (res.data.successfully) {
      requestName.value = res.data.leaveInfo[0].leave_name
      leaveType.value = res.data.leaveInfo[0].leave_type
      startDate.value = new Date(res.data.leaveInfo[0].leave_date).toLocaleDateString('en-ca')
      endDate.value = new Date(res.data.leaveInfo[0].end_date).toLocaleDateString('en-ca')
      leaveReason.value = res.data.leaveInfo[0].leave_reason
      leaveStatus.value = res.data.leaveInfo[0].leave_status
      submissionDate.value = new Date(res.data.leaveInfo[0].submission_date).toLocaleDateString('en-ca')
      requestValidLeaveDay.value = res.data.leaveInfo[0].leave_days
      studentName.value = res.data.student_name
    }



  } catch (err) {
    console.error(err)
    alert('Session error: ' + (err.response?.data?.message || err.message))
  }
  
}

async function fetchApprovementLecturers() {
  console.log('starting to check leave balance....')

  try{
    const res = await api.post('/leaveApproveManage/fetchApprovementLecturers', {
      leave_id: leave_id.value
    })

    if (res.data.approveInfo.length !== 0) {
      lecturerApprovement.value = res.data.approveInfo.map((d) => ({
        lecturer_name: d.lecturer_name,
        approve_status: d.approve_status
      })
      )
    }

  } catch (err) {
    console.error(err)
    alert('Session error: ' + (err.response?.data?.message || err.message))
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
  checkStudentLeaveBalanceLA();
  findSessionRange();
  fetchLeaveRequestInfo();
  fetchApprovementLecturers();
  fetchViewerDicision();
  fetchRemark();
  fetchLeaveFiles();

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

function approveLeaveModal() {
  // confirmation
  confirmationModal.value = {
    visible: true,
    title: 'Approve Leave',
    message: 'Are you sure you want to approve this leave?',
    action: approveRequest,
    modalType: 'confirmation'
  }
}

async function approveRequest() {
  try {
    const res = await api.post('/leaveApproveManage/approveRequest', {
      leave_id: leave_id.value,
    })

    confirmationModal.value = {
      visible: true,
      title: res.data.successfully? 'Approve success' : 'Approve failed',
      message: res.data.message,
      action: '',
      modalType: 'warning'
   }

   checkStudentLeaveBalanceLA();
   fetchLeaveRequestInfo();
   fetchApprovementLecturers();
   fetchViewerDicision();

  } catch (err) {
    alert('date check failed: ' + (err.response?.data?.message || err.message));
    router.push('/');
  }
}

function rejectLeaveModal() {
  // confirmation
  confirmationModal.value = {
    visible: true,
    title: 'Approve Leave',
    message: 'Are you sure you want to approve this leave?',
    action: rejectRequest,
    modalType: 'confirmation'
  }
}

async function rejectRequest() {
  try {
    const res = await api.post('/leaveApproveManage/rejectRequest', {
      leave_id: leave_id.value,
    })

    confirmationModal.value = {
      visible: true,
      title: res.data.successfully? 'Reject success' : 'Reject failed',
      message: res.data.message,
      action: '',
      modalType: 'warning'
   }

   checkStudentLeaveBalanceLA();
   fetchLeaveRequestInfo();
   fetchApprovementLecturers();
   fetchViewerDicision();

  } catch (err) {
    alert('date check failed: ' + (err.response?.data?.message || err.message));
    router.push('/');
  }
}

</script>

<template>
  <div class="flex flex-col gap-2 h-screen overflow-hidden">

    <ComfirmationModal :modal-title="confirmationModal.title"
      v-model:modelVisible="confirmationModal.visible"
      :modalType="confirmationModal.modalType"
      :modal-message="confirmationModal.message"
      @confirm="confirmModal" />

    <UserMenuModal v-model:userMenuModalVisible="userMenuModalVisible"
      v-model:user-name="userName" v-model:user-type="userType"
      @update:user-menu-modal-visible="userMenuModalVisible = false" />

    <UserTopPageUI v-model:top-page-title="topPageTitle"
      v-model:user-name="userName" v-model:user-type="userType"
      @menu-clicked="userMenuModalVisible = true" />

   <!-- main container -->
    <div class="flex w-full flex-1 min-h-0 items-stretch gap-2 overflow-hidden">

      <!-- left -->
      <div class="flex flex-col w-[60%] gap-2 overflow-y-auto min-h-0">
        <LeaveApprovalInputs :user-name="userName" :user-type="userType"
        :request-name="requestName" :leave-reason="leaveReason" :userPredictedLeave="userPredictedLeave"
        :submission-date="submissionDate" :start-date="startDate" :end-date="endDate" :request-valid-leave-day="requestValidLeaveDay"
        :leave-type="leaveType" :user-current-leave="userCurrentLeave" :studentName="studentName" :leaveStatus="leaveStatus"/>

        <LeaveFileAttachment pageType="approvement" v-model:leaveFiles="leaveFiles" />
        <sendLecturerList v-if="userType !== 'lecturer'" v-model:user-type="userType" v-model:lecturerCourses="lecturerApprovement" />

        <div class="flex gap-2 justify-end w-full">
          <ButtonUI v-if="(userType !== 'student' && leaveStatus !== 'final approved' && leaveStatus !== 'final rejected' && viewerDicision === false)"
            word-class="Approve leave" width-class="w-auto" @update:word-class="approveLeaveModal" />
          <ButtonUI v-if="(userType !== 'student' && leaveStatus !== 'final approved' && leaveStatus !== 'final rejected' && viewerDicision === false)"
            word-class="Reject leave" width-class="w-auto" @update:word-class="rejectLeaveModal" />
        </div>
      </div>

      <!-- right -->
      <div class="flex flex-col flex-1 gap-2 overflow-hidden bg-ivory min-h-0">
        <RemarkUI class="flex-1 min-h-0" v-model:newMessage="newMessage" @sendMessage="sendRemarkModal" 
        :remark-messages="remarkMessages" :leaveStatus="leaveStatus" :userType="userType"/>
      </div>

    </div>
  </div>
</template>


<style scoped>

</style>