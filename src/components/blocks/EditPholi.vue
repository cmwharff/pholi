<script setup lang="ts">
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger
} from '@/components/ui/context-menu'
import Slider from '../ui/slider/Slider.vue'
import { mediaHandler, type SizeType, type GridItem } from '@/lib/mediaHandler'

const { pholi, onDrop, onDragStart, widthConfig, heightConfig, getSrc, removeItem, changeWidth, width, changeHeight, height } = mediaHandler()

</script>

<template>
    <div class="grid grid-cols-16 m-4 rounded-3xl bg-sky-950 border-sky-950 border-4 p-2">
        <template v-for="(row, rowIndex) in pholi" :key="rowIndex">
            <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`"
                class="relative overflow-visible aspect-square outline-1 outline-dashed rounded-lg m-0"
                @dragover.prevent @drop="onDrop(rowIndex, colIndex)">
                <div v-if="cell && 'id' in cell && cell.id !== 'block'" draggable="true"
                    @dragstart="onDragStart(cell as GridItem)" :class="[
                        widthConfig[(cell as GridItem).width as SizeType],
                        heightConfig[(cell as GridItem).height as SizeType],
                        'absolute top-0 left-0 flex items-center justify-center text-xs cursor-move text-white overflow-hidden'
                    ]">
                    <ContextMenu class="w-full h-full">
                        <ContextMenuTrigger class="w-full h-full p-2">
                            <img :src="getSrc((cell as GridItem).id)" :alt="(cell as GridItem).label"
                                class="object-cover w-full h-full border-4 border-sky-700 rounded-3xl" />
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem @click="removeItem(cell.id)" inset>
                                Remove
                            </ContextMenuItem>
                            <ContextMenuSub>
                                <ContextMenuSubTrigger inset>
                                    Width
                                </ContextMenuSubTrigger>
                                <ContextMenuSubContent class="p-3">
                                    <Slider :default-value="[2]" :max="16" :min="1" :step="1" v-model="width"
                                        @update:modelValue="newValue => changeWidth(newValue, cell.id)" />
                                </ContextMenuSubContent>
                            </ContextMenuSub>
                            <ContextMenuSub>
                                <ContextMenuSubTrigger inset>
                                    Height
                                </ContextMenuSubTrigger>
                                <ContextMenuSubContent class="p-3">
                                    <Slider :default-value="[2]" :max="9" :min="1" :step="1" v-model="height"
                                        @update:modelValue="newValue => changeHeight(newValue, cell.id)" />
                                </ContextMenuSubContent>
                            </ContextMenuSub>
                        </ContextMenuContent>
                    </ContextMenu>
                </div>
            </div>
        </template>
    </div>
</template>