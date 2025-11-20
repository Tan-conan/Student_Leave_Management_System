<script setup>
import { ref, watch, computed } from 'vue'
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import ButtonUI from '../UI/ButtonUI.vue';
import DatePicker from '../UI/DatePicker.vue';
import RecordListUI from '../UI/RecordListUI.vue';

const props = defineProps({
    holidayMenuModalVisible:{type:Boolean, default:false},
    newHolidayName:{type:String, default:''},
    newHolidayDate:{type:Array, default: [null, null]},
    holidayList:{type:Array, default:[]},
    userSessionStatus:{type:String, default:''},
})

const emit = defineEmits(['row-clicked', 'addHoliday', 'update:newHolidayName', 'update:newHolidayDate'])

// for sorting
const currentSortKey = ref(''); // current sorting key
const currentSortOrder = ref('asc'); // asc for ascending, desc for descending

const tableHeads = ref([
  {key:'holiday_name' , label:'Holiday Name'},
  {key:'starting_date' , label:'Start Date'},
  {key:'ending_date' , label:'End Date'},
])

// managing user filter, search and sort functions at once
const manageRecords = computed(function(){
    let filteredRecords = props.holidayList

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
    console.log('ROW ', row)
    emit('row-clicked', row)
}

function passDate(val) {
    emit('update:newHolidayDate', val)
}

</script>

<template>
  <div class="flex flex-col gap-2 w-[50%] h-full">
    <!--if no holiday-->
    <div v-if="holidayList.length === 0" class="flex items-center justify-center px-4 w-full h-full border-greenSoft border-2 bg-ivory">
        <WordsUI v-if="userSessionStatus === 'activated' || userSessionStatus === 'unactivated'" word-class="currently no holiday in this session"/>
        <WordsUI v-else word-class="currently no session available for this program"/>
    </div>

    <!--holiday list-->
    <RecordListUI v-else :table-heads="tableHeads" :leave-records="holidayList" v-model:current-sort-key="currentSortKey"
     v-model:current-sort-order="currentSortOrder" height-class="flex-1"  @row-clicked="rowClickHandle"/>

    <!--add new holiday-->
    <div class="big-card flex-1">
        <div class="small-card"><WordsUI word-class="ADD A NEW HOLIDAY" text-color-class="text-cream" word-bold-class="font-black" wordsize-class="text-[35px]" /></div>
    <div class="flex gap-2">
        <WordsUI word-class="Holiday Name:" text-color-class="text-wordSubTitle"/>
        <InputUI width-class="flex-1" :input-value="newHolidayName" @update:input-value="val => emit('update:newHolidayName',val)"/>
    </div>
    <div class="flex gap-2 items-center">
        <WordsUI word-class="Date range :" text-color-class="text-wordSubTitle"/>
        <DatePicker :date-value="newHolidayDate" width-class="flex-1" type="daterange" placeholder="Select date range" @update:date-value="passDate"/>
    </div>
    <div class="flex flex-col">
        <WordsUI word-class="Caution:" text-color-class="text-wordTitle"/>
        <div class="caution-card"><WordsUI word-class="once new Session starts unable to delete holidays until the end of session!"/></div>
    </div>

    <!--button-->
    <div class="flex justify-end">
        <ButtonUI word-class="Add Holiday" width-class="min-w-auto w-[40%]" @update:word-class="emit('addHoliday')"/>
    </div>
    </div>

  </div>

</template>

<style scoped>

</style>
