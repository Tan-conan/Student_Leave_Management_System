<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';
import InputUI from '../UI/InputUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import { useRouter } from 'vue-router'
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';

const router = useRouter()

const props = defineProps({
 userName:{type:String, default: ''},
 userType:{type:String, default: ''},
 lecturerPendingModalVisible:{type:Boolean, default:false},
 lecturerList:{type:Array, default:[]}
});

const emit = defineEmits(['rowClickedHandle'])

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

// for searching
const searchValue = ref('') // confirmed search value
const searchingValue = ref('') // user still typing searching value

// for filtering
const filterList = ref(['None','pending','active','inactive']) // dropdown filter menu
const filterValue = ref('') // current selected filter keyword

const tableHeads = ref([
    // key better dont have spacing, use _
    {key:'lecturer_name' , label:'Lecturer Name'},
    {key:'status' , label:'Status'},
    {key:'date_join' , label:'Date Join'},
    {key:'email' , label:'Email'},
    {key:'contact_no' , label:'Contact No'},
])

// managing user filter, search and sort functions at once
const manageRecords = computed(function(){
    let filteredRecords = props.lecturerList

    if (filterValue.value && filterValue.value !== 'None') {  // if user got filter then calculate this  
        filteredRecords = filteredRecords.filter(function(row){
          return row.status === filterValue.value || row.type === filterValue.value
        })
    }

    if (searchValue.value) { // if user got search then calculate this  
        filteredRecords = filteredRecords.filter(function(row){
          return row.lecturer_name.toLowerCase().includes(searchValue.value.toLowerCase())
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

    <div class="flex flex-col w-full h-full flex-1 min-h-0 overflow-y-auto">   
        <div v-if="manageRecords.length === 0" class="flex items-center justify-center w-full flex-1 border-greenSoft border-2 bg-ivory">
        <WordsUI word-class="currently no lecturer available for this program"/>
        </div>
        <RecordListUI v-else :table-heads="tableHeads" :leave-records="manageRecords" v-model:current-sort-key="currentSortKey"
    v-model:current-sort-order="currentSortOrder" height-class="flex-1"  @row-clicked="row => emit('rowClickedHandle',row)"/>
    </div>

</div>

</template>
<style>
</style>