import React from 'react'
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import { View } from "react-native";

export default class Chart extends React.PureComponent {
    render() {
        //const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]

        const { data, yAccessor, xAccessor, formatXLabel, formatYLabel } = this.props;

        return (
            <View style={{ backgroundColor: 'white' }}>
                <View style={{ height: 200, flexDirection: 'row' }}>
                    <YAxis
                        data={data}
                        contentInset={{ top: 20, bottom: 20 }}
                        svg={{
                            fill: 'grey',
                            fontSize: 10,
                        }}
                        numberOfTicks={10}
                        formatLabel={formatYLabel}
                        yAccessor={yAccessor}
                    />
                    <LineChart
                        data={data}
                        style={{ flex: 1 }}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                        contentInset={{ top: 20, bottom: 20 }}
                        yAccessor={yAccessor}
                        xAccessor={xAccessor}
                    >
                        <Grid />
                    </LineChart>
                </View>
                <XAxis
                    style={{ marginHorizontal: -5 }}
                    data={data}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                    numberOfTicks={10}
                    xAccessor={xAccessor}
                    formatLabel={formatXLabel}
                />
            </View>

        )
    }
}
