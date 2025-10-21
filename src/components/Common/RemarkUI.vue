<script setup>
import { ref, watch, nextTick, onMounted, defineEmits, defineProps  } from 'vue'
import WordsUI from '../UI/WordsUI.vue'
import InputUI from '../UI/InputUI.vue';
import ButtonUI from '../UI/ButtonUI.vue';

const props = defineProps({
 userType:{type:String, default: ''},
 newMessage:{type:String, default: ''},
 leaveStatus:{type:String, default: ''},
 remarkMessages: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:newMessage', 'sendMessage'])

console.log('user role is', props.userType)

// auto scroll down to bottom
const chatContainer = ref(null)

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// auto scroll
onMounted(() => scrollToBottom())
watch(() => props.remarkMessages, () => scrollToBottom())
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0 border-2 rounded-2xl overflow-hidden bg-cream border-greenSoft">
    <!-- Header -->
    <div class="bg-ivory p-2">
      <WordsUI word-class="Remarks" />
    </div>

    <!-- chat section -->
    <div ref="chatContainer" class="chat-container flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
      <div v-for="(msg) in props.remarkMessages" :key="msg.id" class="flex justify-start">
        <div class="max-w-[70%] p-3 rounded-2xl shadow-md bg-ivory text-greenSoft ">
          <div class="text-[20px] font-bold mb-1 break-words" >{{ msg.name }} ({{ msg.role }})</div>
          <div class="whitespace-pre-wrap font-semibold text-[20px] break-words">{{ msg.content }}</div>
          <div class="text-xs text-greenSoft mt-1 text-right">{{ msg.time }}</div>
        </div>
      </div>
    </div>

    <!-- enter section -->
    <div v-if="leaveStatus !== 'final approved' && leaveStatus !== 'final rejected' && userType !== 'student'" 
    class="flex items-center p-3 border-t flex-none gap-2 border-greenSoft">
        <InputUI :input-value="newMessage" width-class="flex-1" @update:input-value="val => emit('update:newMessage',val)" 
            nameOfPlaceholder="Type a remark..." @keyup.enter="emit('sendMessage')"/>
        <ButtonUI word-class="Send" width-class="w-[20%]" @update:word-class="emit('sendMessage')"/>
    </div>
  </div>
</template>


<style scoped>

</style>
