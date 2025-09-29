<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import { ref, computed, watch, defineProps } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';
import WordsUI from '../UI/WordsUI.vue';

const props = defineProps({
    userType:{type:String, default: ''},
    leaveFiles:{type:Array, default: []},
    confirmFileModalVisible:{type:Boolean, default:false},
});

const emit = defineEmits(['update:confirmFileModalVisible'])

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

const finalTableHeads = ref([
    // key better dont have spacing, use _
    {key:'id' , label:'ID'},
    {key:'file_name' , label:'File Name'},
])

// if student add checkbox column
const tableHeads = computed(() => {
  if (props.userType === 'Student') {
    return [...finalTableHeads.value, { key: 'checkbox', label: 'Delete' }];
  }
  return finalTableHeads.value;
});

// managing user filter, search and sort functions at once
const manageFiles = computed(function(){
    let filteredRecords = props.leaveFiles

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

function addnewFile(val) {
    console.log('a button is clicked which is ' + val)
}

function confirmDeleteFiles() {
  emit('update:confirmFileModalVisible', true);
}

</script>

<template>
<div class="flex flex-col items-center justify-center w-[100%] gap-2 border-greenSoft">

    <div class="flex w-[100%] mx-auto px-0 justify-between">

        <WordsUI word-class="Attached Files"/>
        <ButtonUI v-if="props.userType === 'Student'" word-class="Add new file" width-class="w-auto" @update:word-class="addnewFile"/>

    </div>

    <RecordListUI :table-heads="tableHeads" :leave-records="manageFiles" v-model:current-sort-key="currentSortKey"
    v-model:current-sort-order="currentSortOrder" height-class="h-50"  @row-clicked="rowClickHandle">

    <template #checkbox="{ row, value }">
        <input type="checkbox" class="scale-150" v-model="row.checkbox" />
    </template>

    </RecordListUI>

    <div class="flex justify-end w-[100%]">
        <ButtonUI v-if="props.userType === 'Student'" word-class="Delete Selected Files" width-class="w-auto" @update:word-class="confirmDeleteFiles"/>
    </div>

</div>

</template>
<style>
</style>