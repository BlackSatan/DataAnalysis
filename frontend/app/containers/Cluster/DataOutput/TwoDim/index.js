import React from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, DiscreteColorLegend, MarkSeries } from 'react-vis';
import Paper from 'material-ui/Paper';

export default function TwoDim({ clusterized }) {
  const cl = clusterized.map(item => item.map(coord => ({
    x: coord[0],
    y: coord[1],
  })));
  const colors = ['black', 'purple', 'blue', 'red', 'yellow', 'green'];
  return (
    <Paper className="data-output__paper">
      <DiscreteColorLegend
        items={cl.map((item, index) => ({
          title: `Кластер ${index}`,
          color: colors[index],
        }))}
      />
      <XYPlot
        width={400}
        height={400}
      >
        <HorizontalGridLines />
        <VerticalGridLines />
        {cl.map((data, index) => (
          <MarkSeries
            color={colors[index]}
            strokeWidth={1}
            opacity="0.7"
            sizeRange={[1, 1]}
            data={data}
          />
        ))}
        <XAxis title="x" />
        <YAxis title="y" />
      </XYPlot>
    </Paper>
  );
}
