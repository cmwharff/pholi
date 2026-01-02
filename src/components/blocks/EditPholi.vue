<script setup lang="ts">
import { editPholiHandler, type GridItem } from '@/lib/editPholiHandler';

const { grid, onDrop, onDragStart } = editPholiHandler()

type AspectType = 1 | 2 | 0.5
type SizeType = 1 | 2 | 3 | 4

const aspectConfig: Record<AspectType, string> = {
    1: 'aspect-square',
    0.5: 'aspect-2/1',
    2: 'aspect-1/2'
}

const sizeConfig: Record<SizeType, string> = {
    1: 'w-[100%]',
    2: 'w-[200%]',
    3: 'w-[300%]',
    4: 'w-[400%]'
}
</script>

<template>
    <div class="grid grid-cols-16 m-4 rounded-3xl bg-sky-950 border-sky-950 border-4 p-4">
        <template v-for="(row, rowIndex) in grid" :key="rowIndex">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`"
                class="relative overflow-visible aspect-square outline-2 outline-dashed rounded-lg m-0"
                @dragover.prevent @drop="onDrop(rowIndex, colIndex)">
                <div v-if="cell && 'id' in cell && cell.id !== 'block'" draggable="true"
                    @dragstart="onDragStart(cell as GridItem)" :class="[
                        aspectConfig[(cell as GridItem).aspect as AspectType],
                        sizeConfig[(cell as GridItem).size as SizeType],
                        'absolute top-0 left-0 flex items-center justify-center text-xs cursor-move text-white rounded border-4 border-sky-700 bg-amber-400 overflow-hidden'
                    ]">
                    <img :src="(cell as GridItem).src" :alt="(cell as GridItem).label" class="object-cover border-0 w-full h-full"/>
                </div>
            </div>
        </template>
    </div>
</template>