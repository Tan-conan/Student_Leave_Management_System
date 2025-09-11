<script setup>
import { defineEmits} from 'vue';


const emit = defineEmits(['menuClicked']);

function openMenu(e){
    e.preventDefault()
    emit('menuClicked')
}

</script>

<template>

<a class="flex items-center h-[50px] text-[10px] font-bold px-2 text-greenSoft w-auto hover:underline" href="#" @click="openMenu">
  &#11044;
  &#11044;
  &#11044;
</a>


</template>