<template>
  <div class="h-screen flex justify-center items-center">
    <div>
      <div class="flex" v-for="(item, j) in map" :key="j">
        <div class="w-14 h-14" :class="[mapBackGround[chunk]]" v-for="(chunk, k) in item" :key="k"></div>
      </div>
    </div>
    <div class="text-6">
      <div>第{{ level }}关</div>
      <div>重新kaishi</div>
      <div>上一关</div>
      <div>下一关</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { maps } from '@/utils/maps'
import { ref } from 'vue'

console.log(maps)

const level = ref<number>(1)
const map = ref<number[][]>([])
const mapBackGround = ref<{ [key: number]: any }>({
  0: 'bg-white', // road 地面
  1: 'bg-blue', // wall 墙壁
  2: 'bg-indigo', // person 人
  4: 'bg-orange', // box 初始化位置
  5: 'bg-black', // box 目标位置
})

console.log(map)

const initGame = () => {
  map.value = maps.slice(level.value - 1, 1)[0]
}

initGame()
</script>

<style scoped></style>
