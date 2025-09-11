<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import { useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';
import WordsUI from '../UI/WordsUI.vue';

const router = useRouter()

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

const tableHeads = ref([
    // key better dont have spacing, use _
    {key:'id' , label:'ID'},
    {key:'lecturer_name' , label:'Lecturer Name'},
    {key:'course_name' , label:'Course Name'},
    {key:'checkbox' , label:'Delete'},
])

const lecturerCourses = ref([
  { id: 1, lecturer_name: 'Dr. Lim Wei Ming', course_name: 'Software Engineering', checkbox: false },
  { id: 2, lecturer_name: 'Prof. Tan Ai Ling', course_name: 'Database Systems', checkbox: false },
  { id: 3, lecturer_name: 'Mr. Ahmad Zulkifli', course_name: 'Operating Systems', checkbox: false },
  { id: 4, lecturer_name: 'Dr. Chong Mei Ling', course_name: 'Computer Networks', checkbox: false },
  { id: 5, lecturer_name: 'Ms. Nurul Aisyah', course_name: 'Human-Computer Interaction', checkbox: false }
])

// managing user filter, search and sort functions at once
const manageLecturers = computed(function(){
    let filteredRecords = lecturerCourses.value

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

function rowClickHandle(val) {
    alert('user click record with ID of ' + val)
}

function addnewFile(val) {
    console.log('a button is clicked which is ' + val)
}

</script>

<template>
<div class="flex flex-col items-center justify-center w-[100%] gap-2 border-greenSoft">

    <div class="flex w-[100%] mx-auto px-0 justify-between">

        <WordsUI word-class="Send to..."/>

    </div>

    <RecordListUI :table-heads="tableHeads" :leave-records="manageLecturers" v-model:current-sort-key="currentSortKey"
    v-model:current-sort-order="currentSortOrder" width-class="h-50"  @row-clicked="rowClickHandle">

    <template #checkbox="{ row, value }">
        <input type="checkbox" class="scale-150" v-model="row.checkbox" />
    </template>

    </RecordListUI>

</div>

</template>
<style>
</style>