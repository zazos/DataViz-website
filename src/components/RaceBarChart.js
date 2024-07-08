import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../assets/css/RaceBarChart.css';

const RaceBarChart = ({ csvFilePath, conversionRate }) => {
  const svgRef = useRef();
  const categoryColors = {
    'Staple Foods': '#66c2a5', // Green-Blue
    'Meat and Dairy Products': '#fc8d62', // Orange-Red
    'Fresh Produce': '#8da0cb', // Blue-Purple
    'Water': '#e78ac3', // Pink
    'Oils and Fats': '#a6d854', // Yellow-Green
    'Fuel': '#ffd92f', // Yellow
    'Travel Expenses': '#e5c494', // Light Brown
    'Cigarettes': '#b3b3b3' // Gray
  };

  const commodityCategories = {
    'rice (1 kg)': 'Staple Foods',
    'flour (50 kg)': 'Staple Foods',
    'bread (3 kg)': 'Staple Foods',
    'chickens (1 kg)': 'Meat and Dairy Products',
    'eggs (2 kg)': 'Meat and Dairy Products',
    'oil (3 liter)': 'Oils and Fats',
    'lemons (1 kg)': 'Fresh Produce',
    'apples (1 kg)': 'Fresh Produce',
    'tomatoes (1 kg)': 'Fresh Produce',
    'zucchinis (1 kg)': 'Fresh Produce',
    'eggplants (1 kg)': 'Fresh Produce',
    'chili pepper (1 kg)': 'Fresh Produce',
    'bell pepper (1 kg)': 'Fresh Produce',
    'cucumbers (1 kg)': 'Fresh Produce',
    'dry onions (1 kg)': 'Fresh Produce',
    'potato (1 kg)': 'Fresh Produce',
    'mineral water bottle (1.5 liters)': 'Water',
    'gasoline (1 liter)': 'Fuel',
    'diesel (1 liter)': 'Fuel',
    'North-Center Trip (1-way)': 'Travel Expenses',
    'North-South Trip (1-way)': 'Travel Expenses',
    'biscuits (1 kg)': 'Staple Foods',
    'Crushed bulgur (1 kg)': 'Staple Foods',
    'Crushed dry freekeh (1 kg)': 'Staple Foods',
    'Fresh Veal (1 kg)': 'Meat and Dairy Products',
    'Fresh Lamb With Bone (1 kg)': 'Meat and Dairy Products',
    'Baby Milk Powder (400 gm)': 'Meat and Dairy Products',
    'Cheese (200 gm)': 'Meat and Dairy Products',
    'Pure white sugar (10 kg)': 'Staple Foods',
    'White Table Salt (1 kg)': 'Staple Foods',
    'white yeast (450 gm)': 'Staple Foods',
    'Ground coffee (1 kg)': 'Staple Foods',
    'White Canned Cooked Beans (570 gm)': 'Staple Foods',
    'Egyptian beans medames (380 gm)': 'Staple Foods',
    'crushed red lentils (1 kg)': 'Staple Foods',
    'Tomato Paste (560 gm)': 'Staple Foods',
    'Marlboro Cigarettes (20)': 'Cigarettes',
    'L-M cigarettes (20)': 'Cigarettes',
    'Gas Cylinder (12 kg)': 'Fuel',
    'Potable water (250 litres)': 'Water',
    'Potable water (500 litres)': 'Water',
    'Potable water (1000 litres)': 'Water'
  };

  function getCategoryColor(commodity) {
    const category = commodityCategories[commodity];
    return categoryColors[category];
  }

  useEffect(() => {
    const margin = { top: 50, right: 100, bottom: 60, left: 245 }; // Adjusted right margin to provide space for labels
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleBand().range([0, height]).padding(0.1);

    const xAxis = svg.append('g')
      .attr('class', 'axis-label')
      .attr('transform', `translate(0,${height})`);

    const yAxis = svg.append('g')
      .attr('class', 'axis-label');

    const title = svg.append('text')
      .attr('class', 'title')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .text('Basic Commodities in Gaza from October 2023 to April 2024');

    const monthLabel = svg.append('text')
      .attr('class', 'month-label')
      .attr('x', width - 10)
      .attr('y', height - 10)
      .attr('text-anchor', 'end')
      .text('Sep-23');

    let convertedData;

    const months = ['Sep-23', 'Oct-23', 'Nov-23', 'Dec-23', 'Jan-24', 'Feb-24', 'Mar-24', 'Apr-24'];

    d3.csv(csvFilePath).then((data) => {
      // Process Palestine data with specific mapping for each month
      const processedData = data.map(d => {
        let entry = {
          Commodity: d['commodity name (english)'],
          'Sep-23': parseFloat(d['average price before 7 October 2023'].replace(/,/g, '')),
          'Oct-23': parseFloat(d['average price after 7 October 2023'].replace(/,/g, '')),
          'Nov-23': parseFloat(d['Nov-23'].replace(/,/g, '')),
          'Dec-23': parseFloat(d['Dec-23'].replace(/,/g, '')),
          'Jan-24': parseFloat(d['Jan-24'].replace(/,/g, '')),
          'Feb-24': parseFloat(d['Feb-24'].replace(/,/g, '')),
          'Mar-24': parseFloat(d['Mar-24'].replace(/,/g, '')),
          'Apr-24': parseFloat(d['Apr-24'].replace(/,/g, ''))
        };
        return entry;
      });

      // Convert prices to USD
      convertedData = processedData.map(d => {
        let entry = { Commodity: d.Commodity };
        months.forEach(month => {
          entry[month] = (d[month] * conversionRate).toFixed(2);
        });
        return entry;
      });

      function update(month) {
        const currentData = convertedData.map(d => ({
          Commodity: d.Commodity,
          value: parseFloat(d[month])
        })).sort((a, b) => b.value - a.value).slice(0, 10);

        // Ensure the values are numerical
        currentData.forEach(d => {
          d.value = +d.value;
        });

        x.domain([0, d3.max(currentData, d => d.value)]);
        y.domain(currentData.map(d => d.Commodity));

        xAxis.transition().duration(500).call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(',.2f')));

        yAxis.transition().duration(500).call(d3.axisLeft(y));

        const bars = svg.selectAll('.bar')
          .data(currentData, d => d.Commodity);

        bars.exit().remove();  // Remove old elements

        bars.enter().append('rect')
          .attr('class', 'bar')
          .attr('x', 0)
          .attr('y', d => y(d.Commodity))
          .attr('width', 0)
          .attr('height', y.bandwidth())
          .attr('fill', d => getCategoryColor(d.Commodity))
          .merge(bars)
          .transition().duration(500)
          .attr('x', 0)
          .attr('y', d => y(d.Commodity))
          .attr('width', d => x(d.value))
          .attr('height', y.bandwidth())
          .attr('fill', d => getCategoryColor(d.Commodity));

        const labels = svg.selectAll('.bar-label')
          .data(currentData, d => d.Commodity);

        labels.exit().remove();  // Remove old elements

        labels.enter().append('text')
          .attr('class', 'bar-label')
          .attr('x', d => x(d.value) + 5) // Move labels outside the bars
          .attr('y', d => y(d.Commodity) + y.bandwidth() / 2 + 4)
          .text(d => `$${d3.format(',.2f')(d.value)}`)
          .merge(labels)
          .transition().duration(500)
          .attr('x', d => x(d.value) + 5) // Move labels outside the bars
          .attr('y', d => y(d.Commodity) + y.bandwidth() / 2 + 4)
          .text(d => `$${d3.format(',.2f')(d.value)}`);

        monthLabel.text(month);
      }

      let monthIndex = 0;
      let interval;

      function startInterval() {
        interval = setInterval(() => {
          monthIndex = (monthIndex + 1) % months.length;
          update(months[monthIndex]);
          document.getElementById('slider').value = monthIndex;
        }, 2000);
      }

      document.getElementById('play').addEventListener('click', () => {
        clearInterval(interval);
        startInterval();
      });

      document.getElementById('pause').addEventListener('click', () => {
        clearInterval(interval);
      });

      document.getElementById('reset').addEventListener('click', () => {
        clearInterval(interval);
        monthIndex = 0;
        update(months[monthIndex]);
        document.getElementById('slider').value = monthIndex;
      });

      document.getElementById('slider').addEventListener('input', (event) => {
        clearInterval(interval);
        monthIndex = +event.target.value;
        update(months[monthIndex]);
      });

      update(months[monthIndex]);

      // Add legend for the race bar chart
      const legend = svg.selectAll('.legend')
        .data(Object.keys(categoryColors))
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0,${i * 20 + 220})`);

      legend.append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', d => categoryColors[d]);

      legend.append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(d => d);
    });

  }, [csvFilePath, conversionRate]);

  return (
    <div className="race-bar-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default RaceBarChart;
