<template>
  <div class="h-screen flex justify-center items-center">
    <div class="relative">
      <div class="flex" v-for="(row, rowIndex) in mapBG" :key="rowIndex">
        <div class="w-14 h-14" :class="[mapFloorBackGround[col]]" v-for="(col, colIndex) in row" :key="colIndex"></div>
      </div>
      <div class="absolute top-0 left-0">
        <div class="flex" v-for="(row, rowIndex) in map" :key="rowIndex">
          <div class="w-14 h-14" :class="[mapBackGround[col]]" v-for="(col, colIndex) in row" :key="colIndex"></div>
        </div>
      </div>
    </div>

    <div class="text-6">
      <div>第{{ level }}关</div>
      <div @click="initGame">重新kaishi</div>
      <div @click="onPreLevel">上一关</div>
      <div @click="onNextLevel">下一关</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { maps } from '@/utils/maps'

const level = ref<number>(1)
const personLocation = ref<number[]>([])
const boxTargetLocation = ref<number[][]>([])
const mapBG = ref<number[][]>([])
const map = ref<number[][]>([])
const mapFloorBackGround = ref<{ [key: number]: any }>({
  0: 'bg-floor', // road 地面
  1: 'bg-wall', // wall 墙壁
  2: 'bg-floor', // person 人
  4: 'bg-floor', // box 初始化位置
  5: 'bg-black', // box 目标位置
  6: 'bg-black', // box 初始位置 + 目标位置 重叠
})
const mapBackGround = ref<{ [key: number]: any }>({
  // 0: 'bg-white', // road 地面
  // 1: 'bg-blue', // wall 墙壁
  // 2: 'transparent', // person 人
  2: 'bg-pig', // person 人
  4: 'bg-box', // box 初始化位置
  // 5: 'bg-black', // box 目标位置
  6: 'bg-orange', // box 初始化位置 + 目标位置 重叠
})

const onPreLevel = () => {
  if (level.value <= 1) return
  level.value -= 1
  initGame()
}
const onNextLevel = () => {
  if (level.value >= 42) return
  level.value += 1
  initGame()
}

const initGame = () => {
  // console.log(maps)
  // console.log(level.value)
  boxTargetLocation.value.length = 0
  mapBG.value = JSON.parse(JSON.stringify(maps.slice(level.value - 1, level.value)[0]))
  map.value = JSON.parse(JSON.stringify(maps.slice(level.value - 1, level.value)[0]))
  // console.log('map', map.value)
  map.value.forEach((row, rowIndex) => {
    // 记录人的位置
    if (row.includes(2)) {
      const colIndex = row.findIndex((item) => item === 2)
      personLocation.value = [rowIndex, colIndex]
    }
    // 记录箱子的终点位置
    if (row.includes(5) || row.includes(6)) {
      row.forEach((col, colIndex) => {
        if (col === 5 || col === 6) {
          boxTargetLocation.value.push([rowIndex, colIndex])
        }
      })
    }
  })
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
  const [rowIndex, colIndex] = personLocation.value
  const targetLocation = getTargetLocation(direction, rowIndex, colIndex)
  const [targetRowIndex, targetColIndex] = targetLocation

  // 判断是否可以移动
  const targetValue = map.value[targetRowIndex][targetColIndex]
  const [nextTargetRowIndex, nextTargetColIndex] = getTargetLocation(direction, targetRowIndex, targetColIndex)
  const nextTargetValue = map.value[nextTargetRowIndex][nextTargetColIndex]

  // 碰到墙壁无法移动
  const hitWall = targetValue === 1
  // 推到箱子, 并且箱子后面不是地板, 推不动
  const notFloor = (targetValue === 4 || targetValue === 6) && nextTargetValue !== 0 && nextTargetValue !== 5
  if (hitWall || notFloor) return

  // 移动人
  map.value[rowIndex][colIndex] = 0
  map.value[targetRowIndex][targetColIndex] = 2
  personLocation.value = [targetRowIndex, targetColIndex]

  // 移动箱子(可以移动, 并且推到箱子)
  if (targetValue === 4 || targetValue === 6) {
    map.value[nextTargetRowIndex][nextTargetColIndex] = 4
    // 箱子有移动, 判断是否过关
    const isPass = boxTargetLocation.value.every(([rowIndex, colIndex]) => map.value[rowIndex][colIndex] === 4)
    if (isPass) {
      level.value += 1
      initGame()
    }
  }
}

const getTargetLocation = (direction: Direction, rowIndex: number, colIndex: number) => {
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
// 利用计算属性(是否过关? 移动?)
// person 从箱子终点移出时, 需要复原箱子终点颜色!?

onMounted(() => {
  initGame()
  setKeyboardEvents('ArrowDown')
  setKeyboardEvents('ArrowUp')
  setKeyboardEvents('ArrowLeft')
  setKeyboardEvents('ArrowRight')
})
</script>

<style scoped>
.bg-box {
  background-image: url('/images/box.png');
  background-size: contain;
}
.bg-pig {
  background-image: url('/images/pig.png');
  background-size: contain;
}
.bg-floor {
  background-image: url('/images/floor.png');
  background-size: contain;
}
.bg-wall {
  background-image: url('https://api.iconify.design/game-icons:abstract-025.svg');
  background-size: contain;
  background-color: #333;
}
</style>
