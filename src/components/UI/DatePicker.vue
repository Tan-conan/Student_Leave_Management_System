<script setup>
import { defineProps, defineEmits } from 'vue'
import { NDatePicker } from 'naive-ui'

const props = defineProps({
  dateValue:{type: [Number, String, Array], default: null}, //string for single date array for area of date
  type:{ type: String, default: '', required: true}, //single(date) or area(daterange)
  placeholder:{type: String, default: 'Select date'},
  widthClass:{type: String, default: 'w-auto'}
})

// define the event that will send to parent compoenent
const emit = defineEmits(['update:dateValue'])

// send new date value to parent
function updateDate(val) {
    emit('update:dateValue', val)
}
</script>

<template>
  <div :class="['datepicker-wrap', widthClass]">
    <n-date-picker :type="type" :value="props.dateValue" :placeholder="placeholder" :clearable="true" @update:value="updateDate"/>
  </div>
</template>

<style scoped>
.datepicker-wrap {
  border-radius: 8px;
  overflow: visible; /* show date picker ui */
}

.datepicker-wrap :deep(input),
.datepicker-wrap :deep(.n-input__input) { /* force to change input style */
  color: var(--color-greenSoft) !important;
  font-size: 18px !important;
  font-weight: bold !important;
}

.datepicker-wrap :deep(.n-input),
.datepicker-wrap :deep(.n-input-wrapper) { /* force to change background style */
  background: var(--color-inputField) !important;
  border-radius: 5px !important;
}

</style>
