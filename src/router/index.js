import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../Pages/LoginPage.vue'
import SignUpPage from '../Pages/SignUpPage.vue'
import StudentRecordPage from '../Pages/StudentRecordPage.vue'
import StudentCourseEnrollment from '../Pages/StudentCourseEnrollment.vue'
import StudentApplyLeavePage from '../Pages/StudentApplyLeavePage.vue'
import UserInformationPage from '../Pages/UserInformationPage.vue'
import LeaveRequestsPage from '../Pages/LeaveRequestsPage.vue'
import LeaveApprovalPage from '../Pages/LeaveApprovalPage.vue'
import StudentListPage from '../Pages/StudentListPage.vue'
import LecturerListPage from '../Pages/LecturerListPage.vue'
import ManageCoursePage from '../Pages/ManageCoursePage.vue'
import SessionManagePage from '../Pages/SessionManagePage.vue'
import HOPReportPage from '../Pages/HOPReportPage.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/Signup', name: 'SignUp', component: SignUpPage },
  { path: '/StudentRecordPage', name: 'StudentRecordPage', component: StudentRecordPage },
  { path: '/StudentCourseEnrollment', name: 'StudentCourseEnrollment', component: StudentCourseEnrollment },
  { path: '/StudentApplyLeavePage', name: 'StudentApplyLeavePage', component: StudentApplyLeavePage },
  { path: '/UserInformationPage', name: 'UserInformationPage', component: UserInformationPage },
  { path: '/LeaveRequestsPage', name: 'LeaveRequestsPage', component: LeaveRequestsPage },
  { path: '/LeaveApprovalPage', name: 'LeaveApprovalPage', component: LeaveApprovalPage },
  { path: '/StudentListPage', name: 'StudentListPage', component: StudentListPage },
  { path: '/LecturerListPage', name: 'LecturerListPage', component: LecturerListPage },
  { path: '/ManageCoursePage', name: 'ManageCoursePage', component: ManageCoursePage },
  { path: '/SessionManagePage', name: 'SessionManagePage', component: SessionManagePage },
  { path: '/HOPReportPage', name: 'HOPReportPage', component: HOPReportPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
