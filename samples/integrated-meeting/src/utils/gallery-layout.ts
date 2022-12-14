interface Grid {
    rows: number;
    cols: number;
    count: number;
}
/**
 * Generates array of possible variants to place "n" cell
 * @param {number} n
 * @return {Grid[]}
 */
function generateGrids(n: number): Grid[] {
    return new Array(n).fill(1).map((_, i) => {
        const rows = i + 1;
        const cols = Math.ceil(n / rows);
        const count = cols * rows;

        return { cols, rows, count };
    });
}

export interface FinalGridRule {
    rows: number;
    cols: number;
    isWidthLimited: boolean;
}

export function calculateFinalGridRule(maxCount) {
    const gridsArray = Array(maxCount)
        .fill(0)
        .map((_, i) => generateGrids(i + 1));

    return function (cellCount, viewportAspectRatio, cellAspectRatio) {
        let maxCriteria = 0;

        let result = { cols: 1, rows: 1, isWidthLimited: true };

        gridsArray[cellCount - 1]?.forEach(shape => {
            const a = (shape.cols / shape.rows) * cellAspectRatio;

            const fillRatio = cellCount / shape.count;

            const isWidthLimited = a >= viewportAspectRatio;

            const criteria =
                fillRatio * (isWidthLimited ? viewportAspectRatio / a : a / viewportAspectRatio);
            if (criteria > maxCriteria) {
                maxCriteria = criteria;
                result = { cols: shape.cols, rows: shape.rows, isWidthLimited };
            }
        });

        return result;
    };
}
