import { ReactNode } from 'react'
import {
    NumericPositionSpec,
    FourSideSizeSpec,
    SizeSpec,
    SvgElementVariantProps,
    AlignSpec,
} from '../general'

export interface TypographyProps extends SvgElementVariantProps {
    /** position */
    position?: NumericPositionSpec
    /** variant */
    variant?: 'default' | 'title' | 'subtitle' | 'axisLabel' | 'tickLabel' | string
    /** rotation */
    rotate?: number
    /** text content */
    children?: ReactNode
}

export type LabelLocationSpec = {
    /** size of bounding container */
    size?: SizeSpec
    /** space between container and label */
    padding?: FourSideSizeSpec
    /** position of anchor point relative to box size */
    anchor?: AlignSpec
    /** alignment of label within its bounding container */
    align?: AlignSpec
}

export interface LabelProps extends TypographyProps, LabelLocationSpec {
    /** position for center of label container */
    position?: NumericPositionSpec
}

export interface CounterProps extends LabelProps {
    /** number of decimal places */
    nDecimalPlaces?: number
    /** format */
    format?: (v: number) => string
}
