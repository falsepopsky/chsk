import { roundDecimalPlaces, rad2deg, binSearch } from '../src'

describe('roundDecimalPlaces', () => {
    it('rounds to 1 decimal place', () => {
        expect(String(roundDecimalPlaces(1.0 / 3, 1))).toBe('0.3')
        expect(String(roundDecimalPlaces(10.0 / 3, 1))).toBe('3.3')
    })

    it('rounds to 3 decimal places', () => {
        expect(String(roundDecimalPlaces(1.0 / 3, 3))).toBe('0.333')
        expect(String(roundDecimalPlaces(100 / 3, 3))).toBe('33.333')
    })

    it('rounds to 0 decimal places', () => {
        expect(String(roundDecimalPlaces(1.0 / 3, 0))).toBe('0')
        expect(String(roundDecimalPlaces(100 / 3, 0))).toBe('33')
    })

    it('rounds to 5 decimal places', () => {
        expect(String(roundDecimalPlaces(1.0 / 3, 5))).toBe('0.33333')
        expect(String(roundDecimalPlaces(100 / 3, 5))).toBe('33.33333')
    })
})

describe('radians and degrees', () => {
    it('simple conversion', () => {
        expect(Math.round(rad2deg(Math.PI))).toEqual(180)
        expect(Math.round(rad2deg(Math.PI / 2))).toEqual(90)
    })
})

describe('binSearch', () => {
    it('search in empty array', () => {
        expect(binSearch([], 10)).toEqual(0)
    })

    it('search in one-item array', () => {
        expect(binSearch([10], 5)).toEqual(0)
        expect(binSearch([10], 15)).toEqual(1)
        expect(binSearch([10], 10)).toEqual(0)
    })

    it('search in array with unique items', () => {
        const array = [10, 20, 30]
        expect(binSearch(array, 5)).toEqual(0)
        expect(binSearch(array, 15)).toEqual(1)
        expect(binSearch(array, 25)).toEqual(2)
        expect(binSearch(array, 50)).toEqual(3)
    })

    it('search in array with repeated items', () => {
        const array = [10, 15, 20, 20, 20, 20, 20, 30]
        expect(binSearch(array, 20)).toEqual(2)
    })
})
