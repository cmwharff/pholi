import { ref, computed } from 'vue'

export type AspectType = 1 | 2 | 0.5
export type SizeType = 1 | 2 | 3 | 4

export interface GridItem {
    id: string
    label: string
    size: number
    aspect: number
    primary: boolean
    src: string
}

interface BlockCell {
    id: 'block'
    ownerId: string
}

type GridCell = GridItem | BlockCell | null
type GridMatrix = GridCell[][]

const COLS = 16
const ROWS = 9

const grid = ref<GridMatrix>(
    Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => null)
    )
)

const items = ref<GridItem[]>([
    { id: 'a', label: 'a: xs square', size: 1, aspect: 1, primary: true, src: 'standin/temp-1.jpeg' },
    { id: 'b', label: 'b: sm wide', size: 2, aspect: 0.5, primary: true, src: 'standin/temp-2.jpeg' },
    { id: 'c', label: 'c: lg square', size: 4, aspect: 1, primary: true, src: 'standin/temp-3.jpeg' },
    { id: 'd', label: 'd: md tall', size: 3, aspect: 2, primary: true, src: 'standin/temp-1.jpeg' },
    { id: 'e', label: 'e: sm tall', size: 2, aspect: 2, primary: true, src: 'standin/temp-2.jpeg' }
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
    const width = item.size
    const height = width * item.aspect

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
