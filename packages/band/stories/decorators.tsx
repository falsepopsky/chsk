import { ReactNode } from 'react'
import { Chart, Axis, Surface, GridLines } from '@chask/core'
import { Bar } from '../src/'
import dataGroups from './dataGroups.json'
import { BarProps } from '../src'

export const commonBarProps: Pick<BarProps, 'data' | 'keys' | 'scaleIndex' | 'scaleValue'> = {
    data: dataGroups,
    keys: ['x', 'y', 'z'],
    scaleIndex: {
        variant: 'band',
        domain: ['alpha', 'beta'],
        padding: 0.2,
    },
    scaleValue: {
        variant: 'linear',
        domain: [0, 'auto'],
    },
}

export const ChartDecorator = (Story: () => ReactNode) => (
    <Chart size={[400, 300]} padding={[40, 40, 60, 60]} style={{ display: 'inline-block' }}>
        <Surface variant={'inner'} />
        {Story()}
    </Chart>
)

export const ChartBarH0S1Decorator = (Story: () => ReactNode) => (
    <Chart size={[400, 300]} padding={[40, 40, 60, 60]} style={{ display: 'inline-block' }}>
        <Bar {...commonBarProps} horizontal={false} stacked={true}>
            <GridLines variant={'y'} />
            <Axis variant={'bottom'} />
            <Axis variant={'left'} label={'Values (a. u.)'} />
            {Story()}
        </Bar>
    </Chart>
)
