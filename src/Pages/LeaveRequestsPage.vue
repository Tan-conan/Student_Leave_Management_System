<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import StudentTopPageUI from '../components/Common/StudentTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import LeaveRequestsList from '../components/Common/LeaveRequestsList.vue';

const route = useRoute()
const topPageTitle = ref('Student leave requests');
const userName = ref(route.query.userName || '<Lecturer/HOP Name>');
const userType = ref(route.query.userType || '');
console.log('user type is ' + userType.value);

const userMenuModalVisible = ref(false)

</script>

<template>
  <div class="flex flex-col gap-2">

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <StudentTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <LeaveRequestsList v-model:user-name="userName"/>

  </div>

</template>

<style scoped>

</style>
