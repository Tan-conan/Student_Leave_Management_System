<script setup>
import WordsUI from '../UI/WordsUI.vue';
import DropdownUI from '../UI/DropdownUI.vue';
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  dropdownValue:{type:String, default:''},
});

const emit = defineEmits(['update:dropdownValue']);
const programList = ref([])

function updateselection(val){
    emit('update:dropdownValue',val)
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/auth/programs')
    programList.value = res.data.map(item => item.program_name);
  } catch (err) {
    console.error('fetch program error', err)
  }
})

</script>

<template>
<div class="flex items-center w-[50%] mx-auto px-0 gap-4">
    <WordsUI word-class="Program"/>
    <DropdownUI :dropdown-value="dropdownValue" :options="programList" placeholder="Select your program"
    width-class="flex-1" @update:dropdown-value="updateselection"/>

</div>

</template>
<style>
</style>