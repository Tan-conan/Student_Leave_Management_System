<script setup>
import { ref, computed, watch, defineProps } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';
import WordsUI from '../UI/WordsUI.vue';

const props = defineProps({
    userType:{type:String, default: ''},
    lecturerCourses:{type:Array, default: []},
});

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

const tableHeads = ref([
    // key better dont have spacing, use _
    {key:'lecturer_name' , label:'Lecturer Name'},
    {key:'approve_status' , label:'Approve Status'},
])

// managing user filter, search and sort functions at once
const manageLecturers = computed(function(){
    let filteredRecords = props.lecturerCourses

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
}

</script>

<template>
<div class="flex flex-col items-center justify-center w-[100%] gap-2 border-greenSoft">

    <div class="flex w-[100%] mx-auto px-0 justify-between">

        <WordsUI word-class="sended Lecturers"/>

    </div>

    <RecordListUI :table-heads="tableHeads" :leave-records="manageLecturers" v-model:current-sort-key="currentSortKey"
    v-model:current-sort-order="currentSortOrder" height-class="h-50"  @row-clicked="rowClickHandle">

    </RecordListUI>

</div>

</template>
<style>
</style>