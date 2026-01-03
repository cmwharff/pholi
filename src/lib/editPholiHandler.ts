import { ref, computed } from 'vue'

export type SizeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

export interface GridItem {
    id: string
    label: string
    width: SizeType
    height: SizeType
    primary: boolean
    src: string
}

export const widthConfig: Record<SizeType, string> = {
    1: 'w-[100%]',
    2: 'w-[200%]',
    3: 'w-[300%]',
    4: 'w-[400%]',
    5: 'w-[500%]',
    6: 'w-[600%]',
    7: 'w-[700%]',
    8: 'w-[800%]',
    9: 'w-[900%]',
    10: 'w-[1000%]',
    11: 'w-[1100%]',
    12: 'w-[1200%]',
    13: 'w-[1300%]',
    14: 'w-[1400%]',
    15: 'w-[1500%]',
    16: 'w-[1600%]'
}

export const heightConfig: Record<SizeType, string> = {
    1: 'h-[100%]',
    2: 'h-[200%]',
    3: 'h-[300%]',
    4: 'h-[400%]',
    5: 'h-[500%]',
    6: 'h-[600%]',
    7: 'h-[700%]',
    8: 'h-[800%]',
    9: 'h-[900%]',
    10: 'h-[1000%]',
    11: 'h-[1100%]',
    12: 'h-[1200%]',
    13: 'h-[1300%]',
    14: 'h-[1400%]',
    15: 'h-[1500%]',
    16: 'h-[1600%]'
}

interface BlockCell {
    id: 'block'
    ownerId: string
}

export type GridCell = GridItem | BlockCell | null
type GridMatrix = GridCell[][]

export const COLS = 16
export const ROWS = 9

const grid = ref<GridMatrix>(
    Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => null)
    )
)

const items = ref<GridItem[]>([
    { id: 'a', label: 'a: xs square', width: 2, height: 2, primary: true, src: 'standin/temp-1.jpeg' },
    { id: 'b', label: 'b: sm wide', width: 2, height: 2, primary: true, src: 'standin/temp-2.jpeg' },
    { id: 'c', label: 'c: lg square', width: 2, height: 2, primary: true, src: 'standin/temp-3.jpeg' },
    { id: 'd', label: 'd: md tall', width: 2, height: 2, primary: true, src: 'standin/temp-4.jpeg' },
    { id: 'e', label: 'e: sm tall', width: 2, height: 2, primary: true, src: 'standin/temp-5.jpeg' }
])

const draggedItem = ref<GridItem | null>(null)

const unplacedItems = computed(() =>
    items.value.filter(
        item => !grid.value.some(row =>
            row.some(cell => (cell as GridItem)?.id === item.id)
        )
    )
)

const stagedItems = computed(() =>
    items.value.filter(
        item => grid.value.some(row =>
            row.some(cell => (cell as GridItem)?.id === item.id)
        )
    )
)

function onDragStart(item: GridItem) {
    draggedItem.value = item
}

function onDrop(row: number, col: number) {
    if (!draggedItem.value) return

    const item = draggedItem.value
    const width = item.width
    const height = item.height

    if (col + width > COLS || row + height > ROWS) return

    // Clear previous placement
    for (let r = 0; r < ROWS; r++) {
        const gridRow = grid.value[r]
        if (!gridRow) continue
        for (let c = 0; c < COLS; c++) {
            const cell = gridRow[c]
            if (!cell) continue
            if ('ownerId' in cell && cell.ownerId === item.id) gridRow[c] = null
            if ('id' in cell && cell.id === item.id) gridRow[c] = null
        }
    }

    // Fill blocks
    for (let r = 0; r < height; r++) {
        const gridRow = grid.value[row + r]
        if (!gridRow) continue
        for (let c = 0; c < width; c++) {
            gridRow[col + c] = { id: 'block', ownerId: item.id }
        }
    }

    grid.value[row]![col] = item
    draggedItem.value = null
}

export function editPholiHandler() {
    return {
        grid,
        unplacedItems,
        stagedItems,
        onDragStart,
        onDrop
    }
}
