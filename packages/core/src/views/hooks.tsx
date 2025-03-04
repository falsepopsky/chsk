import {
    getAnchoredOrigin,
    PositionSpec,
    FourSideSizeSpec,
    SizeSpec,
    AnchorSpec,
    PositionUnits,
    SizeUnits,
    useDimensions,
    X,
    Y,
    LEFT,
    TOP,
    zeroPadding,
    getInnerSize,
} from '../general'
import { getDimensionsProps } from '../general/dimensions'
import { getAbsolutePosition, useScales } from '../scales'
import { useMemo } from 'react'

export const useView = ({
    position,
    positionUnits = 'absolute',
    size,
    sizeUnits = 'absolute',
    padding = zeroPadding,
    anchor,
}: {
    position: PositionSpec
    positionUnits?: PositionUnits
    size: SizeSpec
    sizeUnits?: SizeUnits
    padding?: FourSideSizeSpec
    anchor: AnchorSpec
}) => {
    const dimensions = useDimensions()
    const scales = useScales()
    const { dimsProps, origin, innerSize } = useMemo(() => {
        const dimsProps = getDimensionsProps(size, sizeUnits, dimensions.size, padding)
        const innerSize = getInnerSize(dimsProps.size, padding)
        const pos = getAbsolutePosition(position, positionUnits, dimensions.size, scales)
        const origin = getAnchoredOrigin(pos, dimsProps.size, anchor)
        return { dimsProps, origin, innerSize }
    }, [position, positionUnits, size, sizeUnits, padding, anchor, dimensions, scales])
    const x = origin[X] + padding[LEFT]
    const y = origin[Y] + padding[TOP]
    const translate = 'translate(' + x + ',' + y + ')'
    return { dimensions, dimsProps, origin, translate, x, y, innerSize }
}
