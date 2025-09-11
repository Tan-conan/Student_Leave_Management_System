import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../Pages/LoginPage.vue'
import SignUpPage from '../Pages/SignUpPage.vue'
import StudentRecordPage from '../Pages/StudentRecordPage.vue'
import StudentCourseEnrollment from '../Pages/StudentCourseEnrollment.vue'
import StudentApplyLeavePage from '../Pages/StudentApplyLeavePage.vue'
import UserInformationPage from '../Pages/UserInformationPage.vue'
import LeaveRequestsPage from '../Pages/LeaveRequestsPage.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/Signup', name: 'SignUp', component: SignUpPage },
  { path: '/StudentRecordPage', name: 'StudentRecordPage', component: StudentRecordPage },
  { path: '/StudentCourseEnrollment', name: 'StudentCourseEnrollment', component: StudentCourseEnrollment },
  { path: '/StudentApplyLeavePage', name: 'StudentApplyLeavePage', component: StudentApplyLeavePage },
  { path: '/UserInformationPage', name: 'UserInformationPage', component: UserInformationPage },
  { path: '/LeaveRequestsPage', name: 'LeaveRequestsPage', component: LeaveRequestsPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
