import { MouseEvent } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Chart, DataComponent, Circle, WithId } from '../../src'
import { chartProps } from '../props'

describe('DataComponent', () => {
    it('creates a component without any event handlers', () => {
        render(
            <Chart {...chartProps}>
                <DataComponent
                    component={Circle}
                    data={{ id: 'A' }}
                    props={{ cx: 10, cy: 10, r: 10, variant: 'abc' }}
                />
            </Chart>
        )
        const result = screen.getByRole('abc')
        expect(result).toBeDefined()
    })

    it('creates a component with a click handler', () => {
        let value: string | undefined = ''
        const customHandler = (data: WithId | undefined, event: MouseEvent) => {
            value = data?.id
        }
        render(
            <Chart {...chartProps}>
                <DataComponent
                    component={Circle}
                    data={{ id: 'A' }}
                    props={{ cx: 10, cy: 10, r: 10, variant: 'abc' }}
                    handlers={{ onClick: customHandler }}
                />
            </Chart>
        )
        expect(value).toEqual('')
        const circle = screen.getByRole('abc')
        expect(circle).toBeDefined()
        fireEvent.click(circle)
        expect(value).toEqual('A')
    })

    it('creates a component with a mouseEnter handler', () => {
        let value: string | undefined = ''
        const customHandler = (data: WithId | undefined, event: MouseEvent) => {
            value = data?.id
        }
        render(
            <Chart {...chartProps}>
                <DataComponent
                    component={Circle}
                    data={{ id: 'A' }}
                    props={{ cx: 10, cy: 10, r: 10, variant: 'abc' }}
                    handlers={{ onMouseEnter: customHandler }}
                />
            </Chart>
        )
        expect(value).toEqual('')
        fireEvent.mouseEnter(screen.getByRole('abc'))
        expect(value).toEqual('A')
    })

    it('creates a component with a mouseLeave handler', () => {
        let value: string | undefined = ''
        const customHandler = (data: WithId | undefined, event: MouseEvent) => {
            value = data?.id
        }
        render(
            <Chart {...chartProps}>
                <DataComponent
                    component={Circle}
                    data={{ id: 'A' }}
                    props={{ cx: 10, cy: 10, r: 10, variant: 'abc' }}
                    handlers={{ onMouseLeave: customHandler }}
                />
            </Chart>
        )
        expect(value).toEqual('')
        fireEvent.mouseLeave(screen.getByRole('abc'))
        expect(value).toEqual('A')
    })

    it('creates a component with a mouseMove handler', () => {
        let value: string | undefined = ''
        const customHandler = (data: WithId | undefined, event: MouseEvent) => {
            value = data?.id
        }
        render(
            <Chart {...chartProps}>
                <DataComponent
                    component={Circle}
                    data={{ id: 'A' }}
                    props={{ cx: 10, cy: 10, r: 10, variant: 'abc' }}
                    handlers={{ onMouseMove: customHandler }}
                />
            </Chart>
        )
        expect(value).toEqual('')
        fireEvent.mouseMove(screen.getByRole('abc'))
        expect(value).toEqual('A')
    })

    it('applies style modifiers', async () => {
        render(
            <Chart {...chartProps}>
                <DataComponent
                    component={Circle}
                    data={{ id: 'A' }}
                    props={{ cx: 10, cy: 10, r: 10, variant: 'A', style: { fill: '#000000' } }}
                    modifiers={{
                        onClick: { strokeWidth: 5 },
                        onMouseEnter: { stroke: '#ff0000' },
                        onMouseMove: { scale: 2 },
                        onMouseLeave: { opacity: 0 },
                    }}
                />
            </Chart>
        )
        expect(screen.getByRole('A').getAttribute('style')).not.toContain('stroke')
        fireEvent.mouseEnter(screen.getByRole('A'))
        await waitFor(() => {
            expect(screen.getByRole('A').getAttribute('style')).toContain('stroke')
        })
        fireEvent.mouseLeave(screen.getByRole('A'))
        await waitFor(() => {
            expect(screen.getByRole('A').getAttribute('style')).toContain('opacity')
        })
        fireEvent.mouseMove(screen.getByRole('A'))
        await waitFor(() => {
            expect(screen.getByRole('A').getAttribute('style')).toContain('scale')
        })
        fireEvent.click(screen.getByRole('A'))
        await waitFor(() => {
            expect(screen.getByRole('A').getAttribute('style')).toContain('width')
        })
    })
})
