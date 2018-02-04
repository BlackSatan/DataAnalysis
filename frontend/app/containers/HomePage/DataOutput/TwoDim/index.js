import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries, MarkSeries } from 'react-vis';
import Paper from 'material-ui/Paper';

export default function TwoDim({ data, old }) {
  const tf = data[0].map((x, i) => ({
    x: parseInt(x, 10),
    y: parseInt(data[1][i], 10),
  }));
  const of = old ? old[0].map((x, i) => ({
    x: parseInt(x, 10),
    y: parseInt(data[1][i], 10),
  })) : [];
  return (
    <Paper>
      <XYPlot
        width={400}
        height={400}
      >
        <HorizontalGridLines />
        <VerticalGridLines />
        <MarkSeries
          color="red"
          strokeWidth={1}
          opacity="0.7"
          sizeRange={[1, 1]}
          data={of}
        />
        <MarkSeries
          color="blue"
          strokeWidth={1}
          opacity="0.7"
          sizeRange={[1, 1]}
          data={tf}
        />
        <XAxis title="X" />
        <YAxis title="Y" />
      </XYPlot>
    </Paper>
  );
}
