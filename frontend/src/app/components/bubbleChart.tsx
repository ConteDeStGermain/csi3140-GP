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
  let maxDataValue: number = 0;
  let normalizedData: any = [];
  
  if (data) {
    maxDataValue = Math.max(...data.map(bubble => bubble.value));
    normalizedData = data.map(bubble => ({
      ...bubble,
      normalizedValue: (bubble.value / maxDataValue) * Math.min(width, height) / 2
    }));
  }
  // Generate random colors for the bubbles
  const colors = normalizedData.map(() => `hsl(${Math.random() * 360}, 100%, 75%)`);

  return (
    <div className={`w-[${width}px] h-[${height}px] border-2 border-black p-4`}>
      <svg width={width} height={height}>
        {normalizedData.map((bubble: any, i: any) => {
          // Position the bubbles randomly in the chart
          const cx = Math.random() * (width - 2 * bubble.normalizedValue) + bubble.normalizedValue;
          const cy = Math.random() * (height - 2 * bubble.normalizedValue) + bubble.normalizedValue;

          return (
            <svg key={i}>
            <circle
              key={bubble.id}
              cx={cx}
              cy={cy}
              r={bubble.normalizedValue}
              fill={colors[i]}
            />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              fill="#fff" // you can adjust this color
              fontSize="20" // adjust the font size
              dy=".3em" // to center text vertically in the circle
            >
              {bubble.label}
            </text>
          </svg>
          );
        })}
      </svg>
    </div>
  );
};

export default BubbleChart;
