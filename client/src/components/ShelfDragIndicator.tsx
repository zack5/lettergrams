import { GRID_SIZE, SHELF_PADDING, SHELF_MIN_TILE_COUNT_FOR_WIDTH } from "../constants/Constants"

export default function ShelfDragIndicator({hoveredShelfSlot, shelvedLetterCount}: {hoveredShelfSlot: number, shelvedLetterCount: number}) {
    const offset = Math.max(0, SHELF_MIN_TILE_COUNT_FOR_WIDTH - shelvedLetterCount) * GRID_SIZE / 2;
    return (
        <div 
            className="shelf-drag-indicator"
            style={{
                position: 'absolute',
                left: hoveredShelfSlot * GRID_SIZE + SHELF_PADDING + offset,
                top: '10%',
                width: 0,
                height: '80%',
            }}
        />
    )
}