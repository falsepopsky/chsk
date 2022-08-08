import { createContext, ReactNode, useContext, useMemo } from 'react'
import { ScatterDataContextProps } from './types'

// two similar contexts
// - processed data - for internal representations of raw data values
// - prepared data - for holding coordinates and plot-ready values

export const ProcessedScatterDataContext = createContext({
    data: [],
    seriesIds: [],
    seriesIndexes: {},
} as ScatterDataContextProps)

export const PreparedScatterDataContext = createContext({
    data: [],
    seriesIds: [],
    seriesIndexes: {},
} as ScatterDataContextProps)

export const ProcessedScatterDataProvider = ({
    data,
    seriesIds,
    seriesIndexes,
    children,
}: ScatterDataContextProps & {
    auxData?: Record<string, unknown>
    children: ReactNode
}) => {
    const value = useMemo(() => ({ data, seriesIds, seriesIndexes }), [data])
    return (
        <ProcessedScatterDataContext.Provider value={value}>
            {children}
        </ProcessedScatterDataContext.Provider>
    )
}

export const PreparedScatterDataProvider = ({
    data,
    seriesIds,
    seriesIndexes,
    children,
}: ScatterDataContextProps & {
    children: ReactNode
}) => {
    const value = useMemo(() => ({ data, seriesIds, seriesIndexes }), [data])
    return (
        <PreparedScatterDataContext.Provider value={value}>
            {children}
        </PreparedScatterDataContext.Provider>
    )
}

// hooks for the contexts

export const useProcessedScatterData = () => useContext(ProcessedScatterDataContext)
export const usePreparedScatterData = () => useContext(PreparedScatterDataContext)
