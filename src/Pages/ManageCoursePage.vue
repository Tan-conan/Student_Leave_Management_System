<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios.js'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import CourseList from '../components/Common/CourseList.vue';
import AddNewCourse from '../components/Common/AddNewCourse.vue';
import LecturerAssignCourse from '../components/Common/LecturerAssignCourse.vue';
import CourseInformationModal from '../components/Common/CourseInformationModal.vue';
import ComfirmationModal from '../components/Common/ComfirmationModal.vue';

const route = useRoute()
const router = useRouter()
const topPageTitle = ref('Course Management');

const storedUserInfo = localStorage.getItem('user') // fetch local storage user data
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null // if info exist parse it else return null

// frontend stored user information
const userName = ref('');
const userType = ref('');
const userProgramId = ref('');
const userSessionID = ref('');
const userSessionStatus = ref('')

// course assignment information
const selectedCourse = ref('')
const selectedLecturer = ref('')

// course assignment lists
const assignCoursesList = ref([])
const assignLecturersList = ref([])

// assignlecturerlist but for edit course modal
const assignLecturersListCM = ref([])

// modalvisibles
const userMenuModalVisible = ref(false)
const courseMenuModalVisible = ref(false)

// Information of new course wish to add
const newCourseName = ref('')
const newCourseCode = ref('')

// information of selected course in list
const courseName = ref('')
const courseCode = ref('')
const courseLecturer = ref('')
// original course informations
const storedcourseName = ref('')
const storedcourseCode = ref('')

watch(courseMenuModalVisible, newVal => {
  console.log('visible?', courseMenuModalVisible.value)
  if (newVal === true) {
    storedcourseName.value = courseName.value;
    storedcourseCode.value = courseCode.value;
    console.log('stored course name will be', storedcourseName.value)
    console.log('stored course code will be', storedcourseCode.value)
  }
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
  fetchCurrentCourses();
  fetchCurrentLecturers();

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

function CreateCourseModal() {
  // no empty form allowed
  if (!newCourseName.value ||  !newCourseCode.value) {
  confirmationModal.value = {
      visible: true,
      title: 'Fill in the form',
      message: 'Please fill in all the course creating forms!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  // no course creation allowed during session
  if (userSessionStatus.value ===  'activated') {
  confirmationModal.value = {
      visible: true,
      title: 'create course failed',
      message: 'Unable to create new course when a session is start!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  // confirmation
  confirmationModal.value = {
    visible: true,
    title: 'Add Course',
    message: 'Are you sure you want to add a new course?',
    action: createCourse,
    modalType: 'confirmation'
  }
}

async function createCourse() {
  await sessionChecker();
  console.log('now starting creating course:', newCourseName.value, newCourseCode.value)
  const res = await api.post('/courseManage/createCourse', {
      courseName: newCourseName.value,
      courseCode: newCourseCode.value,
    }
  )

  confirmationModal.value = {
    visible: true,
    title: res.data.successfully? 'Creation Completed' :  'Creation failed',
    message: res.data.message,
    action: null,
    modalType: 'warning',
  }

  fetchCurrentCourses();
}

function assignLecModal() {
  console.log(selectedCourse.value, 'aaaaaaaaa', selectedLecturer.value)

  // empty form not allowed
  if (!selectedCourse.value ||  !selectedLecturer.value) {
  confirmationModal.value = {
      visible: true,
      title: 'Fill in the form',
      message: 'Please fill in all the course assign forms!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  // assign lecturers when no session available is not allowed
  if (userSessionStatus.value === 'none' || userSessionStatus.value === 'ended' ) {
  confirmationModal.value = {
      visible: true,
      title: 'assign failed',
      message: 'Unable to assign lecturers when there is no coming soon/ongoing session!',
      action: null,
      modalType: 'warning',
    }
  return;
  }

  confirmationModal.value = {
    visible: true,
    title: 'Assign Course',
    message: `Are you sure you want to assign lecturer ${selectedLecturer.value} to course ${selectedCourse.value}?`,
    action: assignLecturer,
    modalType: 'confirmation'
  }
}

async function assignLecturer() {
  await sessionChecker();

  const str = selectedLecturer.value;
  const match = str.match(/\(ID:\s*(\d+)\)/);
  const lecturer_id = match ? match[1] : null;

  console.log('now starting assigning course:', selectedCourse.value, lecturer_id)
  
  try {
    const res = await api.post('/courseManage/assignLecturer', {
      courseName: selectedCourse.value,
      lecturer_id: lecturer_id,
    })

    confirmationModal.value = {
      visible: true,
      title: res.data.successfully ? 'assign success' : 'assign error',
      message: res.data.message,
      action: null,
      modalType: 'warning',
    }

    fetchCurrentCourses();
    selectedCourse.value = '';
    selectedLecturer.value = '';

  } catch (err) {
    console.error(err);
    alert('Course fetching error: ' + (err.response?.data?.message || err.message));
  }
}

function deleteCourseModal() {
  courseMenuModalVisible.value = false;

  // only allowed to delete course when no session available and no coming session available
  if (userSessionStatus.value !== 'none') {
    confirmationModal.value = {
    visible: true,
    title: 'Delete Failed',
    message: `Unable to delete a course when a session is ongoing or coming soon!`,
    action: null,
    modalType: 'warning'
  }
  return;
  }

  // original course name unstored due to various reasons
  if (!storedcourseName.value) {
    confirmationModal.value = {
    visible: true,
    title: 'Delete Failed',
    message: `error on course name!`,
    action: null,
    modalType: 'warning'
  }
  return;
  }

  confirmationModal.value = {
    visible: true,
    title: 'Delete Course',
    message: `Are you sure you want to delete course ${courseName.value}?`,
    action: deleteCourse,
    modalType: 'confirmation'
  }
}

// actually not delete just flag into false
async function deleteCourse() {
  await sessionChecker();

  console.log('now starting delete course:', storedcourseName.value)

  try {
    const res = await api.post('/courseManage/deleteCourse', {
      courseName: storedcourseName.value,
    })

    confirmationModal.value = {
      visible: true,
      title: 'Delete Failed',
      message: res.data.message,
      action: null,
      modalType: 'warning'
    }

    fetchCurrentCourses();
    storedcourseName.value = '';
    console.log('stored course name after deletion will be', storedcourseName.value)

  } catch (err) {
    console.error(err);
    alert('Course fetching error: ' + (err.response?.data?.message || err.message));
  }
}

function saveCourseModal() {
  courseMenuModalVisible.value = false;

  // change course name or code is not allowed during session
  if ( userSessionStatus.value === 'activated' && 
  (storedcourseName.value !== courseName.value || storedcourseCode.value !== courseCode.value) ) {
    confirmationModal.value = {
    visible: true,
    title: 'Save Failed',
    message: `Unable to change the course name or code when a session is ongoing!`,
    action: null,
    modalType: 'warning'
  }
  return;
  }

  // empty form not allowed
  if (!courseName.value || !courseCode.value || !courseLecturer.value ) {
    confirmationModal.value = {
    visible: true,
    title: 'Save Failed',
    message: `course name/code cannot be empty!`,
    action: null,
    modalType: 'warning'
  }
  return;
  }

  confirmationModal.value = {
    visible: true,
    title: 'Delete Course',
    message: `Are you sure you want to save course ${courseName.value}?`,
    action: saveCourse,
    modalType: 'confirmation'
  }
}

async function saveCourse() {
  
  await sessionChecker();

  console.log('now starting save course:', storedcourseName.value)

  let lecturer_id

  // detect and give corresponding lecturerId based on assign lecturer 
  if (courseLecturer.value === 'none') {
    lecturer_id = 'none'
  } else {
    const str = courseLecturer.value;
    const match = str.match(/\(ID:\s*(\d+)\)/);
    lecturer_id = match ? match[1] : null;
  }
  
  console.log('storedcourname is ', storedcourseName.value)
  console.log('coursename is ', courseName.value)
  console.log('course lecturer id is ', lecturer_id)

  try {
    const res = await api.post('/courseManage/saveCourse', {
      courseName: storedcourseName.value,
      newCourseName: courseName.value,
      newCourseCode: courseCode.value,
      lecturerId: lecturer_id,
    })

    confirmationModal.value = {
      visible: true,
      title: res.data.successfully? 'save Successfully' : 'save failed',
      message: res.data.message,
      action: null,
      modalType: 'warning'
    }

    fetchCurrentCourses();
    storedcourseName.value = '';
    console.log('stored course name after deletion will be', storedcourseName.value)

  } catch (err) {
    console.error(err);
    alert('Course fetching error: ' + (err.response?.data?.message || err.message));
  }
}

const courseList = ref([])

async function fetchCurrentCourses() {
  console.log('now start fetching current courses in this program')
  try {
    const res = await api.post('/courseManage/fetchCurrentCourses')

    if (!res.data.succesfully) {
      courseList.value = []
      assignCoursesList.value = []
    }

    courseList.value = res.data.courses.map((c) => ({
      id: c.course_id,
      course_code: c.course_code,
      course_name: c.course_name,
      current_lecturer: c.lecturer_name === 'None' || c.lecturer_id === 'None' ? 'none' : `${c.lecturer_name} (ID: ${c.lecturer_id})`,
    }))

    assignCoursesList.value = res.data.coursesName.map(c => c.course_name)

    console.log('Fetched course list:', courseList.value)
  } catch (err) {
    console.error(err);
    alert('Course fetching error: ' + (err.response?.data?.message || err.message));
  }
}

async function fetchCurrentLecturers() {
  try {
    const res = await api.post('/courseManage/fetchLecturers')

    assignLecturersList.value = res.data.lecturers.map(l => `${l.lecturer_name} (ID: ${l.lecturer_id})`)

    assignLecturersListCM.value = ['none', ...assignLecturersList.value];

    console.log('Fetched lecturers list:', assignLecturersList.value)
  } catch (err) {
    console.error(err);
    alert('lecturer fetching error: ' + (err.response?.data?.message || err.message));
  }
}

</script>

<template>
  <div class="flex flex-col gap-2 h-screen">
    <ComfirmationModal :modal-title="confirmationModal.title" v-model:modelVisible="confirmationModal.visible" :modalType="confirmationModal.modalType"
    :modal-message="confirmationModal.message" @confirm="confirmModal"/>

    <CourseInformationModal v-model:user-menu-modal-visible="courseMenuModalVisible" v-model:courseName="courseName" :lecturerNameList="assignLecturersListCM"
     v-model:courseCode="courseCode" v-model:courseLecturer="courseLecturer" @delete="deleteCourseModal" @save="saveCourseModal"/>

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <CourseList v-model:user-name="userName" v-model:user-type="userType" v-model:courseName="courseName"
     v-model:courseCode="courseCode" v-model:courseLecturer="courseLecturer" v-model:courseList="courseList"
     v-model:courseMenuModalVisible="courseMenuModalVisible"/>

    <div class="flex gap-2 h-full">
        <AddNewCourse @create-course="CreateCourseModal" v-model:newCourseName="newCourseName"
        v-model:newCourseCode="newCourseCode"/>
        <LecturerAssignCourse @assign-lecturer="assignLecModal" v-model:selectedCourse="selectedCourse"
        v-model:selectedLecturer="selectedLecturer" :lecturers-list="assignLecturersList" :courses-list="assignCoursesList"/>
    </div>

  </div>

</template>

<style scoped>

</style>
