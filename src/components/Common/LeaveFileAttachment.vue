<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';
import WordsUI from '../UI/WordsUI.vue';

const props = defineProps({
  pageType: { type: String, default: 'apply' },
  leaveFiles: { type: Array, default: [] },
});

const emit = defineEmits(['update:leaveFiles']);

// local files
const localFiles = ref([]);

// 
watch(
  () => props.leaveFiles,
  (newVal) => {
    localFiles.value = [...newVal];
  },
  { immediate: true }
);

// sorting
const currentSortKey = ref('');
const currentSortOrder = ref('asc');

const tableHeads = computed(() => {
  const heads = [
    { key: 'id', label: 'ID' },
    { key: 'file_name', label: 'File Name' },
  ];

  if (props.pageType === 'apply') {
    heads.push({ key: 'delete', label: 'Delete' });
  }

  return heads;
});


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

// click row → fetch + blob download (works with verifyToken)
async function rowClickHandle(row) {
  if (!row.file_url) return; // return if no url

  // backend base url
  const backendBase = import.meta.env.VITE_API_BASE;
  const downloadUrl = `${backendBase}${row.file_url}`;

  // take token from localstorage for verification
  const token = localStorage.getItem('token');

  try {
    const resp = await fetch(downloadUrl, { // manually add authentication header
      method: 'GET',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!resp.ok) { // if got error return error message 
      const txt = await resp.text();
      console.error('Download failed', resp.status, txt);
      alert('Download failed: ' + resp.status + ' — see console');
      return;
    }

    const blob = await resp.blob(); // change resp into blob type
    const url = window.URL.createObjectURL(blob); //change blob into url can visit in browser

    const a = document.createElement('a'); // create temporilary <a> to simulate tapping for broswer download the file
    a.href = url;
    a.download = row.file_name || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url); // clear url
  } catch (err) {
    console.error('fetch download error', err);
    alert('Download error: see console');
  }
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
      <ButtonUI v-if="props.pageType === 'apply'" word-class="Add new file" width-class="w-auto" @update:word-class="addnewFile"/>
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
        <button class="bg-greenSoft text-white px-3 py-1 rounded" @click="deleteFile(row.id)"> 
          Delete
        </button>
      </template>
    </RecordListUI>
  </div>
</template>
