import { FC, ReactNode } from 'react'
import {
    AccessorFunction,
    ColorScaleSpec,
    ContinuousScaleSpec,
    CssProps,
    CurveSpec,
    DataInteractivityProps,
    FourSideSizeSpec,
    InteractivityProps,
    LineProps,
    NumericPositionSpec,
    PathProps,
    PositionUnits,
    ProcessedDataContextProps,
    SizeScaleSpec,
    SvgElementProps,
    SvgElementVariantProps,
    SymbolProps,
    TranslateSpec,
    ViewProps,
    WithId,
} from '@chsk/core'

export type ScatterDataItem = WithId & {
    data: Array<Record<string, unknown>>
}

export type ScatterProcessedDataItem = WithId & {
    index: number
    x: Array<number>
    y: Array<number>
    size: Array<number>
    color?: Array<number>
}
export type ScatterPreparedDataItem = WithId & {
    index: number
    x: Array<number>
    y: Array<number>
    r: Array<number>
    color?: Array<string>
}

export type ScatterDataContextProps = ProcessedDataContextProps & {
    /** data */
    data: Array<ScatterPreparedDataItem>
}

export interface ScatterProps
    extends Omit<ViewProps, 'scaleX' | 'scaleY' | 'scaleColor' | 'scaleSize'> {
    /** key or function to extract x-axis values from raw data */
    x: string | AccessorFunction<number>
    /** key or function to extract y-axis values from raw data */
    y: string | AccessorFunction<number>
    /** absolute number, key, or function to extract dot size from raw data */
    valueSize?: number | string | AccessorFunction<number>
    /** key or a function to extract a color raw data */
    valueColor?: null | string | AccessorFunction<number>
    /** data */
    data: Array<ScatterDataItem>
    /** scale for horizontal axis */
    scaleX?: ContinuousScaleSpec
    /** scale for vertical axis */
    scaleY?: ContinuousScaleSpec
    /** scale for colors */
    scaleColor?: ColorScaleSpec
    /** scale for cell size */
    scaleSize?: SizeScaleSpec
}

export type ScatterInteractiveDataItem = WithId & {
    index?: number
    point?: NumericPositionSpec
    size?: number
    color?: number
    original?: Record<string, unknown>
}

// this uses symbolClassName and symbolStyle instead of SvgElementProps
// that is to facilitate transferring props from ScatterSeries to ScatterPoints
export interface ScatterPointsProps
    extends DataInteractivityProps<ScatterInteractiveDataItem, SymbolProps> {
    /** ids to display (defaults to all ids) */
    ids?: string[]
    /** symbol for individual data points */
    symbol?: FC<SymbolProps>
    /** style class for data points */
    symbolClassName?: string
    /** style for data points */
    symbolStyle?: CssProps
}

export type SignalProcessingProps = {
    /** convolution mask */
    convolutionMask?: number[]
    /** offset used during convolution */
    convolutionOffset?: number
    /** down-sampling factor [0, 1] */
    downsampleFactor?: number
    /** offset used during down-sampling */
    downsampleIndex?: number
}

export interface ScatterCurveProps
    extends SvgElementVariantProps,
        DataInteractivityProps<ScatterInteractiveDataItem, PathProps>,
        SignalProcessingProps {
    /** ids to display (defaults to all ids) */
    ids?: string[]
    /** curve type */
    curve?: CurveSpec
}

export interface ScatterLabelProps extends SvgElementVariantProps {
    /** ids to display (defaults to all ids) */
    ids?: string[]
    /** position along the x-axis */
    x: number
    /** units for position x */
    units?: PositionUnits
    /** translation with respect to data point */
    translate?: TranslateSpec
    /** rotation */
    rotate?: number
    /** set rotation automatically */
    autoRotate?: boolean
    /** child components */
    children?: ReactNode
}

export interface ScatterIntervalProps
    extends ScatterCurveProps,
        DataInteractivityProps<ScatterInteractiveDataItem, PathProps> {
    /** key or function to extract lower bound for interval */
    lower: string | AccessorFunction<number>
    /** key or function to extract upper bound for interval */
    upper: string | AccessorFunction<number>
}

export interface ScatterErrorBarProps extends SvgElementProps, InteractivityProps {
    /** horizontal or vertical error bar */
    variant: 'x' | 'y'
    /** width of cap at the end of error bar */
    capWidth?: number
    /** position of lower bound */
    lower: NumericPositionSpec
    /** position of upper bound */
    upper: NumericPositionSpec
}

export interface ScatterErrorsProps
    extends SvgElementVariantProps,
        DataInteractivityProps<ScatterInteractiveDataItem, ScatterErrorBarProps>,
        Pick<ScatterIntervalProps, 'ids' | 'lower' | 'upper'> {
    /** horizontal or vertical error bars */
    variant: 'x' | 'y'
    /** width of error bar ends */
    capWidth?: number
    /** component used to draw error bars */
    component?: FC<ScatterErrorBarProps>
}

export interface ScatterAreaProps
    extends ScatterCurveProps,
        DataInteractivityProps<ScatterInteractiveDataItem, PathProps> {
    /** base for the area polygon */
    baseline?: number
}

export type ScatterSeriesLayer = 'area' | 'curve' | 'interval' | 'points'

export interface ScatterSeriesProps
    extends ScatterPointsProps,
        Omit<
            ScatterAreaProps,
            'dataComponent' | 'onMouseEnter' | 'onMouseMove' | 'onMouseLeave' | 'onClick'
        > {
    /** list of components to display */
    layers: ScatterSeriesLayer[]
    /** styles for areas */
    areaStyle?: CssProps
    /** styles for curve */
    curveStyle?: CssProps
    /** styles for points */
    symbolStyle?: CssProps
}

export type RegressionInteractiveData = WithId & {
    ids: string[]
    variant: 'series' | 'pooled'
}

export interface RegressionProps
    extends SvgElementVariantProps,
        DataInteractivityProps<RegressionInteractiveData, LineProps> {
    /** compute regressions for individual series or for pooled data */
    variant?: 'series' | 'pooled'
    /** ids to display (defaults to all ids) */
    ids?: string[]
}

export type ScatterCrosshairVariant = 'default' | 'horizontal' | 'vertical' | 'none'

export interface ScatterCrosshairProps
    extends DataInteractivityProps<ScatterInteractiveDataItem, SymbolProps>,
        SvgElementVariantProps,
        Pick<ScatterPointsProps, 'symbol' | 'symbolStyle' | 'symbolClassName'> {
    /** crosshair variant */
    variant?: ScatterCrosshairVariant
    /** expansion of background surface */
    expansion?: FourSideSizeSpec
    /** minimum distance to nearest point */
    minDistance?: number
    /** format of tooltip label */
    tooltipFormat?: (data: ScatterInteractiveDataItem) => string
    /** style for crosshair lines */
    style?: CssProps
}
