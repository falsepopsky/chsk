import { useMemo } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { cloneDeep } from 'lodash'
import { HistogramDataItem, HistogramProcessedDataItem, HistogramProps } from './types'
import {
    ContinuousAxisScale,
    createScales,
    createContinuousScaleProps,
    useView,
    ContinuousScaleProps,
    ContinuousScaleSpec,
    isScaleWithDomain,
    getMinMax,
    getIndexes,
    defaultLinearScaleSpec,
    useDisabledKeys,
    useTheme,
    createColorScaleProps,
    BaseView,
    X,
    Y,
    SizeSpec,
} from '@chask/core'
import { HistogramPreparedDataProvider } from './context'
import { binValues, getBreaksArray } from './utils'

// turn raw data into a minimal format
const processData = (
    seriesData: HistogramDataItem,
    index: number,
    breaks: number[],
    density: boolean
): HistogramProcessedDataItem => {
    return {
        id: seriesData.id,
        index,
        points: binValues(seriesData.data, breaks, density),
    }
}

// turn processed data into view-specific coordinates
const prepareData = (
    seriesData: HistogramProcessedDataItem,
    scaleX: ContinuousAxisScale,
    scaleY: ContinuousAxisScale
): HistogramProcessedDataItem => {
    return {
        id: seriesData.id,
        index: seriesData.index,
        points: seriesData.points.map(point => [scaleX(point[X]), scaleY(point[Y])]),
    }
}

const getScaleProps = (
    data: Array<HistogramProcessedDataItem>,
    scaleSpecX: ContinuousScaleSpec,
    scaleSpecY: ContinuousScaleSpec,
    size: SizeSpec,
    disabled: boolean[]
) => {
    const result = {
        scalePropsX: cloneDeep(scaleSpecX) as ContinuousScaleProps,
        scalePropsY: cloneDeep(scaleSpecY) as ContinuousScaleProps,
    }
    const filterDisabled = (v: unknown, i: number) => !disabled[i]
    if (!isScaleWithDomain(scaleSpecX)) {
        const x = data
            .filter(filterDisabled)
            .map(seriesData => seriesData.points.map(point => point[X]))
            .flat()
        result.scalePropsX = createContinuousScaleProps(scaleSpecX, getMinMax(x))
    }
    if (!isScaleWithDomain(scaleSpecY)) {
        const y = data
            .filter(filterDisabled)
            .map(seriesData => seriesData.points.map(point => point[Y]))
            .flat()
        result.scalePropsY = createContinuousScaleProps(scaleSpecY, getMinMax(y))
    }
    result.scalePropsX.size = size[X]
    result.scalePropsY.size = size[Y]
    return result
}

export const Histogram = ({
    // layout
    position = [0, 0],
    size = [1, 1],
    units = 'relative',
    anchor = [0, 0],
    padding = [0, 0, 0, 0],
    // content
    data,
    breaks,
    density = false,
    scaleX = defaultLinearScaleSpec,
    scaleY = defaultLinearScaleSpec,
    scaleColor,
    autoRescale = true,
    //
    children,
}: HistogramProps) => {
    const theme = useTheme()
    const { dimsProps, origin } = useView({ position, size, units, anchor, padding })
    const seriesIndexes = useMemo(() => getIndexes(data), [data])
    const seriesIds = useMemo(() => data.map(item => item.id), [data])
    const { disabled } = useDisabledKeys(seriesIds)
    const breaksArray = Array.isArray(breaks) ? breaks : getBreaksArray(data, breaks)

    // process dataset - arrange raw data into histogram bins
    const processedData = data.map((seriesData, seriesIndex) =>
        processData(seriesData, seriesIndex, breaksArray, density)
    )

    // set up scales
    const { scalePropsX, scalePropsY } = getScaleProps(
        processedData,
        scaleX,
        scaleY,
        dimsProps.innerSize,
        autoRescale ? disabled : Array(seriesIds.length).fill(false)
    )
    const scaleColorProps = createColorScaleProps(scaleColor ?? theme.Colors.categorical, seriesIds)
    const scales = createScales(scalePropsX, scalePropsY, scaleColorProps)

    // compute coordinates
    const preparedData = processedData.map(seriesData =>
        prepareData(seriesData, scales.x as ContinuousAxisScale, scales.y as ContinuousAxisScale)
    )

    return (
        <BaseView
            role={'view-histogram'}
            position={origin}
            size={dimsProps.size}
            padding={dimsProps.padding}
            originalData={data}
            processedData={processedData}
            seriesIndexes={seriesIndexes}
            keys={seriesIds}
            scales={scales}
        >
            <HistogramPreparedDataProvider
                data={preparedData}
                seriesIndexes={seriesIndexes}
                keys={seriesIds}
            >
                <LazyMotion features={domAnimation}>{children}</LazyMotion>
            </HistogramPreparedDataProvider>
        </BaseView>
    )
}
