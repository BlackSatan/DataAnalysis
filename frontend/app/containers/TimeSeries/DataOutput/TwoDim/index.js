import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries, MarkSeries } from 'react-vis';
import Paper from 'material-ui/Paper';

export default function TwoDim({ data, old, ...otherProps }) {
  const tf = data.map((y, index) => ({
    x: index,
    y: parseFloat(y),
  })).toJS();
  const of = old ? old.map((y, index) => ({
    x: index,
    y: parseFloat(y),
  })).toJS() : false;

  return (
    <XYPlot
      width={600}
      height={600}
    >
      <HorizontalGridLines />
      <VerticalGridLines />
      <LineSeries
        {...otherProps}
        color="red"
        strokeWidth={1}
        opacity="0.7"
        sizeRange={[1, 1]}
        data={tf}
      />
      {of && <LineSeries
        {...otherProps}
        color="blue"
        strokeWidth={1}
        opacity="0.7"
        sizeRange={[1, 1]}
        data={of}
      />}
      {/*<MarkSeries*/}
        {/*color="blue"*/}
        {/*strokeWidth={1}*/}
        {/*opacity="0.7"*/}
        {/*sizeRange={[1, 1]}*/}
        {/*data={tf}*/}
      {/*/>*/}
      <XAxis title="X" />
      <YAxis title="Y" />
    </XYPlot>
  );
}
