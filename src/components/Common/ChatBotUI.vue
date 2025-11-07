<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import api from '../../api/axios'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import WordsUI from '../UI/WordsUI.vue'
import InputUI from '../UI/InputUI.vue'
import ButtonUI from '../UI/ButtonUI.vue'

const route = useRoute()

// preload message
const messages = ref(JSON.parse(sessionStorage.getItem('chatMessages') || '[]'));

// if message added new save it into sessionstarage
watch(messages, (newVal) => {
  sessionStorage.setItem('chatMessages', JSON.stringify(newVal));
}, { deep: true });

window.addEventListener('beforeunload', () => {

});

onBeforeRouteLeave(() => {
  sessionStorage.removeItem('chatMessages')
})

// user input message
const inputMessage = ref('')

const isSending = ref(false) // prevent spam

// send message
async function sendMessage() {
  if (!inputMessage.value.trim() || isSending.value) return // if issending is true means just send message, return directly

  isSending.value = true

  // user message
  messages.value.push({
    sender: 'user',
    name: 'You',
    content: inputMessage.value,
    time: new Date(),
  });

  const userMsg = inputMessage.value;
  inputMessage.value = '';
  scrollToBottom();

  try {
    const res = await api.post('/chatbotManage/chatbotReply', {
      message: userMsg,
      history: messages.value.filter(m => m.sender !== 'system').map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    })

    messages.value.push({
      sender: 'bot',
      name: 'AI Assistant',
      content: res.data.reply,
      time: new Date(),
    });

  } catch (err) {
    messages.value.push({
      sender: 'chatbot',
      name: 'AI Assistant',
      content: " Sorry, I couldn't connect to the AI server. Please try again later ",
      time: new Date(),
    });
  } finally {
    isSending.value = false
  }

  scrollToBottom();
}

// auto scroll
const chatContainer = ref(null)
function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// format time
function formatTime(time) {
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// auto scroll
onMounted(() => scrollToBottom())
watch(messages, () => scrollToBottom())
</script>

<template>
  <div class="flex flex-col h-full border-2 rounded-2xl overflow-hidden bg-cream border-greenSoft">

    <!-- Header -->
    <div class="bg-list ">
      <WordsUI word-class="CHAT" text-color-class="text-cream"/>
    </div>

    <!-- chat section -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-3 space-y-3">

      <div v-for="(msg, index) in messages" :key="index" class="flex"
      :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'">

      <div class="max-w-[70%] p-3 rounded-2xl shadow-md bg-ivory text-greenSoft">
        
        <div class="text-[20px] font-bold mb-1 text-wordSubTitle">{{ msg.name }}</div>

        <div class="whitespace-pre-wrap font-semibold text-[20px] break-words">{{ msg.content }}</div>

        <div class="text-xs text-greenSoft mt-1 text-right">{{ formatTime(msg.time) }}</div>

      </div>

    </div>

    </div>

    <!-- enter section -->
    <div class="flex items-center p-3 border-t flex-none gap-2 border-greenSoft">
      <InputUI v-model:input-value="inputMessage" @keyup.enter="sendMessage" name-of-placeholder="ask something..."/>
      <ButtonUI word-class="send" @update:word-class="sendMessage" width-class="w-[20%]"/>
    </div>
  </div>
</template>

<style scoped>

</style>
