import {
    AccessorFunction,
    addColor,
    ContinuousAxisScale,
    createAreaGenerator,
    CurveSpec,
    RawDataContextProps,
    getAccessor,
    isContinuousAxisScale,
    NumericPositionIntervalSpec,
    useRawData,
    useScales,
    OpacityMotion,
    useDisabledKeys,
    DataComponent,
    Path,
} from '@chsk/core'
import { ScatterDataContextProps, ScatterIntervalProps } from './types'
import { useScatterPreparedData } from './context'
import { createElement, useMemo } from 'react'

const getScatterIntervalD = ({
    seriesIndex,
    rawData,
    preparedData,
    scaleY,
    lower,
    upper,
    curve,
}: {
    seriesIndex: number
    rawData: RawDataContextProps
    preparedData: ScatterDataContextProps
    scaleY: ContinuousAxisScale
    lower: string | AccessorFunction<number>
    upper: string | AccessorFunction<number>
    curve: CurveSpec
}) => {
    const getLower = getAccessor<number>(lower)
    const getUpper = getAccessor<number>(upper)
    const originalSeriesData = rawData.data[seriesIndex].data as Array<Record<string, unknown>>
    const lowerValues = originalSeriesData.map(item => scaleY(getLower(item)))
    const upperValues = originalSeriesData.map(item => scaleY(getUpper(item)))
    const x = preparedData.data[seriesIndex].x
    const pointIntervals: Array<NumericPositionIntervalSpec> = x.map((v: number, i: number) => [
        v,
        lowerValues[i],
        upperValues[i],
    ])
    const generator = createAreaGenerator(curve)
    return generator(pointIntervals) ?? ''
}

export const ScatterInterval = ({
    ids,
    lower,
    upper,
    curve = 'Linear',
    variant = 'default',
    style,
    className,
    setRole,
    dataComponent = DataComponent,
    ...props
}: ScatterIntervalProps) => {
    const preparedData = useScatterPreparedData()
    const rawData = useRawData()
    const scales = useScales()
    const scaleY = scales.y
    const colorScale = scales.color
    const { disabledKeys, firstRender } = useDisabledKeys()

    if (!isContinuousAxisScale(scaleY)) return null

    const result = (ids ?? preparedData.keys).map(id => {
        const visible = !disabledKeys.has(id)
        const seriesIndex = preparedData.seriesIndexes[id]
        if (seriesIndex === undefined) return null
        const seriesStyle = addColor(style, colorScale(seriesIndex))
        const d = useMemo(
            () =>
                getScatterIntervalD({
                    seriesIndex,
                    rawData,
                    preparedData,
                    scaleY,
                    lower,
                    upper,
                    curve,
                }),
            [seriesIndex, rawData, preparedData, scaleY, lower, upper, curve]
        )
        const element = createElement(dataComponent, {
            data: { id },
            component: Path,
            props: {
                variant,
                d,
                setRole,
                style: seriesStyle,
                className,
            },
            ...props,
        })
        return (
            <OpacityMotion
                role={'scatter-interval'}
                key={'scatter-interval-' + seriesIndex}
                visible={visible}
                firstRender={firstRender}
            >
                {element}
            </OpacityMotion>
        )
    })

    return <>{result.filter(Boolean)}</>
}
