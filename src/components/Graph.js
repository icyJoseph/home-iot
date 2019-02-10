import React from "react";
import { LineChart, Line, XAxis, YAxis } from "recharts";

const strokes = ["#8884d8", "#82ca9d"];

export function Graph({ data }) {
  const [first = {}] = data;
  const keys = Object.keys(first).filter(key => key !== "name");

  return (
    <LineChart width={400} height={400} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      {keys.map((key, index) => {
        return (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={strokes[index]}
          />
        );
      })}
    </LineChart>
  );
}

export default Graph;
