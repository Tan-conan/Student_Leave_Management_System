<script setup>
import { defineEmits} from 'vue';

const emit = defineEmits(['menuClicked']);

function openMenu(e){
    e.preventDefault()
    emit('menuClicked')
}

</script>

<template>

<a class="flex items-center h-[50px] text-[20px] font-bold px-2
 text-cream w-auto hover:scale-[80%] transition duration-300" 
href="#" @click="openMenu">
  &#11044;
  &#11044;
  &#11044;
</a>


</template>