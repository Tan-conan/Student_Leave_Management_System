<script setup>
import { defineProps, defineEmits } from 'vue'
import { NDatePicker } from 'naive-ui'

const props = defineProps({
  dateValue:{type: [Number, String, Array], default: null}, //string for single date array for area of date
  type:{ type: String, default: '', required: true}, //single(date) or area(daterange)
  placeholder:{type: String, default: 'Select date'},
  widthClass:{type: String, default: 'w-auto'}
})

const emit = defineEmits(['update:dateValue'])

function updateDate(val) {
    emit('update:dateValue', val)
}

</script>

<template>
  <n-date-picker :type="type" :value="props.dateValue" :placeholder="placeholder" :clearable="true"
    @update:value="updateDate" :class="[widthClass]"/>
</template>
