// default theme object

import { CompleteThemeSpec } from './types'

export const defaultTheme: CompleteThemeSpec = {
    typography: {
        default: {
            fontFamily: 'sans-serif',
            fontSize: '14px',
            fill: '#333333',
        },
        title: {
            fontFamily: 'sans-serif',
            fontWeight: 600,
            fontSize: '18px',
            fill: '#333333',
        },
        subtitle: {
            fontFamily: 'sans-serif',
            fontSize: '14px',
            fill: '#777777',
        },
        axisLabel: {
            fontFamily: 'sans-serif',
            fontSize: '14px',
            fill: '#333333',
            textAnchor: 'middle' as const,
            dominantBaseline: 'middle' as const,
        },
        tickLabel: {
            fontFamily: 'sans-serif',
            fontSize: '12px',
            fill: '#333333',
        },
        'tickLabel.left': {
            textAnchor: 'end' as const,
            dominantBaseline: 'middle' as const,
        },
        'tickLabel.right': {
            textAnchor: 'start' as const,
            dominantBaseline: 'middle' as const,
        },
        'tickLabel.top': {
            textAnchor: 'middle' as const,
            dominantBaseline: 'auto' as const,
        },
        'tickLabel.bottom': {
            textAnchor: 'middle' as const,
            dominantBaseline: 'hanging' as const,
        },
        footnote: {
            fontFamily: 'sans-serif',
            fontSize: '11px',
            fill: '#333333',
            fontStyle: 'italic',
        },
    },
    line: {
        default: {
            stroke: '#222222',
            strokeWidth: 1,
        },
        grid: {
            stroke: '#bbbbbb',
            strokeWidth: 1,
        },
        axis: {
            stroke: '#222222',
            visibility: 'hidden' as const,
            strokeLinecap: 'square',
        },
        tick: {
            stroke: '#555555',
            strokeWidth: 2,
        },
    },
    surface: {
        inner: {
            fill: '#eeeeee',
            fillOpacity: 1,
        },
        outer: {
            fill: '#f4f4f4',
            fillOpacity: 1,
        },
    },
    rect: {
        default: {
            stroke: '#333333',
            strokeWidth: 0,
        },
    },
    circle: {
        default: {
            stroke: '#333333',
            strokeWidth: 0,
        },
    },
    Axis: {
        top: {
            padding: 0, // distance between chart surface and axis
        },
        bottom: {
            padding: 0,
        },
        left: {
            padding: 0,
        },
        right: {
            padding: 0,
        },
    },
    AxisLabel: {
        top: {
            padding: 40, // distance between axis and axis label
            anchor: 0.5, // relative position of axis label
        },
        bottom: {
            padding: 40,
            anchor: 0.5,
        },
        left: {
            padding: 45,
            anchor: 0.5,
            rotate: -90,
        },
        right: {
            padding: 45,
            anchor: 0.5,
            rotate: 90,
        },
    },
    AxisTicks: {
        top: {
            size: 5,
            padding: 9,
        },
        bottom: {
            size: 5,
            padding: 9,
        },
        left: {
            size: 5,
            padding: 9,
        },
        right: {
            size: 5,
            padding: 9,
        },
    },
}
