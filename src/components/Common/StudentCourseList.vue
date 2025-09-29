<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import InputUI from '../UI/InputUI.vue';
import { useRouter } from 'vue-router'
import { ref, computed, watch, defineEmits } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';
import WordsUI from '../UI/WordsUI.vue';

const router = useRouter()

const props = defineProps({
 courseList:{type:Array, required:true},
 selectedCourseList:{type:Array, default:[]},
 confirmCourseModalVisible:{type:Boolean, default:false},
});

const emit = defineEmits(['update:confirmCourseModalVisible','update:selectedCourseList'])

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

// for searching
const searchValue = ref('') // confirmed search value
const searchingValue = ref('') // user still typing searching value

const tableHeads = ref([
    // key better dont have spacing, use _
    {key:'id' , label:'ID'},
    {key:'course_name' , label:'Course Name'},
    {key:'lecturer_name' , label:'Lecturer Name'},
    {key:'checkbox' , label:'Check To Enrol'},
])

// managing user filter, search and sort functions at once
const manageCoursesList = computed(function(){
    let filteredCourses = props.courseList

    if (searchValue.value) { // if user got search then calculate this  
        filteredCourses = filteredCourses.filter(function(row){
          return row.course_name.toLowerCase().includes(searchValue.value.toLowerCase())
        })
    }

    if (currentSortKey.value) { // if user got sort then calculate this  
        filteredCourses = [...filteredCourses].sort((a,b) => {
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

    return filteredCourses
})

function backToLogin() {
  router.push('/')
}

function rowClickHandle(val) {
    return;
}

function buttonClicked(val) {
    console.log('a button is clicked which is ' + val)
    if (val === 'Search') {
        searchValue.value = searchingValue.value;
    }
}

function fetchCheckedCourses() {
  const selectedCourse = manageCoursesList.value
    .filter(r => r.checkbox)
    .map(r => r.course_name);

  emit('update:selectedCourseList', selectedCourse);
  emit('update:confirmCourseModalVisible', true);
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

        <div class="flex items-center justify-end gap-1 w-[70%]">

            <InputUI v-model:input-value="searchingValue" name-of-placeholder="Search by course name" 
             width-class="w-[50%]" @keyup.enter="buttonClicked('Search')"/>

            <ButtonUI word-class="Search" width-class="w-auto" @update:word-class="buttonClicked"/>

        </div>
    </div>

    <RecordListUI :table-heads="tableHeads" :leave-records="manageCoursesList"  v-model:current-sort-key="currentSortKey"
    v-model:current-sort-order="currentSortOrder" height-class="h-100" @row-clicked="rowClickHandle">

        <template #checkbox="{ row, value }">
            <input type="checkbox" class="scale-150" v-model="row.checkbox"/>
        </template>

    </RecordListUI>
</div>

<WordsUI word-class="Please ensure you enroll for courses before <Semester start date> as the course enrollment will be 
    closed and students will unable to enroll until the end of the semester"/>
<WordsUI word-class="Currently Your Session <Session Name >Start Date is <Start Date> and End Date is <End Date>"/>

<div class="flex justify-end">
    <ButtonUI word-class="Submit!" width-class="w-[15%]" @click="fetchCheckedCourses"/>
</div>

</template>
<style>
</style>