import {
    AxisLabelThemedProps,
    AxisThemedProps,
    AxisTicksThemedProps,
    GridLinesThemedProps,
} from './types'

export const defaultAxisProps: AxisThemedProps = {
    offset: 0,
    ticks: undefined,
}

export const defaultAxisLabelProps: AxisLabelThemedProps = {
    anchor: 0.5,
    offset: 40,
    rotate: 0,
}

export const defaultAxisLabelLeftProps: AxisLabelThemedProps = {
    anchor: 0.5,
    offset: 45,
    rotate: -90,
}

export const defaultAxisLabelRightProps: AxisLabelThemedProps = {
    anchor: 0.5,
    offset: 45,
    rotate: 90,
}

export const defaultAxisTicksProps: AxisTicksThemedProps = {
    ticks: undefined,
    tickSize: 5,
    labelOffset: 9,
    labelTranslate: [0, 0],
    labelRotate: 0,
}

export const defaultGridLinesProps: GridLinesThemedProps = {
    shift: [0],
    expansion: [0, 0],
}
