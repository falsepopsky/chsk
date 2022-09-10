import { Scale } from './types'
import { isContinuousAxisScale } from './axis'
import { isCategoricalColorScale, isColorScale, isContinuousColorScale } from './color'

/** get an array of (numeric) ticks in the scale domain */
export const getTicks = (scale: Scale, ticks: number[] | string[] | number | undefined) => {
    if (Array.isArray(ticks)) return ticks
    if (isContinuousColorScale(scale) || isContinuousAxisScale(scale)) {
        if (ticks === undefined) return scale.ticks(4) as Array<number>
        return scale.ticks(ticks) as Array<number>
    }
    if (isCategoricalColorScale(scale)) {
        return scale.domain().map((v, i) => i) as Array<number>
    }
    return scale.domain()
}

/** get an array of ticks in the scale range */
export const getTickCoordinates = (
    scale: Scale,
    values: undefined | number | number[] | string[],
    shift = 0,
    size = 0 // only used for color scales
) => {
    const tickValues = getTicks(scale, values)
    if (isColorScale(scale)) {
        if (isCategoricalColorScale(scale)) return []
        const domain = scale.domain()
        const domainSize = domain[domain.length - 1] - domain[0]
        const result = tickValues.map(v => (size * (Number(v) - domain[0])) / domainSize)
        // for vertical color scales (size < 0), adjust the mapping to make low-high go from bottom-to-top
        return size < 0 ? result.map(v => Math.abs(size) + v) : result
    }
    if (isContinuousAxisScale(scale)) {
        return tickValues.map(v => scale(Number(v)))
    }
    const scaledShift = Number(shift) * scale.bandwidth()
    return tickValues.map(v => scale(String(v)) + scaledShift)
}
