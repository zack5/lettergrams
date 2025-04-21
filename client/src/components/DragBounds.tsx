type DragBoundsProps = {
    startPosition: { x: number; y: number };
    currentPosition: { x: number; y: number };
};

export default function DragBounds({ startPosition, currentPosition }: DragBoundsProps) {
    const width = Math.abs(currentPosition.x - startPosition.x);
    const height = Math.abs(currentPosition.y - startPosition.y);
    const left = Math.min(currentPosition.x, startPosition.x);
    const top = Math.min(currentPosition.y, startPosition.y);
    const style: React.CSSProperties = {
        position: 'absolute',
        left: left,
        top: top,
        width: width,
        height: height,
    };
    return (
        <div className="drag-bounds" style={style}>
        </div>
    )
}