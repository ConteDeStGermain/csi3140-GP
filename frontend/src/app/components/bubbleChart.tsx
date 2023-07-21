import React from 'react';

interface Bubble {
  id: number;
  value: number;
  normalizedValue?: number;
}

interface BubbleChartProps {
  data: Bubble[];
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

const MAX_ATTEMPTS = 1000; // The maximum number of attempts to find a non-overlapping position for each bubble
const WIDTH = 700;
const HEIGHT = 300;

// Check if two bubbles overlap
function overlaps(a: Bubble & Position, b: Bubble & Position): boolean {
  const distance = Math.hypot(b.x - a.x, b.y - a.y);
  return distance < (a.normalizedValue + b.normalizedValue);
}

const generateBubblePositions = (bubbles: Bubble[]): (Bubble & Position)[] => {
  const positions: (Bubble & Position)[] = [];
  for (const bubble of bubbles) {
    let attempts = 0;
    while (attempts < MAX_ATTEMPTS) {
      const position = {
        x: Math.random() * (WIDTH - 2 * bubble.normalizedValue) + bubble.normalizedValue,
        y: Math.random() * (HEIGHT - 2 * bubble.normalizedValue) + bubble.normalizedValue,
      };

      const overlapping = positions.some((pos) => overlaps(pos, { ...bubble, ...position }));

      if (!overlapping) {
        positions.push({ ...bubble, ...position });
        break;
      }

      attempts++;
    }
  }
  return positions;
};

// Generate a color between red and green based on value
function getColor(value: number): string {
  // Normalize the value from -3 to 3 to 0 to 1
  const normalizedValue = (value + 3) / 6;
  // Get the hue value ranging from red (0) to green (120)
  const hue = (normalizedValue * 120).toString(10);
  return ["hsl(", hue, ",100%, 75%, 0.8)"].join("");
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data, width, height }) => {
  // Normalize the values to fit in the chart dimensions
  let maxDataValue: number = 0;
  let normalizedData: any = [];
  if (data) {
    maxDataValue = Math.max(...data.map(bubble => bubble[1]));  // Access the value at index 1
    normalizedData = data.map((bubble, index) => ({
      id: index,  // Access the id at index 0
      label: bubble[0],  // Access the value at index 1
      normalizedValue: (bubble[1] / maxDataValue) * Math.min(width / 2, height / 2) / 2,
      attitude: bubble[2]
    }));
  }

  // Generate random colors for the bubbles
  // const colors = normalizedData.map(() => `hsl(${Math.random() * 360}, 100%, 75%)`);
  const colors = normalizedData.map((bubble: any) => getColor(bubble.attitude));
  const bubblePositions = generateBubblePositions(normalizedData)

  console.log("Data:" + data)

  return (
    <div className={`w-[${width}px] h-[${height}px] border-1 border-black p-4 bg-white rounded`}>
      <svg width={width} height={height}>
        {bubblePositions.map((bubble: any, i: any) => {
          return (
            <svg key={i}>
              <circle
                key={bubble.id}
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.normalizedValue}
                fill={colors[i]}
              />
              <text
                x={bubble.x}
                y={bubble.y}
                textAnchor="middle"
                fill="#808080" // you can adjust this color
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
