<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import ButtonUI from '../UI/ButtonUI.vue';
import ModalUI from '../UI/ModalUI.vue';
import WordsUI from '../UI/WordsUI.vue';
import ModalCloseUI from '../UI/ModalCloseUI.vue';
import TextAreaUI from '../UI/TextAreaUI.vue';

const props = defineProps({
    userMenuModalVisible:{type:Boolean, default:false},
    pendingType:{type:String, default:''},
    userName:{type:String, default:''},
    userSID:{type:String, default:''},
    userEmail:{type:String, default:''},
    contactNo:{type:String, default:''},
    remark:{type:String, default:''},
})

const emit = defineEmits(['update:userMenuModalVisible','approveClicked','rejectClicked', 'update:remark'])
console.log('username is ' + props.userName)

function MenuClosing(){
    emit('update:userMenuModalVisible',false)
}

function aprroving(){
    emit('approveClicked')
}

function rejecting(){
    emit('rejectClicked')
}

</script>

<template>

    <!--pending information modal-->
  <ModalUI name="forgot password" :visible="userMenuModalVisible" width-class="w-auto" height-class="h-auto">
    <div class="flex gap-2">
        <ModalCloseUI @close-modal="MenuClosing"/>
        <WordsUI :word-class="`${pendingType} Menu`"/>
    </div>

    <div class="flex  flex-col border-greenSoft border-t-2 border-b-2 gap-2 py-2 ">
        <div class="flex gap-2">
            <WordsUI word-class="Name:"/>
            <WordsUI :word-class="`${userName}`"/>
        </div>
        <div v-if="pendingType === 'Student' "class="flex gap-2">
            <WordsUI word-class="Student ID:"/>
            <WordsUI :word-class="`${userSID}`"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Email:"/>
            <WordsUI :word-class="`${userEmail}`"/>
        </div>
        <div class="flex gap-2">
            <WordsUI word-class="Contact No:"/>
            <WordsUI :word-class="`${contactNo}`"/>
        </div>
        
    </div>

    <div class="h-2"></div>

    <div class="flex gap-2 justify-end">
        <ButtonUI word-class="Approve" @update:word-class="aprroving"/>
        <ButtonUI word-class="Reject" @update:word-class="rejecting"/>
    </div>

    <WordsUI word-class="Remark:"/>

    <TextAreaUI :inputValue="remark" :rows="5" :maxLength="300" widthClass="w-[100%]" @update:input-value="val => emit('update:remark',val)"/>

  </ModalUI>

</template>
<style>
</style>