import * as d3 from 'd3';
import { FC, useEffect, useState } from 'react';

interface IProps {
  width: number;
  height: number;
}

interface IData {
  date: Date;
  value: number;
}

const TimeSeries: FC<IProps> = ({ width, height }) => {
  const csvURL =
    'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv';

  const [data, setData] = useState<IData[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    } else {
      getURLData();
    }
  }, [data]);

  // Get csv data from a random csv
  // Ex. [{date: '2024-12-12', value: 1000}]
  const getURLData = async () => {
    const tempData: IData[] = [];
    await d3.csv(
      csvURL,
      () => {},
      function (d) {
        const date = d3.timeParse('%Y-%m-%d')(d.date || '');
        const value = parseFloat(d.value || '0');
        if (date && !isNaN(value)) {
          tempData.push({ date, value });
        }
      }
    );
    setData(tempData);
  };

  const drawChart = () => {
    // Establish margins
    const margin = { top: 10, right: 50, bottom: 50, left: 50 };

    // Create the chart area
    const svg = d3
      .select('#time_series')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add X axis --> it is a date format
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, width]);

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value) ?? 0])
      .range([height, 0]);

    svg.append('g').call(d3.axisLeft(y));

    // Set line coordinates
    const line = d3
      .line<IData>()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    // Add the line
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  };

  return (
    <div>
      <h4> Time Series - http CSV response</h4>
      <div id='time_series' />
    </div>
  );
};

export default TimeSeries;
