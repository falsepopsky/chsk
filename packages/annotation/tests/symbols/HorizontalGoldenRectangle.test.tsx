import { render, screen } from '@testing-library/react'
import { Chart } from '@chsk/core'
import { chartProps } from '../props'
import { HorizontalGoldenRectangle } from '../../src'

describe('HorizontalGoldenRectangle', () => {
    it('creates a horizontal golden rectangle', () => {
        render(
            <Chart {...chartProps}>
                <HorizontalGoldenRectangle />
            </Chart>
        )
        const result = screen.getByRole('chart-content').querySelector('rect')
        expect(result?.getAttribute('role')).toContain('default')
        const width = result?.getAttribute('width')?.replace('px', '')
        const height = result?.getAttribute('height')?.replace('px', '')
        expect(Number(width)).toBeGreaterThan(Number(height))
    })

    it('creates a horizontal golden rectangle without role', () => {
        render(
            <Chart {...chartProps}>
                <HorizontalGoldenRectangle setRole={false} />
            </Chart>
        )
        const result = screen.getByRole('chart-content').querySelector('rect')
        expect(result?.getAttribute('role')).toBeNull()
    })
})
