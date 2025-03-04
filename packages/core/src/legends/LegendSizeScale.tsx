import { defaultLegendProps } from './defaults'
import { useThemedProps } from '../themes'
import { LegendSizeScaleProps } from './types'
import { getTickCoordinates, getTicks, useScales } from '../scales'
import { LegendItemList } from './LegendItemList'

const UnthemedLegendSizeScale = ({
    variant = 'right',
    position,
    // organization of items within the container
    horizontal = defaultLegendProps.horizontal,
    itemSize = defaultLegendProps.itemSize,
    itemPadding = defaultLegendProps.itemPadding,
    //
    symbol,
    symbolStyle,
    labelStyle,
    labelOffset = 4,
    //
    ticks = 3,
    sizes,
    //
    className,
    style,
    setRole = true,
}: LegendSizeScaleProps) => {
    const scale = useScales().size
    const allTicks = sizes ?? getTicks(scale, ticks)
    const allValues = getTickCoordinates(scale, ticks)
    // avoid creating symbols for size zero
    const pairs = allTicks.map((a, i) => [a, allValues[i]]).filter(ab => ab[1] > 0)

    return (
        <g role={setRole ? 'legend-size-scale' : undefined} className={className} style={style}>
            <LegendItemList
                key={'legend-size-scale'}
                variant={variant}
                keys={pairs.map(ab => String(ab[0]))}
                labels={pairs.map(ab => String(ab[0]))}
                position={position}
                itemSize={itemSize}
                itemPadding={itemPadding}
                horizontal={horizontal}
                r={pairs.map(ab => Number(ab[1]))}
                symbol={symbol}
                symbolStyle={symbolStyle}
                labelStyle={labelStyle}
                labelOffset={labelOffset}
                interactive={false}
                className={className}
                setRole={setRole}
            />
        </g>
    )
}

export const LegendSizeScale = (props: LegendSizeScaleProps) => (
    <UnthemedLegendSizeScale {...useThemedProps(props, 'LegendSizeScale')} />
)
