<script setup lang="ts">
import { mediaHandler, type SizeType, type GridItem } from '@/lib/mediaHandler'

const { pholi, widthConfig, heightConfig, getSrc } = mediaHandler()

</script>

<template>
    <div class="grid grid-cols-16 rounded-3xl bg-sky-950 border-sky-950 border-4 p-2">
        <template v-for="(row, rowIndex) in pholi" :key="rowIndex">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`"
                class="relative overflow-visible aspect-square rounded-lg m-0">
                <div v-if="cell && 'id' in cell && cell.id !== 'block'" :class="[
                    widthConfig[(cell as GridItem).width as SizeType],
                    heightConfig[(cell as GridItem).height as SizeType],
                    'absolute top-0 left-0 flex items-center justify-center text-xs text-white overflow-hidden'
                ]">
                    <div class="w-full h-full p-2">
                        <img :src="getSrc((cell as GridItem).id)" :alt="(cell as GridItem).label"
                            class="object-cover w-full h-full border-4 border-sky-700 bg-sky-700 rounded-3xl" />
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>