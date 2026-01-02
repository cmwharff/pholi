<script setup lang="ts">
import {
    editPholiHandler,
    type GridItem,
    type AspectType,
    type SizeType,
    aspectConfig,
    sizeConfig,
    ROWS,
    COLS
} from '@/lib/editPholiHandler'
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger
} from '@/components/ui/context-menu'

const { grid, onDrop, onDragStart, stagedItems } = editPholiHandler()

function getIndex(id: string) {
    return stagedItems.value.findIndex(item => item.id === id)
}

function removeItem(id: string) {
    changeAspect(id, 1)
    changeSize(id, 1)
    for (let r = 0; r < ROWS; r++) {
        const gridRow = grid.value[r]
        if (!gridRow) continue
        for (let c = 0; c < COLS; c++) {
            const cell = gridRow[c]
            if (!cell) continue
            if ('ownerId' in cell && cell.ownerId === id) gridRow[c] = null
            if ('id' in cell && cell.id === id) gridRow[c] = null
        }
    }
}

function changeAspect(id: string, ratio: number) {
    const index = getIndex(id)
    if (stagedItems.value[index])
        stagedItems.value[index].aspect = ratio as AspectType
}

function changeSize(id: string, size: number) {
    const index = getIndex(id)
    if (stagedItems.value[index])
        stagedItems.value[index].size = size as SizeType
}
</script>

<template>
    <div class="grid grid-cols-16 m-4 rounded-3xl bg-sky-950 border-sky-950 border-4 p-2">
        <template v-for="(row, rowIndex) in grid" :key="rowIndex">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`"
                class="relative overflow-visible aspect-square outline-1 outline-dashed rounded-lg m-0"
                @dragover.prevent @drop="onDrop(rowIndex, colIndex)">
                <div v-if="cell && 'id' in cell && cell.id !== 'block'" draggable="true"
                    @dragstart="onDragStart(cell as GridItem)" :class="[
                        aspectConfig[(cell as GridItem).aspect as AspectType],
                        sizeConfig[(cell as GridItem).size as SizeType],
                        'absolute top-0 left-0 flex items-center justify-center text-xs cursor-move text-white overflow-hidden'
                    ]">
                    <ContextMenu class="w-full h-full">
                        <ContextMenuTrigger class="w-full h-full p-2">
                            <img :src="(cell as GridItem).src" :alt="(cell as GridItem).label"
                                class="object-cover w-full h-full border-4 border-sky-700 rounded-3xl" />
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem @click="removeItem(cell.id)" inset>
                                Remove
                            </ContextMenuItem>
                            <ContextMenuSub>
                                <ContextMenuSubTrigger inset>
                                    Change aspect ratio
                                </ContextMenuSubTrigger>
                                <ContextMenuSubContent>
                                    <ContextMenuItem @click="changeAspect(cell.id, 1)" inset>
                                        Square
                                    </ContextMenuItem>
                                    <ContextMenuItem @click="changeAspect(cell.id, 2)" inset>
                                        Tall
                                    </ContextMenuItem>
                                    <ContextMenuItem @click="changeAspect(cell.id, 0.5)" inset>
                                        Wide
                                    </ContextMenuItem>
                                </ContextMenuSubContent>
                            </ContextMenuSub>
                            <ContextMenuSub>
                                <ContextMenuSubTrigger inset>
                                    Change size
                                </ContextMenuSubTrigger>
                                <ContextMenuSubContent>
                                    <ContextMenuItem @click="changeSize(cell.id, 2)" inset>
                                        Extra Small
                                    </ContextMenuItem>
                                    <ContextMenuItem @click="changeSize(cell.id, 3)" inset>
                                        Small
                                    </ContextMenuItem>
                                    <ContextMenuItem @click="changeSize(cell.id, 4)" inset>
                                        Medium
                                    </ContextMenuItem>
                                    <ContextMenuItem @click="changeSize(cell.id, 5)" inset>
                                        Large
                                    </ContextMenuItem>
                                </ContextMenuSubContent>
                            </ContextMenuSub>
                        </ContextMenuContent>
                    </ContextMenu>

                </div>
            </div>
        </template>
    </div>
</template>