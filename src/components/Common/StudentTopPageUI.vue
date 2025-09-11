<script setup>
import MenuDot from '../UI/MenuDot.vue';
import WordsUI from '../UI/WordsUI.vue';
import { defineProps, computed } from 'vue';

const props = defineProps({
    topPageTitle:{type:String, default:''},
    userName:{type:String, default:''},
    userType:{type:String, default: ''},
});

const emit = defineEmits(['menuClicked']);

function handleMenuCLicking() {
    emit('menuClicked');
}

const titleName = computed( function() {
  if (props.userType === 'Student') {
    return 'Student ' + props.userName
}
  if (props.userType === 'Lecturer') {
    return 'Lecturer ' + props.userName
}
  if (props.userType === 'HOP') {
    return 'HOP ' + props.userName
}
  return props.userName
})

</script>

<template>
<div class="flex items-center w-[100%] mx-auto px-0 justify-between bg-ivory">
    <div class="flex gap-5">
        <MenuDot @menu-clicked="handleMenuCLicking"/>
        <WordsUI :word-class="topPageTitle"/>
    </div>

    <div class="flex items-center gap-1">
        <WordsUI :word-class="`welcome! ${titleName}`"/>
        
    </div>

</div>

</template>
<style>
</style>