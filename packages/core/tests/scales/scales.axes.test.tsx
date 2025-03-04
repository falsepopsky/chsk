import {
    createContinuousScaleProps,
    createBandScale,
    createContinuousScale,
    createAxisScale,
    getTickCoordinates,
    isAxisScale,
    isBandAxisScale,
    isColorScale,
    isContinuousAxisScale,
    isLinearAxisScale,
    isLogAxisScale,
    isScaleWithDomain,
    isSqrtAxisScale,
    LinearAxisScale,
} from '../../src/scales'
import { isNumericAxisScale, isTimeAxisScale } from '../../src/scales/predicates'

describe('createContinuousScaleProps', () => {
    it('creates props for a scale with custom domain', () => {
        const result = createContinuousScaleProps(
            {
                variant: 'linear',
                domain: [0, 10],
            },
            [0, 1],
            100
        )
        expect(result.domain).toEqual([0, 10])
        expect(result.size).toEqual(100)
    })

    it('creates props for a scale using default domain', () => {
        const result = createContinuousScaleProps(
            {
                variant: 'linear',
            },
            [0, 1],
            100
        )
        expect(result.domain).toEqual([0, 1])
        expect(result.size).toEqual(100)
    })

    it('creates props for a scale using default domain start', () => {
        const result = createContinuousScaleProps(
            {
                variant: 'linear',
                domain: ['auto', 20],
            },
            [0, 1],
            100
        )
        expect(result.domain).toEqual([0, 20])
    })

    it('creates props for a scale using default domain end', () => {
        const result = createContinuousScaleProps(
            { variant: 'linear', domain: [-1, 'auto'] },
            [0, 1],
            100
        )
        expect(result.domain).toEqual([-1, 1])
    })
})

describe('createAxisScale', () => {
    it('creates a band scale', () => {
        const result = createAxisScale({
            axis: 'x',
            scaleProps: {
                variant: 'band',
                domain: ['a', 'b'],
                padding: 0,
                size: 100,
            },
        })
        expect(isAxisScale(result)).toBeTruthy()
        expect(isColorScale(result)).toBeFalsy()
        expect(isBandAxisScale(result)).toBeTruthy()
        expect(isContinuousAxisScale(result)).toBeFalsy()
    })

    it('creates a linear scale', () => {
        const result = createAxisScale({
            axis: 'x',
            scaleProps: {
                variant: 'linear',
                domain: [0, 10],
                size: 100,
            },
        })
        expect(isAxisScale(result)).toBeTruthy()
        expect(isColorScale(result)).toBeFalsy()
        expect(isBandAxisScale(result)).toBeFalsy()
        expect(isContinuousAxisScale(result)).toBeTruthy()
        expect(isLinearAxisScale(result)).toBeTruthy()
        expect(isLogAxisScale(result)).toBeFalsy()
    })

    it('creates a log scale', () => {
        const result = createAxisScale({
            axis: 'x',
            scaleProps: {
                variant: 'log',
                domain: [1, 10],
                size: 100,
            },
        })
        expect(isAxisScale(result)).toBeTruthy()
        expect(isColorScale(result)).toBeFalsy()
        expect(isBandAxisScale(result)).toBeFalsy()
        expect(isContinuousAxisScale(result)).toBeTruthy()
        expect(isLinearAxisScale(result)).toBeFalsy()
        expect(isLogAxisScale(result)).toBeTruthy()
    })

    it('creates a sqrt scale', () => {
        const result = createAxisScale({
            axis: 'x',
            scaleProps: {
                variant: 'sqrt',
                domain: [0, 100],
                size: 100,
            },
        })
        expect(isAxisScale(result)).toBeTruthy()
        expect(isColorScale(result)).toBeFalsy()
        expect(isBandAxisScale(result)).toBeFalsy()
        expect(isSqrtAxisScale(result)).toBeTruthy()
        expect(isContinuousAxisScale(result)).toBeTruthy()
    })

    it('creates a y-axis scale oriented in canonical direction', () => {
        const result = createAxisScale({
            axis: 'y',
            scaleProps: {
                variant: 'linear',
                domain: [0, 10],
                size: 100,
                reverse: false,
            },
        }) as LinearAxisScale
        expect(result(0)).toEqual(100)
        expect(result(10)).toEqual(0)
    })

    it('creates a y-axis scale oriented in reverse direction', () => {
        const result = createAxisScale({
            axis: 'y',
            scaleProps: {
                variant: 'linear',
                domain: [0, 10],
                size: 100,
                reverse: true,
            },
        }) as LinearAxisScale
        expect(result(0)).toEqual(0)
        expect(result(10)).toEqual(100)
    })

    it('creates a x-axis scale oriented in reverse direction', () => {
        const result = createAxisScale({
            axis: 'x',
            scaleProps: {
                variant: 'linear',
                domain: [0, 10],
                size: 100,
                reverse: true,
            },
        }) as LinearAxisScale
        expect(result(0)).toEqual(100)
        expect(result(10)).toEqual(0)
    })
})

describe('createBandScale', () => {
    it('creates a scale without padding', () => {
        const result = createBandScale({
            domain: ['a', 'b'],
            size: 100,
            padding: 0,
        })
        expect(result.ticks()).toEqual(['a', 'b'])
        expect(result.bandwidth()).toEqual(50)
        expect(result('a')).toEqual(25)
        expect(result('b')).toEqual(75)
    })

    it('creates a scale with outer padding', () => {
        const result = createBandScale({
            domain: ['a', 'b'],
            size: 100,
            paddingOuter: 1,
            paddingInner: 0,
        })
        expect(result.ticks()).toEqual(['a', 'b'])
        // padding outer = 1 is like placing an extra band on each side of the scale
        // each band will have width 100 / 4 = 25
        // effective range is [10, 90], i.e. size of 80, so each bar has bandwidth 40
        expect(result.bandwidth()).toBe(25)
        expect(result('a')).toEqual(25 + 12.5)
        expect(result('b')).toEqual(50 + 12.5)
    })

    it('creates a scale with inner padding', () => {
        const result = createBandScale({
            domain: ['a', 'b'],
            size: 100,
            paddingOuter: 0,
            paddingInner: 0.5,
        })
        expect(result.ticks()).toEqual(['a', 'b'])
        // two bands, no outer padding, and an inner space of width equal to a band
        expect(result.bandwidth()).toBe(100 / 3)
        expect(Math.round(result('a'))).toEqual(Math.round(100 / 6))
        expect(Math.round(result('b'))).toEqual(Math.round((100 * 5) / 6))
    })

    it('creates a scale with extra padding', () => {
        const result = createBandScale({
            domain: ['a', 'b', 'c', 'd'],
            size: 100,
            extraPadding: { d: 1 },
        })
        expect(result.ticks()).toEqual(['a', 'b', 'c', 'd'])
        // an extra space before band d
        // so the distance between [c, d] should greater than between [a, b]
        const ab = result('b') - result('a')
        const cd = result('d') - result('c')
        expect(cd).toBeGreaterThan(ab)
        expect(cd - ab).toBeGreaterThan(5)
    })

    it('extract tick coordinates for center of bands', () => {
        const scale = createBandScale({
            domain: ['a', 'b', 'c', 'd'],
            size: 120,
            padding: 0,
        })
        // four bands [0, 30], [30, 60], [60, 90], [90, 120]
        // default ticks should be at the center of the band interval
        const result = getTickCoordinates(scale, undefined)
        expect(result).toHaveLength(4)
        const expected = [15, 45, 75, 105]
        expected.map((v, i) => expect(result[i]).toEqual(v))
    })

    it('extract tick coordinates for band start positions', () => {
        const scale = createBandScale({
            domain: ['a', 'b', 'c', 'd'],
            size: 120,
            padding: 0,
        })
        // four bands [0, 30], [30, 60], [60, 90], [90, 120]
        const result = getTickCoordinates(scale, undefined, -0.5)
        expect(result).toHaveLength(4)
        const expected = [0, 30, 60, 90]
        expected.map((v, i) => expect(result[i]).toEqual(v))
    })

    it('extract tick coordinates for band end positions', () => {
        const scale = createBandScale({
            domain: ['a', 'b', 'c', 'd'],
            size: 120,
            padding: 0,
        })
        // four bands [0, 30], [30, 60], [60, 90], [90, 120]
        const result = getTickCoordinates(scale, undefined, +0.5)
        expect(result).toHaveLength(4)
        const expected = [30, 60, 90, 120]
        expected.map((v, i) => expect(result[i]).toEqual(v))
    })
})

describe('createContinuousScale', () => {
    it('creates linear scale for x axis', () => {
        const result = createContinuousScale({
            variant: 'linear',
            reverseRange: false,
            domain: [0, 10],
            size: 100,
        })
        expect(isNumericAxisScale(result)).toBeTruthy()
        if (!isNumericAxisScale(result)) return
        expect(result(0)).toEqual(0)
        expect(result(10)).toEqual(100)
        expect(result(5)).toEqual(50)
    })

    it('creates linear scale for y axis (reversed)', () => {
        const result = createContinuousScale({
            variant: 'linear',
            reverseRange: true,
            domain: [0, 10],
            size: 100,
        })
        expect(isNumericAxisScale(result)).toBeTruthy()
        if (!isNumericAxisScale(result)) return
        // for y-axis, the ordering is reversed
        expect(result(0)).toEqual(100)
        expect(result(10)).toEqual(0)
        expect(result(5)).toEqual(50)
    })

    it('creates log scale', () => {
        const result = createContinuousScale({
            variant: 'log',
            reverseRange: false,
            domain: [1, 100],
            size: 100,
        })
        expect(isNumericAxisScale(result)).toBeTruthy()
        if (!isNumericAxisScale(result)) return
        expect(result(1)).toEqual(0)
        expect(result(10)).toEqual(50)
        expect(result(100)).toEqual(100)
    })

    it('continuous scales have zero bandwidth and zero step', () => {
        const result = createContinuousScale({
            variant: 'linear',
            domain: [1, 100],
            size: 100,
        })
        expect('bandwidth' in result).toBeTruthy()
        expect(result.bandwidth ? result.bandwidth() : null).toEqual(0)
        expect('step' in result).toBeTruthy()
        expect(result.step ? result.step() : null).toEqual(0)
    })

    it('creates time scale', () => {
        const start: Date = new Date(Date.now() - 60 * 1000)
        const end: Date = new Date(Date.now())
        const result = createContinuousScale({
            variant: 'time',
            reverseRange: false,
            domain: [start, end],
            size: 100,
        })
        expect(isTimeAxisScale(result)).toBeTruthy()
        if (!isTimeAxisScale(result)) return
        expect(result(Number(start))).toEqual(0)
        expect(result(Number(end))).toEqual(100)
        expect(result.step()).toEqual(0)
        expect(result.bandwidth()).toEqual(0)
        expect(result.domain()).toHaveLength(2)
        // a time in near future will map to a coordinate beyond 'size'
        const future = new Date(Date.now() + 10)
        expect(result(Number(future))).toBeGreaterThan(100)
    })

    it('creates time scale with boolean nice', () => {
        const start: Date = new Date(Date.now() - 60 * 1000)
        const end: Date = new Date(Date.now())
        const result = createContinuousScale({
            variant: 'time',
            reverseRange: true,
            domain: [start, end],
            size: 100,
            nice: true,
        })
        expect(isTimeAxisScale(result)).toBeTruthy()
        if (!isTimeAxisScale(result)) return
        expect(result(Number(start))).toBeGreaterThan(0)
    })

    it('creates time scale with numeric nice', () => {
        const start: Date = new Date(Date.now() - 60 * 1000)
        const end: Date = new Date(Date.now())
        const result = createContinuousScale({
            variant: 'time',
            reverseRange: true,
            domain: [start, end],
            size: 100,
            nice: 1,
        })
        expect(isTimeAxisScale(result)).toBeTruthy()
        if (!isTimeAxisScale(result)) return
        expect(result(Number(start))).toBeGreaterThan(0)
    })
})

describe('getTickCoordinates', () => {
    it('get tick coordinates (number of ticks)', () => {
        const scale = createContinuousScale({
            variant: 'linear',
            domain: [0, 100],
            size: 200,
        })
        const result = getTickCoordinates(scale, 6)
        const expected = [0, 40, 80, 120, 160, 200]
        expected.map((v, i) => expect(result[i]).toEqual(v))
    })

    it('get tick coordinates (specific values)', () => {
        const scale = createContinuousScale({
            variant: 'linear',
            domain: [0, 100],
            size: 200,
        })
        const result = getTickCoordinates(scale, [0, 25, 75, 100])
        const expected = [0, 50, 150, 200]
        expected.map((v, i) => expect(result[i]).toEqual(v))
    })

    it('get tick coordinates on time scale (number of ticks)', () => {
        const start: Date = new Date(Date.parse('2000-01-01'))
        const end: Date = new Date(Date.parse('2000-01-06'))
        const scale = createContinuousScale({
            variant: 'time',
            domain: [start, end],
            size: 200,
        })
        const result = getTickCoordinates(scale, 6)
        const expected = [0, 40, 80, 120, 160, 200]
        expected.map((v, i) => expect(result[i]).toEqual(v))
    })

    it('get tick coordinates on a time scale (specific time points)', () => {
        const start: Date = new Date(Date.parse('2000-01-01'))
        const end: Date = new Date(Date.parse('2000-01-05'))
        const scale = createContinuousScale({
            variant: 'time',
            domain: [start, end],
            size: 200,
        })
        const t1 = new Date(Date.parse('2000-01-02'))
        const t2 = new Date(Date.parse('2000-01-04'))
        const result = getTickCoordinates(scale, [t1, t2])
        const expected = [50, 150]
        expected.map((v, i) => expect(result[i]).toEqual(v))
    })
})

describe('isScaleWithDomain', () => {
    it('checks band scale with domain', () => {
        const result = isScaleWithDomain({ variant: 'band', domain: ['a', 'b'] })
        expect(result).toBeTruthy()
    })

    it('checks band scale with auto domain', () => {
        const result = isScaleWithDomain({ variant: 'band', domain: 'auto' })
        expect(result).toBeFalsy()
    })

    it('checks band scale without domain', () => {
        const result = isScaleWithDomain({ variant: 'band' })
        expect(result).toBeFalsy()
    })

    it('checks linear scale with domain', () => {
        const result = isScaleWithDomain({ variant: 'linear', domain: [0, 20] })
        expect(result).toBeTruthy()
    })

    it('checks linear scale with auto domain', () => {
        const result = isScaleWithDomain({ variant: 'linear', domain: 'auto' })
        expect(result).toBeFalsy()
    })

    it('checks linear scale with part-auto domain', () => {
        const resultA = isScaleWithDomain({ variant: 'linear', domain: [0, 'auto'] })
        expect(resultA).toBeFalsy()
        const resultB = isScaleWithDomain({ variant: 'linear', domain: ['auto', 0] })
        expect(resultB).toBeFalsy()
    })

    it('checks linear scale without domain', () => {
        const result = isScaleWithDomain({ variant: 'linear' })
        expect(result).toBeFalsy()
    })
})
