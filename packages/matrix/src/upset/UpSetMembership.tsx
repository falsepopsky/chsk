import { UpSetMembershipProps } from './types'
import { Circle, getMinMax, Line, X, Y } from '@chsk/core'
import { createElement } from 'react'

export const UpSetMembership = ({
    positions,
    r,
    symbol = Circle,
    line = Line,
    symbolStyle,
    lineStyle,
}: UpSetMembershipProps) => {
    const xCoordinates = getMinMax(positions.map(coords => coords[X]))
    const yCoordinates = getMinMax(positions.map(coords => coords[Y]))
    const drawLine = xCoordinates[0] != xCoordinates[1] || yCoordinates[0] != yCoordinates[1]
    const lineElement = createElement(line, {
        key: 'line',
        x1: xCoordinates[0],
        x2: xCoordinates[1],
        y1: yCoordinates[0],
        y2: yCoordinates[1],
        style: lineStyle,
        setRole: false,
    })
    const symbolElements = positions.map((position, index) =>
        createElement(symbol, {
            key: 'symbol-' + index,
            cx: position[0],
            cy: position[1],
            r,
            style: symbolStyle,
            setRole: false,
        })
    )

    return (
        <g role={'upset-membership'}>
            {drawLine ? lineElement : null}
            {symbolElements}
        </g>
    )
}
