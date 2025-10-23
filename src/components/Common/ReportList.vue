<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';
import InputUI from '../UI/InputUI.vue';
import { useRouter } from 'vue-router'
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';
import PendingUserModal from './PendingUserModal.vue';

const router = useRouter()

const studentName = ref('')
const studentSID = ref('')
const studentEmail = ref('')
const studentContactNo = ref('')
const pendingType = ref('')

const props = defineProps({
 userName:{type:String, default: ''},
 selectedSession:{type:String, default: ''},
 userType:{type:String, default: ''},
 sessionList:{type:Array, default: () => []},
 reportList:{type:Array, default: () => []},
});

const emit = defineEmits(['update:selectedSession'])

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

// for searching
const searchValue = ref('') // confirmed search value
const searchingValue = ref('') // user still typing searching value

// for filtering
const filterValue = ref('') // current selected filter keyword

const studentPendingModalVisible = ref(false)

const tableHeads = ref([
    // key better dont have spacing, use _
    {key:'sid' , label:'Student ID'},
    {key:'student_name' , label:'Student Name'},
    {key:'leave_count' , label:'Leave Count'},
    {key:'current_leave' , label:'Current Leave'},
    {key:'predicted_leave' , label:'Predicted Leave'},
    {key:'email' , label:'Email'},
])



// managing user filter, search and sort functions at once
const manageRecords = computed(function(){
    let filteredRecords = props.reportList

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

</script>

<template>
<div class="flex flex-col items-center justify-center w-[100%] gap-2">

    <PendingUserModal v-model:user-menu-modal-visible="studentPendingModalVisible" :userName="studentName"
     :userSID="studentSID" :userEmail="studentEmail" :contactNo="studentContactNo"
     :pendingType="pendingType"/>

    <div class="flex w-[100%] mx-auto px-0 justify-between">

        <div class="flex w-[25%]">
            <ButtonUI word-class="Back to Login" width-class="w-auto" @click="backToLogin"/>
        </div>

        <div class="flex items-center justify-center gap-2 w-[50%]">

            <DropdownUI :dropdown-value = "selectedSession" :options="props.sessionList" 
            placeholder="Select session"width-class="w-[50%]" @update:dropdown-value="val => emit('update:selectedSession',val)"/>

            <InputUI v-model:input-value="searchingValue" name-of-placeholder="Search by name" 
            width-class="flex-1" @keyup.enter="buttonClicked('Search')"/>

            <ButtonUI word-class="Search" width-class="w-auto" @update:word-class="buttonClicked"/>

        </div>
    </div>

    <RecordListUI :table-heads="tableHeads" :leave-records="manageRecords" v-model:current-sort-key="currentSortKey"
    v-model:current-sort-order="currentSortOrder" height-class="flex-1"/>

</div>

</template>
<style>
</style>