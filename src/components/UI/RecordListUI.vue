<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import WordsUI from './WordsUI.vue';

const props = defineProps({
    tableHeads:{type:Array, required:true},
    leaveRecords:{type:Array, required:true},
    currentSortKey:{type:String, default:''},
    currentSortOrder:{type:String, default:'asc'},
    widthClass:{type:String, default:'w-full'},
});

const emit = defineEmits(['rowClicked','update:currentSortKey','update:currentSortOrder']);

function clickOnRow(val){
    emit('rowClicked', val)
}

function keyClicked(val) {
    if (props.currentSortKey === val) { // detect if user click on same head key
        const newSortOrder = props.currentSortOrder === 'asc' ? 'desc' : 'asc';
        emit('update:currentSortOrder',newSortOrder)
    } else { // if not reset order into asc
        emit('update:currentSortKey',val)
        emit('update:currentSortOrder','asc')
    }
}

</script>

<template>
  <div :class="['overflow-y-auto border-3 border-greenSoft',widthClass]">
    <table class="w-full table-fixed border-greenSoft border-2 border-collapse">

      <!-- table heads -->
      <thead class="bg-greenSoft text-cream sticky top-0 z-10"> <!--sticky top-0 to make sure thead wont scroll-->
        <tr>
          <th v-for="head in tableHeads" :key="head.key" class="text-center cursor-pointer px-2 py-1"
           @click="keyClicked(head.key)" :class="{ 'w-[50px]': head.key === 'id' }">

            <div class="flex gap-1 items-center justify-center select-none">

              <WordsUI :word-class="head.label" text-color-class="text-cream"/>
              <span v-if="currentSortKey === head.key">
                {{ currentSortOrder === 'asc' ? '▼' : '▲' }}
              </span>

            </div>
          </th>
        </tr>
      </thead>

      <!-- table body -->
      <tbody>
        <tr v-for="row in leaveRecords" :key="row.id" class="border border-greenSoft
         hover:bg-ivory h-[50px]" @dblclick="clickOnRow(row.id)">

          <td v-for="head in tableHeads" :key="head.key" class="text-center text-greenSoft font-bold text-2xl px-2 py-1"
          :class="{ 'w-[30px]': head.key === 'id' }">

            <slot :name="`${head.key}`" :row="row" :value="row[head.key]">
              {{ row[head.key] }}
            </slot>
          </td>

        </tr>

      </tbody>
    </table>
  </div>
</template>


<style scoped>

</style>