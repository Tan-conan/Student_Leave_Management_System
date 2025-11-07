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
<div class="flex items-center w-[100%] mx-auto px-0 justify-between h-[50px] shrink-0 bg-topPage mb-2"> 
  <!--shrink 0 let toppageui height really = h-[50px]-->
    <div class="flex gap-4 mx-4">
        <MenuDot @menu-clicked="handleMenuCLicking"/>
        <WordsUI :word-class="topPageTitle" text-color-class='text-cream'/>
    </div>

    <div class="flex items-center gap-1 mx-4">
        <WordsUI :word-class="`welcome! ${titleName}`" text-color-class='text-cream'/>

    </div>

</div>

</template>
<style>
</style>