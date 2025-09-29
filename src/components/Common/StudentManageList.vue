<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';
import InputUI from '../UI/InputUI.vue';
import { useRouter } from 'vue-router'
import { ref, computed, watch, defineProps } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';
import PendingUserModal from './PendingUserModal.vue';
import ComfirmationModal from './ComfirmationModal.vue';

const router = useRouter()

const studentName = ref('')
const studentSID = ref('')
const studentEmail = ref('')
const studentContactNo = ref('')
const pendingType = ref('')

const props = defineProps({
 userName:{type:String, default: ''},
 userType:{type:String, default: ''},
});

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

// for searching
const searchValue = ref('') // confirmed search value
const searchingValue = ref('') // user still typing searching value

// for filtering
const filterList = ref(['None','Pending','Active','Inactive']) // dropdown filter menu
const filterValue = ref('') // current selected filter keyword

const studentPendingModalVisible = ref(false)
const studentApproveModalVisible = ref(false)
const studentRejectModalVisible = ref(false)

const tableHeads = ref([
    // key better dont have spacing, use _
    {key:'sid' , label:'Student ID'},
    {key:'student_name' , label:'Student Name'},
    {key:'status' , label:'Status'},
    {key:'date_join' , label:'Date Join'},
    {key:'email' , label:'Email'},
    {key:'contact_no' , label:'Contact No'},
])

const studentList = ref([
  { sid: '123456', student_name: 'Alice Tan', status: 'Active', date_join: '2023-09-01', email: 'alice.tan@example.com', contact_no:'0123333333' },
  { sid: '234567', student_name: 'Brian Lee', status: 'Inactive', date_join: '2023-09-15', email: 'brian.lee@example.com', contact_no:'0123333333' },
  { sid: '345678', student_name: 'Chong Mei', status: 'Active', date_join: '2023-10-01', email: 'chong.mei@example.com', contact_no:'0123333333' },
  { sid: '456789', student_name: 'Daniel Wong', status: 'Pending', date_join: '2023-10-10', email: 'daniel.wong@example.com', contact_no:'0123333333' },
  { sid: '567890', student_name: 'Elaine Ng', status: 'Active', date_join: '2023-11-01', email: 'elaine.ng@example.com', contact_no:'0123333333' }
])



// managing user filter, search and sort functions at once
const manageRecords = computed(function(){
    let filteredRecords = studentList.value

    if (filterValue.value && filterValue.value !== 'None') {  // if user got filter then calculate this  
        filteredRecords = filteredRecords.filter(function(row){
          return row.status === filterValue.value || row.type === filterValue.value
        })
    }

    if (searchValue.value) { // if user got search then calculate this  
        filteredRecords = filteredRecords.filter(function(row){
          return row.student_name.toLowerCase().includes(searchValue.value.toLowerCase())
        })
    }

    if (currentSortKey.value) { // if user got sort then calculate this  
        filteredRecords = [...filteredRecords].sort((a,b) => {
            let A = a[currentSortKey.value] // get 'a' row specific value
            let B = b[currentSortKey.value] // get 'b' row specific value

            if (typeof A === 'string') {
                A=A.toLowerCase();
            }
            
            if (typeof B === 'string') {
                B=B.toLowerCase();
            }

            if ( A > B ) {
                return currentSortOrder.value === 'asc' ? 1 : -1
            }
            if ( A < B) {
                return currentSortOrder.value === 'asc' ? -1 : 1
            }
            return 0
        })
    }

    return filteredRecords
})

function backToLogin() {
  router.push('/')
}

function rowClickHandle(row) {
    if (row.status === 'Pending') {
        studentName.value = row.student_name;
        console.log('student name' + studentName.value)
        studentSID.value = row.sid;
        console.log('student SID' + studentSID.value)
        studentEmail.value = row.email;
        console.log('student email' + studentEmail.value)
        studentContactNo.value = row.contact_no;
        pendingType.value = 'Student';
        console.log('pending type' + pendingType.value)
        studentPendingModalVisible.value = true;
    }
    
}

function buttonClicked(val) {
    console.log('a button is clicked which is ' + val)
    if (val === 'Search') {
        searchValue.value = searchingValue.value;
    }
}

watch(searchingValue,(newval) => {
    if (newval === '') {
        searchValue.value = ''
    }
})

function handleApprove() {
  studentPendingModalVisible.value = false
  studentApproveModalVisible.value = true
}

function handleReject() {
  studentPendingModalVisible.value = false
  studentRejectModalVisible.value = true
}

</script>

<template>
<div class="flex flex-col items-center justify-center w-[100%] gap-2">
    <ComfirmationModal modal-title="Approve confirmation" modal-message="Are you sure you want to approve this user?"
     v-model:confirmationModalVisible="studentApproveModalVisible"/>
    
    <ComfirmationModal modal-title="Reject confirmation" modal-message="Are you sure you want to reject this user?"
     v-model:confirmationModalVisible="studentRejectModalVisible"/>

    <PendingUserModal v-model:user-menu-modal-visible="studentPendingModalVisible" :userName="studentName"
     :userSID="studentSID" :userEmail="studentEmail" :contactNo="studentContactNo"
     :pendingType="pendingType" @approveClicked="handleApprove" @rejectClicked="handleReject"/>

    <div class="flex w-[100%] mx-auto px-0 justify-between">

        <div class="flex w-[25%]">
            <ButtonUI word-class="Back to Login" width-class="w-auto" @click="backToLogin"/>
        </div>

        <div class="flex items-center justify-center gap-2 w-[50%]">

            <DropdownUI v-model:dropdown-value = 'filterValue' :options="filterList" placeholder="Filter By"width-class="w-[30%]"/>

            <InputUI v-model:input-value="searchingValue" name-of-placeholder="Search by name" 
            width-class="flex-1" @keyup.enter="buttonClicked('Search')"/>

            <ButtonUI word-class="Search" width-class="w-auto" @update:word-class="buttonClicked"/>

        </div>
    </div>

    <RecordListUI :table-heads="tableHeads" :leave-records="manageRecords" v-model:current-sort-key="currentSortKey"
    v-model:current-sort-order="currentSortOrder" height-class="flex-1"  @row-clicked="rowClickHandle"/>

</div>

</template>
<style>
</style>