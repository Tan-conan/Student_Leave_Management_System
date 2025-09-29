<script setup>
import { ref, watch, computed } from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import ButtonUI from '../UI/ButtonUI.vue';
import DatePicker from '../UI/DatePicker.vue';
import RecordListUI from '../UI/RecordListUI.vue';

const props = defineProps({
    holidayDate:{type:Array, default: [null, null]},
    holidayMenuModalVisible:{type:Boolean, default:false},
    selectedHolidayDate:{type:Array, default: [null, null]},
    selectedHolidayName:{type:String, default:''}
})

const emit = defineEmits(['update:holidayDate','update:holidayMenuModalVisible', 'update:selectedHolidayName',
'update:selectedHolidayDate', 'addHoliday'])

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

const tableHeads = ref([
    // key better dont have spacing, use _
    {key:'id' , label:'ID'},
    {key:'holiday_name' , label:'Holiday Name'},
    {key:'start_date' , label:'Start Date'},
    {key:'end_date' , label:'End Date'},
])

const holidayList = ref([
  {id: 1, holiday_name: 'New Year Holiday', start_date: '2025-01-01', end_date:   '2025-01-02'},
  {id: 2, holiday_name: 'Chinese New Year', start_date: '2025-01-28', end_date:   '2025-02-01'},
  {id: 3, holiday_name: 'Labour Day', start_date: '2025-05-01', end_date:   '2025-05-01'},
  {id: 4, holiday_name: 'Hari Raya Aidilfitri', start_date: '2025-04-01', end_date:   '2025-04-02'},
  {id: 5, holiday_name: 'Christmas', start_date: '2025-12-24', end_date:   '2025-12-25'},
  {id: 5, holiday_name: 'Christmas', start_date: '2025-12-24', end_date:   '2025-12-25'},
  {id: 5, holiday_name: 'Christmas', start_date: '2025-12-24', end_date:   '2025-12-25'}
])


// managing user filter, search and sort functions at once
const manageRecords = computed(function(){
    let filteredRecords = holidayList.value

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

function rowClickHandle(row) {
    console.log('HOP wants to delete this row of holiday')

    emit('update:selectedHolidayDate', [
        new Date(row.start_date).getTime(),
        new Date(row.end_date).getTime()
    ])

    emit('update:selectedHolidayName', row.holiday_name)
    emit('update:holidayMenuModalVisible', true)
}

function passDate(val) {
    emit('update:holidayDate', val)
}

</script>

<template>
  <div class="flex flex-col gap-2 w-[50%] h-full">
    <WordsUI word-class="Holiday List"/>
    <RecordListUI :table-heads="tableHeads" :leave-records="holidayList" v-model:current-sort-key="currentSortKey"
     v-model:current-sort-order="currentSortOrder" height-class="flex-1"  @row-clicked="rowClickHandle"/>

    <WordsUI word-class="Add a New Holiday"/>
    <div class="flex gap-2">
        <WordsUI word-class="Holiday Name Name:"/>
        <InputUI width-class="flex-1"/>
    </div>
    <div class="flex gap-2 items-center">
        <WordsUI word-class="Date range :"/>
        <DatePicker :date-value="holidayDate" width-class="flex-1" type="daterange" placeholder="Select date range" @update:date-value="passDate"/>
    </div>
    <div class="flex flex-col">
        <WordsUI word-class="Caution:"/>
        <WordsUI word-class="once new Session starts unable to delete holidays until the end of session!"/>
    </div>

    <div class="flex justify-end">
        <ButtonUI word-class="Add Holiday" width-class="min-w-auto w-[25%]" @update:word-class="emit('addHoliday')"/>
    </div>
  </div>

</template>

<style scoped>

</style>
