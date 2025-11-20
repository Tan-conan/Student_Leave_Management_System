<script setup>
import ButtonUI from '../UI/ButtonUI.vue';
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import RecordListUI from '../UI/RecordListUI.vue';
import WordsUI from '../UI/WordsUI.vue';

const props = defineProps({
  pageType: { type: String, default: 'apply' }, // this code handle add file list and file show list, need this
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

// click row → fetch + blob download
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
      alert('Download failed!');
      return;
    }

    const blob = await resp.blob(); // change resp into blob type
    const url = window.URL.createObjectURL(blob); // create temporilaty url for the file

    const a = document.createElement('a'); // create temporilary <a> to
    a.href = url; // give url to a to let it open when click
    a.download = row.file_name || 'download'; // tell a when clicked force to download the file
    document.body.appendChild(a);
    a.click(); // simulate clicking
    a.remove(); // remove a and its stored url to prevent storage leakage
    window.URL.revokeObjectURL(url); // clear url same above
  } catch (err) {
    console.error('fetch download error', err);
    alert('Download error!');
  }
}


// delete file
function deleteFile(id) {
  localFiles.value = localFiles.value.filter(file => file.id !== id);
  emit('update:leaveFiles', localFiles.value);
}

// add file
function addnewFile() {
  // Create a hidden file input element
  const input = document.createElement('input');
  input.type = 'file';

  // can selected multiple files
  input.multiple = true;

  // Set up the onChange handler for when files are selected
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

  // Programmatically trigger the file explorer dialog
  input.click();
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-[100%] gap-2 border-greenSoft">

    <div class="flex w-[100%] mx-auto px-0 justify-between">
      <WordsUI word-class="Attached Files" text-color-class="text-wordSubTitle"/>
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
