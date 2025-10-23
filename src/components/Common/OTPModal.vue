<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import axios from 'axios'
import ButtonUI from '../UI/ButtonUI.vue';
import ModalUI from '../UI/ModalUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import InputUI from '../UI/InputUI.vue';
import ModalCloseUI from '../UI/ModalCloseUI.vue';

const props = defineProps({
    otpModalVisible:{type:Boolean, default:false},
    otpCode:{type:String, default:''},
    email:{type:String, default:''},
    role:{type:String, default:''},
})

const emit = defineEmits(['update:otpModalVisible', 'update:otpCode', 'startLogin'])

const warningMessage = ref('')

async function otpCodeCheck() {
    console.log('email and role is', props.email, props.role)
    if (!props.otpCode) {
        warningMessage.value = 'please fill in the OTP code!'
        return;
    } else {
        warningMessage.value = 'start checking OTP code.......'
        try {
            const res = await axios.post('http://localhost:3000/api/auth/otpCodeCheck', {
                role: props.role,
                email: props.email,
                otp: props.otpCode
            })

            if(!res.data.successfully) {
                warningMessage.value = res.data.message
                emit('update:otpCode','')
                return;

            } else if (res.data.successfully) {
                warningMessage.value = res.data.message
                emit('startLogin')
                emit('update:otpCode','')
                return
            }
        
        } catch (err) { // catch error if failed
        console.error(err)
        alert('Verify failed: ' + (err.response?.data?.message || err.message))
    }
}
}

</script>

<template>
      <!--login MFA modal-->
  <ModalUI name="Login MFA" :visible="otpModalVisible" width-class="w-[50%]" height-class="h-auto">

    <div class="flex gap-2">
        <ModalCloseUI @close-modal="emit('update:otpModalVisible',false)"/>
        <WordsUI word-class="Enter the code"/>
    </div>

    <div class="flex flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        
        <div class="flex gap-2 justify-between">
          <WordsUI word-class="OTP Code:"/>
          <InputUI width-class="w-[70%]" :input-value="otpCode" @update:input-value="val => emit('update:otpCode',val)"/>
        </div>

        <div class="flex gap-2 justify-between">
          <WordsUI word-class="A code has been send to your email, 
          please check it and type the code here to proceed to Login within 5 minutes."/>
        </div>
    
    </div>

    <div class="flex justify-end py-2">
      <ButtonUI word-class="Login" width-class="w-[15%]" @update:word-class="otpCodeCheck"/>
    </div>

    <div class="flex justify-end py-2">
      <WordsUI :word-class="warningMessage"/>
    </div>

  </ModalUI>
</template>
<style>
</style>