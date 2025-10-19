<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import { ref, computed, defineProps, defineEmits } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';
import WordsUI from '../UI/WordsUI.vue';

const props = defineProps({
  userType: { type: String, default: '' },
  leaveFiles: { type: Array, default: [] },
});

const emit = defineEmits(['update:leaveFiles']);

// local files
const localFiles = ref([]);

// sorting
const currentSortKey = ref('');
const currentSortOrder = ref('asc');

const tableHeads = ref([
  { key: 'id', label: 'ID' },
  { key: 'file_name', label: 'File Name' },
  { key: 'delete', label: 'Delete' },
]);

// computed final list (sorted)
const manageFiles = computed(() => {
  let files = [...localFiles.value];

  if (currentSortKey.value) {
    files.sort((a, b) => {
      let A = a[currentSortKey.value];
      let B = b[currentSortKey.value];
      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();
      if (A > B) return currentSortOrder.value === 'asc' ? 1 : -1;
      if (A < B) return currentSortOrder.value === 'asc' ? -1 : 1;
      return 0;
    });
  }

  return files;
});

// click row → open file
function rowClickHandle(row) {
  if (row.file_url) window.open(row.file_url, '_blank');
}

// delete file
function deleteFile(id) {
  localFiles.value = localFiles.value.filter(file => file.id !== id);
  emit('update:leaveFiles', localFiles.value);
}

// add file
function addnewFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;

  input.onchange = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      localFiles.value.push({
        id: localFiles.value.length + 1,
        file_name: file.name,
        file_url: url,
        file_object: file,
      });
    }

    emit('update:leaveFiles', localFiles.value);
  };

  input.click();
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-[100%] gap-2 border-greenSoft">

    <div class="flex w-[100%] mx-auto px-0 justify-between">
      <WordsUI word-class="Attached Files"/>
      <ButtonUI
        v-if="props.userType === 'student'"
        word-class="Add new file"
        width-class="w-auto"
        @update:word-class="addnewFile"
      />
    </div>

    <RecordListUI
      :table-heads="tableHeads"
      :leave-records="manageFiles"
      v-model:current-sort-key="currentSortKey"
      v-model:current-sort-order="currentSortOrder"
      height-class="h-50"
      @row-clicked="rowClickHandle"
    >
      <template #delete="{ row }">
        <button 
          class="bg-greenSoft text-white px-3 py-1 rounded"
          @click="deleteFile(row.id)">
          Delete
        </button>
      </template>
    </RecordListUI>
  </div>
</template>
