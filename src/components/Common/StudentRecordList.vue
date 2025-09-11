<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';
import InputUI from '../UI/InputUI.vue';
import { useRouter } from 'vue-router'
import { ref, computed, watch, defineProps } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';

const router = useRouter()

const props = defineProps({
 userName:{type:String, defult: ''},
 userType:{type:String, defult: ''},
});

function applyLeave() {
    router.push({
        path:'/StudentApplyLeavePage',
        query:{
            userName:props.userName,
            userType:props.userType,
        }
    })
}

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

// for searching
const searchValue = ref('') // confirmed search value
const searchingValue = ref('') // user still typing searching value

// for filtering
const filterList = ref(['None','Pending','Approved','Rejected','Annual','Medical']) // dropdown filter menu
const filterValue = ref('') // current selected filter keyword

const tableHeads = ref([
    // key better dont have spacing, use _
    {key:'id' , label:'ID'},
    {key:'start_date' , label:'Start Date'},
    {key:'end_date' , label:'End Date'},
    {key:'name' , label:'Name'},
    {key:'type' , label:'Type'},
    {key:'status' , label:'Status'},
    {key:'sent_date' , label:'Sent Date'},
])

const leaveRecords = ref([
  { id: 1, start_date: '2025-01-01', end_date: '2025-01-05', name: 'Alice', type: 'Annual', status: 'Approved', sent_date: '2025-01-10' },
  { id: 2, start_date: '2025-02-10', end_date: '2025-02-12', name: 'Bob', type: 'Medical', status: 'Pending', sent_date: '2025-02-15' },
  { id: 3, start_date: '2025-03-05', end_date: '2025-03-08', name: 'Charlie', type: 'Annual', status: 'Rejected', sent_date: '2025-03-01' },
  { id: 4, start_date: '2025-04-15', end_date: '2025-04-20', name: 'Diana', type: 'Medical', status: 'Approved', sent_date: '2025-04-10' },
  { id: 5, start_date: '2025-05-02', end_date: '2025-05-04', name: 'Ethan', type: 'Annual', status: 'Pending', sent_date: '2025-04-30' },
  { id: 6, start_date: '2025-06-12', end_date: '2025-06-18', name: 'Fiona', type: 'Medical', status: 'Rejected', sent_date: '2025-06-05' },
  { id: 7, start_date: '2025-07-01', end_date: '2025-07-03', name: 'George', type: 'Annual', status: 'Approved', sent_date: '2025-06-28' },
  { id: 8, start_date: '2025-08-09', end_date: '2025-08-12', name: 'Hannah', type: 'Medical', status: 'Pending', sent_date: '2025-08-05' },
  { id: 9, start_date: '2025-09-15', end_date: '2025-09-20', name: 'Ian', type: 'Annual', status: 'Rejected', sent_date: '2025-09-10' },
  { id: 10, start_date: '2025-10-05', end_date: '2025-10-06', name: 'Jane', type: 'Medical', status: 'Approved', sent_date: '2025-10-01' },
  { id: 11, start_date: '2025-11-11', end_date: '2025-11-13', name: 'Kevin', type: 'Annual', status: 'Pending', sent_date: '2025-11-08' },
  { id: 12, start_date: '2025-12-20', end_date: '2025-12-25', name: 'Lily', type: 'Medical', status: 'Approved', sent_date: '2025-12-15' },
])


// managing user filter, search and sort functions at once
const manageRecords = computed(function(){
    let filteredRecords = leaveRecords.value

    if (filterValue.value && filterValue.value !== 'None') {  // if user got filter then calculate this  
        filteredRecords = filteredRecords.filter(function(row){
          return row.status === filterValue.value || row.type === filterValue.value
        })
    }

    if (searchValue.value) { // if user got search then calculate this  
        filteredRecords = filteredRecords.filter(function(row){
          return row.name.toLowerCase().includes(searchValue.value.toLowerCase())
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

function rowClickHandle(val) {
    alert('user click record with ID of ' + val)
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

    <div class="flex w-[100%] mx-auto px-0 justify-between">

        <div class="flex w-[30%]">
            <ButtonUI word-class="Back to Login" width-class="w-auto" @click="backToLogin"/>
        </div>

        <div class="flex items-center justify-center gap-1 w-[70%]">

            <ButtonUI word-class="Apply for leave" width-class="w-auto" @update:word-class="applyLeave"/>

            <DropdownUI v-model:dropdown-value = 'filterValue' :options="filterList" placeholder="Filter By"width-class="w-[30%]"/>

            <InputUI v-model:input-value="searchingValue" name-of-placeholder="Search by name" 
            width-class="flex-1" @keyup.enter="buttonClicked('Search')"/>

            <ButtonUI word-class="Search" width-class="w-auto" @update:word-class="buttonClicked"/>

        </div>
    </div>

    <RecordListUI :table-heads="tableHeads" :leave-records="manageRecords" v-model:current-sort-key="currentSortKey"
    v-model:current-sort-order="currentSortOrder" width-class="flex-1"  @row-clicked="rowClickHandle"/>

</div>

</template>
<style>
</style>