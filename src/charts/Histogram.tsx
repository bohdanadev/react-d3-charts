import * as d3 from 'd3';
import { FC, useEffect, useState } from 'react';

interface IProps {
  width: number;
  height: number;
}

interface IData {
  state: string;
  frequency: number;
}

const Histogram: FC<IProps> = ({ width, height }) => {
  const jsonURL = 'https://api.openbrewerydb.org/breweries';

  const [data, setData] = useState<IData[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    } else {
      getURLData();
    }
  }, [data]);

  // Fetchs json and converts to an array
  const getURLData = async () => {
    const urlResponse = await fetch(jsonURL);
    const jsonResult = await urlResponse.json();

    const stateFreq: Record<string, number> = {};

    jsonResult.forEach((element: { state: string }) => {
      if (stateFreq[element.state] > 0) {
        stateFreq[element.state] = stateFreq[element.state] + 1;
      } else {
        stateFreq[element.state] = 1;
      }
    });

    // Convert the dictionary to an array and sort it by frequency
    const stateFreqArray = Object.keys(stateFreq).map((key) => ({
      state: key,
      frequency: stateFreq[key],
    }));
    setData(stateFreqArray.sort((a, b) => b.frequency - a.frequency));
  };

  const drawChart = () => {
    // Declare margins
    const margin = { top: 70, right: 50, bottom: 70, left: 50 };

    // Create the svg that holds the chart
    const svg = d3
      .select('#histogram')
      .append('svg')
      .style('background-color', 'white')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(0,-${margin.bottom - 10})`);

    // Create the x axis scale, scaled to the states
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.state))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

    // Create the y axis scale, scaled from 0 to the max
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.frequency) || 0])
      .range([height - margin.bottom, margin.top]);

    // Create a scale between colors that varies by the frequency
    const barColors = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.frequency) || 0])
      .range(['blue', 'red']);

    // Set the x axis on the bottom.
    // Tilts the axis text so it's readable and not smushed
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    // Set the y axis on the left
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Create the actual bars on the graph, appends a 'rect' for every data element
    // Sets the x and y positions relative to the scales already established
    // Sets the height according to the yscale
    // Static bar width, color is scaled on the y axis
    // Finally the bars have an outline
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.state) || 0)
      .attr('y', (d) => yScale(d.frequency))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.frequency))
      .style('padding', '3px')
      .style('margin', '1px')
      .style('width', (d) => `${d * 10}px`)
      .attr('fill', function (d) {
        return barColors(d.frequency);
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  };

  return (
    <div>
      <h4> Histogram- http JSON response </h4>
      <div id='histogram' />
    </div>
  );
};

export default Histogram;
