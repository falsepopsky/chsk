import {
    Chart,
    Axis,
    GridLines,
    Typography,
    MilestoneMotion,
    Tooltip,
    TooltipDataItem,
    TooltipData,
} from '@chsk/core'
import { Schedule, Schedules, isScheduleData } from '@chsk/band'
import { MilestoneStory } from '../types'
import { randomUniformValue } from '../utils'

export const generateScheduleProjectData = () => {
    const times: [number, number][] = []
    times.push([0, Math.floor(randomUniformValue(2, 9))])
    let maxTime = times[0][1]
    times.push([
        maxTime + Math.floor(randomUniformValue(-2, 0.5)),
        maxTime + Math.floor(randomUniformValue(2, 9)),
    ])
    maxTime = times[1][1]
    times.push([
        maxTime + Math.floor(randomUniformValue(-2, 0.5)),
        maxTime + Math.floor(randomUniformValue(2, 9)),
    ])
    maxTime = times[2][1]
    times.push([
        maxTime + Math.floor(randomUniformValue(-2, 0.5)),
        maxTime + Math.floor(randomUniformValue(2, 9)),
    ])
    const ids = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4']
    const keys = ['A', 'B', 'C', 'D']
    return ids.map((id, i) => ({
        id: id,
        data: [{ start: times[i][0], end: times[i][1], key: keys[i] }],
    }))
}

const customTooltipTitle = (x: TooltipData) => {
    return x.data?.[0]?.id
}
const customTooltipLabel = (x: TooltipDataItem) => {
    const start = 'start' in x ? Number(x['start']) : 0
    const end = 'end' in x ? Number(x['end']) : 0
    const duration = end - start
    return String(start) + '-' + String(end) + ' (' + duration + ' days)'
}

export const ScheduleProjectChart = ({ fref, chartData, rawData }: MilestoneStory) => {
    if (!isScheduleData(rawData)) return null
    return (
        <Chart
            data={chartData}
            fref={fref}
            id="schedule-project"
            size={[600, 340]}
            padding={[90, 40, 60, 60]}
        >
            <Schedule data={rawData} keys={['A', 'B', 'C', 'D']} horizontal={true}>
                <Typography position={[-50, -70]} variant={'title'}>
                    The project plan consists of 4 stages
                </Typography>
                <MilestoneMotion initial={'invisible'} initialOn={'axis'}>
                    <Axis variant={'top'} label={'days'} />
                    <GridLines variant={'x'} />
                    <GridLines variant={'y'} />
                </MilestoneMotion>
                <MilestoneMotion initial={'invisible'} initialOn={'A'}>
                    <Axis variant={'left'} ticks={['Phase 1']} />
                    <Schedules keys={['A']} />
                </MilestoneMotion>
                <MilestoneMotion initial={'invisible'} initialOn={'B'}>
                    <Axis variant={'left'} ticks={['Phase 2']} />
                    <Schedules keys={['B']} />
                </MilestoneMotion>
                <MilestoneMotion initial={'invisible'} initialOn={'C'}>
                    <Axis variant={'left'} ticks={['Phase 3']} />
                    <Schedules keys={['C']} />
                </MilestoneMotion>
                <MilestoneMotion initial={'invisible'} initialOn={'D'}>
                    <Axis variant={'left'} ticks={['Phase 4']} />
                    <Schedules keys={['D']} />
                </MilestoneMotion>
                <Tooltip
                    padding={[4, 0, 2, 0]}
                    itemSize={[120, 26]}
                    itemPadding={[4, 8, 4, 8]}
                    titleFormat={customTooltipTitle}
                    labelFormat={customTooltipLabel}
                />
            </Schedule>
        </Chart>
    )
}
