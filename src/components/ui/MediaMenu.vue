<script setup lang="ts">
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger
} from '@/components/ui/context-menu'
import { editPholiHandler, type GridItem, type AspectType, type SizeType } from '@/lib/editPholiHandler'

const { grid } = editPholiHandler()
const props = defineProps({
    item: {
        type: Object,
        required: true,
        default: () => ({})
    }
})

function removeItem(id: string) {
    const index = grid.value.findIndex(item => (item as unknown as GridItem).id == id)
    grid.value.splice(index, 1);
}

function changeAspect(id: string, ratio: number) {
    const index = grid.value.findIndex(item => (item as unknown as GridItem).id == id)
    if (grid.value[index])
        (grid.value[index] as unknown as GridItem).aspect = ratio as AspectType;
}

function changeSize(id: string, size: number) {
    const index = grid.value.findIndex(item => (item as unknown as GridItem).id == id)
    if (grid.value[index])
        (grid.value[index] as unknown as GridItem).size = size as SizeType;
}
</script>


<template>
    <ContextMenu>
        <ContextMenuTrigger>
            <img :src="item.src" alt="media"
                class='w-full h-full max-h-full rounded-3xl border-sky-950 border-5 object-cover' />
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem @click="removeItem(item.id)" inset>
                Remove
            </ContextMenuItem>
            <ContextMenuSub>
                <ContextMenuSubTrigger inset>
                    Change aspect ratio
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                    <ContextMenuItem @click="changeAspect(item.id, 1)" inset>
                        Square
                    </ContextMenuItem>
                    <ContextMenuItem @click="changeAspect(item.id, 2)" inset>
                        Tall
                    </ContextMenuItem>
                    <ContextMenuItem @click="changeAspect(item.id, 0.5)" inset>
                        Wide
                    </ContextMenuItem>
                </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub>
                <ContextMenuSubTrigger inset>
                    Change size
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                    <ContextMenuItem @click="changeSize(item.id, 1)" inset>
                        Extra Small
                    </ContextMenuItem>
                    <ContextMenuItem @click="changeSize(item.id, 2)" inset>
                        Small
                    </ContextMenuItem>
                    <ContextMenuItem @click="changeSize(item.id, 3)" inset>
                        Medium
                    </ContextMenuItem>
                    <ContextMenuItem @click="changeSize(item.id, 4)" inset>
                        Large
                    </ContextMenuItem>
                </ContextMenuSubContent>
            </ContextMenuSub>
        </ContextMenuContent>
    </ContextMenu>
</template>