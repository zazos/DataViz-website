import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ToiletBarChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    // Data
    const categories = ['Global Standard for Emergencies', 'Gaza & Rafah'];
    const values = [20, 850];
    const hoverText = [
      'Global Standard: 1 Toilet per 20 People',
      'Gaza, Rafah: 1 Toilet per 850 People'
    ];

    // Dimensions and margins
    const margin = { top: 40, right: 30, bottom: 50, left: 70 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove any existing chart
    d3.select(chartRef.current).select('svg').remove();

    // Append the SVG object
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(categories)
      .padding(0.4);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '16px');

    // Y axis
    const y = d3.scaleLinear()
      .domain([0, 900])
      .range([height, 0]);

    svg.append('g')
      .call(d3.axisLeft(y).ticks(10))
      .selectAll('text')
      .attr('fill', 'white')
      .attr('font-size', '16px');

    // Bars
    svg.selectAll('bars')
      .data(values)
      .enter()
      .append('rect')
      .attr('x', (d, i) => x(categories[i]))
      .attr('y', d => y(d))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d))
      .attr('fill', (d, i) => i === 0 ? 'red' : 'cornflowerblue')
      .on('mouseover', function (event, d) {
        svg.append('text')
          .attr('id', 'tooltip')
          .attr('x', x(categories[values.indexOf(d)]) + x.bandwidth() / 2)
          .attr('y', y(d) - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '14px')
          .text(hoverText[values.indexOf(d)]);
      })
      .on('mouseout', function (event, d) {
        svg.select('#tooltip').remove();
      });

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '20px')
      .text('Unsanitary Toilet Situation in Gaza and Rafah');

    // X Axis Label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      

    // Y Axis Label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '18px')
      .text('Number of People');
  }, []);

  return (
    <div ref={chartRef}></div>
  );
};

export default ToiletBarChart;
