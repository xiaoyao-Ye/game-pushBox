<template>
  <div class="h-screen flex justify-center items-center">
    <div>
      <div class="flex" v-for="(row, rowIndex) in map" :key="rowIndex">
        <div class="w-14 h-14" :class="[mapBackGround[col]]" v-for="(col, colIndex) in row" :key="colIndex"></div>
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
import { onKeyUp } from '@vueuse/core'

const level = ref<number>(1)
const personLocation = ref<number[]>([])
const map = ref<number[][]>([])
const mapBackGround = ref<{ [key: number]: any }>({
  0: 'bg-white', // road 地面
  1: 'bg-blue', // wall 墙壁
  2: 'bg-indigo', // person 人
  4: 'bg-orange', // box 初始化位置
  5: 'bg-black', // box 目标位置
})

const initGame = () => {
  map.value = maps.slice(level.value - 1, 1)[0]
  map.value.forEach((row, rowIndex) => {
    if (row.includes(2)) {
      const colIndex = row.findIndex((item) => item === 2)
      personLocation.value = [rowIndex, colIndex]
    }
  })

  setKeyboardEvents('ArrowDown')
  setKeyboardEvents('ArrowUp')
  setKeyboardEvents('ArrowLeft')
  setKeyboardEvents('ArrowRight')
}

type Direction = 'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight'

const setKeyboardEvents = (key: Direction) => {
  onKeyUp(key, (e: any) => {
    move(key)
    e.preventDefault()
  })
}

const move = (direction: Direction) => {
  // 计算位置
  const targetLocation = getTargetLocation(direction)
  const [rowIndex, colIndex] = personLocation.value
  const [targetRowIndex, targetColIndex] = targetLocation

  // TODO: 判断是否可以移动
  if (map.value[targetRowIndex][targetColIndex])
    // 移动
    map.value[rowIndex][colIndex] = 0
  map.value[targetRowIndex][targetColIndex] = 2
  personLocation.value = [targetRowIndex, targetColIndex]
}

const getTargetLocation = (direction: Direction) => {
  const [rowIndex, colIndex] = personLocation.value
  let targetLocation: number[] = []
  switch (direction) {
    case 'ArrowDown':
      targetLocation = [rowIndex + 1, colIndex]
      break
    case 'ArrowUp':
      targetLocation = [rowIndex - 1, colIndex]
      break
    case 'ArrowLeft':
      targetLocation = [rowIndex, colIndex - 1]
      break
    case 'ArrowRight':
      targetLocation = [rowIndex, colIndex + 1]
      break
  }
  return targetLocation
}
// 封装逻辑复用
// 利用计算属性(是否过关? 移动?)
// person 只在移动碰到箱子时, 调用通关检测
// person 前面不是墙壁 || 前面的箱子的前面不是墙壁, 都可行走
// person 从箱子终点移出时, 需要复原箱子终点颜色!?

initGame()
</script>

<style scoped></style>
