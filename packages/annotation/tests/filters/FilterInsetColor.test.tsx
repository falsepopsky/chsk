import { render, screen } from '@testing-library/react'
import { Chart } from '@chsk/core'
import { FilterInsetColor } from '../../src'
import { chartProps } from '../props'

describe('FilterInsetColor', () => {
    it('creates a filter', () => {
        render(
            <Chart {...chartProps}>
                <FilterInsetColor id={'custom'} />
            </Chart>
        )
        const result = screen.getByRole('chart-content').querySelectorAll('filter')
        expect(result).toHaveLength(1)
    })
})
