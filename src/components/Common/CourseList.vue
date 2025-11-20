<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import InputUI from '../UI/InputUI.vue';
import { useRouter } from 'vue-router'
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';
import WordsUI from '../UI/WordsUI.vue';

const router = useRouter()

const props = defineProps({
 userName:{type:String, default: ''},
 userType:{type:String, default: ''},
 courseName:{type:String, default: ''},
 courseCode:{type:String, default: ''},
 courseLecturer:{type:String, default: ''},
 courseMenuModalVisible:{type:Boolean, default:false},
 courseList:{type:Array, default:[]}
});

const emit = defineEmits(['update:courseName','update:courseCode','update:courseLecturer','update:courseMenuModalVisible'])

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

// for searching
const searchValue = ref('') // confirmed search value
const searchingValue = ref('') // user still typing searching value

const tableHeads = ref([
    // key better dont have spacing, use _
    {key:'course_code' , label:'Course Code'},
    {key:'course_name' , label:'Course Name'},
    {key:'current_lecturer' , label:'Current Lecturer'},
])

// managing user filter, search and sort functions at once
const manageRecords = computed(function(){
    let filteredRecords = props.courseList

    if (searchValue.value) { // if user got search then calculate this  
        filteredRecords = filteredRecords.filter(function(row){
          return row.course_name.toLowerCase().includes(searchValue.value.toLowerCase())
        })
    }

    if (currentSortKey.value) { // if user got sort then calculate this  
        // shallow copy
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
                return currentSortOrder.value === 'asc' ? 1 : -1 //if 1 a is at back of b, if -1 a is in front of b
            }
            if ( A < B) {
                return currentSortOrder.value === 'asc' ? -1 : 1 //if 1 a is in front of b, if -1 a is at back of b
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
    emit('update:courseCode', row.course_code)
    emit('update:courseName', row.course_name)
    emit('update:courseLecturer', row.current_lecturer)
    emit('update:courseMenuModalVisible', true)
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

        <!--back to login button-->
        <div class="flex w-[30%]">
            <ButtonUI word-class="Back to Login" width-class="w-auto" @click="backToLogin"/>
        </div>

        <!--search bar-->
        <div class="flex items-center justify-center gap-1 w-[50%]">

            <InputUI v-model:input-value="searchingValue" name-of-placeholder="Search by course name" 
            width-class="flex-1" @keyup.enter="buttonClicked('Search')"/>

            <ButtonUI word-class="Search" width-class="w-auto" @update:word-class="buttonClicked"/>

        </div>
    </div>

    <!--if no record-->
    <div v-if="courseList.length === 0" class="flex items-center justify-center w-full h-85 border-greenSoft border-2 bg-ivory">
        <WordsUI word-class="currently no course available for this program"/>
    </div>
    <!--table-->
    <RecordListUI v-else :table-heads="tableHeads" :leave-records="manageRecords" v-model:current-sort-key="currentSortKey"
    v-model:current-sort-order="currentSortOrder" height-class="h-85"  @row-clicked="rowClickHandle"/>

</div>

</template>
<style>
</style>