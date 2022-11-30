/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
import React from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
} from 'recharts';

import rawData from './data.json';

const colors = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

const Candlestick = (props) => {
  const {
    x,
    y,
    width,
    height,
    lowPrice,
    highPrice,
    openClose: [openPrice, closePrice],
  } = props;
  const isGrowing = openPrice < closePrice;
  const color = isGrowing ? 'green' : 'red';
  const ratio = Math.abs(height / (openPrice - closePrice));
  return (
    <g stroke={color} fill="none" strokeWidth="2">
      <path
        d={`
          M ${x},${y}
          L ${x},${y + height}
          L ${x + width},${y + height}
          L ${x + width},${y}
          L ${x},${y}
        `}
      />
      {/* bottom line */}
      {isGrowing ? (
        <path
          d={`
            M ${x + width / 2}, ${y + height}
            v ${(openPrice - lowPrice) * ratio}
          `}
        />
      ) : (
        <path
          d={`
            M ${x + width / 2}, ${y}
            v ${(closePrice - lowPrice) * ratio}
          `}
        />
      )}
      {/* top line */}
      {isGrowing ? (
        <path
          d={`
            M ${x + width / 2}, ${y}
            v ${(closePrice - highPrice) * ratio}
          `}
        />
      ) : (
        <path
          d={`
            M ${x + width / 2}, ${y + height}
            v ${(openPrice - highPrice) * ratio}
          `}
        />
      )}
    </g>
  );
};

const prepareData = (data) =>
  data.map(({ openPrice, closePrice, ...other }) => ({
    ...other,
    openClose: [openPrice, closePrice],
  }));

const CustomShapeBarChart = () => {
  const data = prepareData(rawData.data);
  const minValue = data.reduce(
    (minValue, { lowPrice, openClose: [openPrice, closePrice] }) => {
      const currentMin = Math.min(lowPrice, openPrice, closePrice);
      return minValue === null || currentMin < minValue ? currentMin : minValue;
    },
    null
  );
  const maxValue = data.reduce(
    (maxValue, { highPrice, openClose: [openPrice, closePrice] }) => {
      const currentMax = Math.max(highPrice, openPrice, closePrice);
      return currentMax > maxValue ? currentMax : maxValue;
    },
    minValue
  );

  return (
    <div>
      <text>{rawData.rs}</text>
      <ComposedChart
        width={800}
        height={800}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="date" />
        <YAxis domain={[minValue - 400, maxValue + 400]} />
        <Bar dataKey="openClose" fill="#8884d8" shape={<Candlestick />}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % 20]} />
          ))}
        </Bar>
        <Line type="momotone" dataKey="ema20" stroke="yellow" dot={false} />
        <Line type="momotone" dataKey="ema50" stroke="green" dot={false} />
        <Line type="momotone" dataKey="ema200" stroke="red" dot={false} />

        <ReferenceLine
          y={rawData.trade.stopLoss}
          label={"Stop loss " + Math.round(rawData.trade.stopLoss)}
          stroke="red"
          strokeDasharray="3 3"
        />
        <ReferenceLine
          y={rawData.trade.takeProfit}
          label={"Take profit " + Math.round(rawData.trade.takeProfit)}
          stroke="green"
          strokeDasharray="3 3"
        />
        <ReferenceLine
          y={rawData.trade.entry}
          label={"Entry " + Math.round(rawData.trade.entry)}
          stroke="tan"
          strokeDasharray="3 3"
        />
      </ComposedChart>
    </div>
  );
};

export default CustomShapeBarChart;
