<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import UserTopPageUI from '../components/Common/UserTopPageUI.vue'
import UserMenuModal from '../components/Common/UserMenuModal.vue';
import StudentManageList from '../components/Common/StudentManageList.vue';

const route = useRoute()
const topPageTitle = ref('Student List');
const userName = ref(route.query.userName || '<HOP Name>');
const userType = ref(route.query.userType || '');
console.log('user type is ' + userType.value);

const userMenuModalVisible = ref(false)

</script>

<template>
  <div class="flex flex-col gap-2">

    <UserMenuModal v-model:user-menu-modal-visible="userMenuModalVisible" v-model:user-name="userName" v-model:user-type="userType"
     @update:user-menu-modal-visible="userMenuModalVisible = false"/>

    <UserTopPageUI v-model:top-page-title="topPageTitle" v-model:user-name="userName" v-model:user-type="userType"
     @menu-clicked="userMenuModalVisible = true"/>

    <StudentManageList v-model:user-name="userName" v-model:user-type="userType"/>

  </div>

</template>

<style scoped>

</style>
