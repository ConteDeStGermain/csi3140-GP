import React from 'react';

interface Bubble {
  id: number;
  value: number;
}

interface BubbleChartProps {
  data: Bubble[];
  width: number;
  height: number;
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data, width, height }) => {
  // Normalize the values to fit in the chart dimensions
  const maxDataValue = Math.max(...data.map(bubble => bubble.value));
  const normalizedData = data.map(bubble => ({
    ...bubble,
    normalizedValue: (bubble.value / maxDataValue) * Math.min(width, height) / 2
  }));

  // Generate random colors for the bubbles
  const colors = normalizedData.map(() => `hsl(${Math.random() * 360}, 100%, 75%)`);

  return (
    <div className={`w-[${width}px] h-[${height}px] border-2 border-black p-4`}>
      <svg width={width} height={height}>
        {normalizedData.map((bubble, i) => {
          // Position the bubbles randomly in the chart
          const cx = Math.random() * (width - 2 * bubble.normalizedValue) + bubble.normalizedValue;
          const cy = Math.random() * (height - 2 * bubble.normalizedValue) + bubble.normalizedValue;

          return (
            <circle
              key={bubble.id}
              cx={cx}
              cy={cy}
              r={bubble.normalizedValue}
              fill={colors[i]}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default BubbleChart;
