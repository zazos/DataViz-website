import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../assets/css/ComparisonBarChart.css';

const ComparisonBarChart = ({ palestineCsvFilePath, europeanCsvFilePath, conversionRate, selectedMonth }) => {
  const svgRef = useRef();
  const titleRef = useRef();

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

  const palestineColor = '#fc8d62';
  const europeColor = '#8da0cb';

  useEffect(() => {
    const margin = { top: 50, right: 135, bottom: 60, left: 205 };
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Clear the previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

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
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .text(`Average Commodity Prices: Europe (June-24) vs Palestine (${selectedMonth})`);

    // Store the title element in the reference for later updates
    titleRef.current = title;

    let convertedPalestineData;
    const months = ['Sep-23', 'Oct-23', 'Nov-23', 'Dec-23', 'Jan-24', 'Feb-24', 'Mar-24', 'Apr-24'];

    d3.csv(palestineCsvFilePath).then((data) => {
      console.log("Palestine raw data:", data);

      // Process Palestine data with specific mapping for each month
      const processedPalestineData = data.map(d => {
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
      convertedPalestineData = processedPalestineData.map(d => {
        let entry = { Commodity: d.Commodity };
        months.forEach(month => {
          entry[month] = (d[month] * conversionRate).toFixed(2);
        });
        return entry;
      });
      console.log("Converted Palestine data:", convertedPalestineData);

      d3.csv(europeanCsvFilePath).then((europeanData) => {
        console.log("European raw data:", europeanData);

        const europeanDataParsed = europeanData.map(d => ({
          Commodity: d.Commodity,
          Price: parseFloat(d['Average Price'].replace(/,/g, ''))
        }));
        console.log("Parsed European data:", europeanDataParsed);

        const updateChart = (month) => {
          // Update the title with the selected month
          titleRef.current.text(`Average Commodity Prices: Europe (June-24) vs Palestine (${month})`);

          const palestineData = convertedPalestineData.map(d => ({
            Commodity: d.Commodity,
            PalestinePrice: parseFloat(d[month]),
            Category: commodityCategories[d.Commodity]
          }));

          const mergedData = palestineData.map(palestineItem => {
            const europeItem = europeanDataParsed.find(europeItem => europeItem.Commodity === palestineItem.Commodity);
            if (!europeItem || europeItem.Price === 0) {
              return null; // Skip commodities with 0 or missing price in the European dataset
            }
            const deviation = Math.abs(palestineItem.PalestinePrice - europeItem.Price);
            return {
              Commodity: palestineItem.Commodity,
              PalestinePrice: palestineItem.PalestinePrice,
              EuropePrice: europeItem.Price,
              Category: palestineItem.Category,
              Deviation: deviation
            };
          }).filter(item => item !== null) // Remove null entries
            .sort((a, b) => b.Deviation - a.Deviation)
            .slice(0, 10);  // Limit to top 10 commodities with highest deviation

          x.domain([0, d3.max(mergedData, d => Math.max(d.PalestinePrice, d.EuropePrice) + 20)]);
          y.domain(mergedData.map(d => d.Commodity));

          xAxis.transition().duration(500).call(d3.axisBottom(x).ticks(10).tickFormat(d3.format(',.2f')));
          yAxis.transition().duration(500).call(d3.axisLeft(y).tickSize(0).tickPadding(10));

          // Update bars for Palestine
          const barsPalestine = svg.selectAll('.bar-palestine')
            .data(mergedData, d => d.Commodity);

          barsPalestine.enter().append('rect')
            .attr('class', 'bar-palestine')
            .attr('x', 0)
            .attr('y', d => y(d.Commodity))
            .attr('width', 0)
            .attr('height', y.bandwidth() / 2)
            .attr('fill', palestineColor)  // Use Palestine color
            .merge(barsPalestine)
            .transition().duration(500)
            .attr('x', 0)
            .attr('y', d => y(d.Commodity))
            .attr('width', d => x(d.PalestinePrice))
            .attr('height', y.bandwidth() / 2)
            .attr('fill', palestineColor);  // Use Palestine color

          barsPalestine.exit().remove();

          // Update bars for Europe
          const barsEurope = svg.selectAll('.bar-europe')
            .data(mergedData, d => d.Commodity);

          barsEurope.enter().append('rect')
            .attr('class', 'bar-europe')
            .attr('x', 0)
            .attr('y', d => y(d.Commodity) + y.bandwidth() / 2)
            .attr('width', 0)
            .attr('height', y.bandwidth() / 2)
            .attr('fill', europeColor)  // Use Europe color
            .merge(barsEurope)
            .transition().duration(500)
            .attr('x', 0)
            .attr('y', d => y(d.Commodity) + y.bandwidth() / 2)
            .attr('width', d => x(d.EuropePrice))
            .attr('height', y.bandwidth() / 2)
            .attr('fill', europeColor);  // Use Europe color

          barsEurope.exit().remove();

          // Update labels for Palestine
          const labelsPalestine = svg.selectAll('.label-palestine')
            .data(mergedData, d => d.Commodity);

          labelsPalestine.enter().append('text')
            .attr('class', 'label-palestine')
            .attr('x', d => x(d.PalestinePrice) + 5)
            .attr('y', d => y(d.Commodity) + y.bandwidth() / 4 + 4)
            .text(d => `$${d3.format(',.2f')(d.PalestinePrice)}`)
            .merge(labelsPalestine)
            .transition().duration(500)
            .attr('x', d => x(d.PalestinePrice) + 5)
            .attr('y', d => y(d.Commodity) + y.bandwidth() / 4 + 4)
            .text(d => `$${d3.format(',.2f')(d.PalestinePrice)}`);

          labelsPalestine.exit().remove();

          // Update labels for Europe
          const labelsEurope = svg.selectAll('.label-europe')
            .data(mergedData, d => d.Commodity);

          labelsEurope.enter().append('text')
            .attr('class', 'label-europe')
            .attr('x', d => x(d.EuropePrice) + 5)
            .attr('y', d => y(d.Commodity) + y.bandwidth() * 3 / 4 + 4)
            .text(d => `$${d3.format(',.2f')(d.EuropePrice)}`)
            .merge(labelsEurope)
            .transition().duration(500)
            .attr('x', d => x(d.EuropePrice) + 5)
            .attr('y', d => y(d.Commodity) + y.bandwidth() * 3 / 4 + 4)
            .text(d => `$${d3.format(',.2f')(d.EuropePrice)}`);

          labelsEurope.exit().remove();
        };

        // Initialize with the first month
        updateChart(selectedMonth);

        const legendComparison = svg.selectAll('.legend-comparison')
          .data(['Palestine', 'Europe'])
          .enter().append('g')
          .attr('class', 'legend-comparison')
          .attr('transform', (d, i) => `translate(0,${i * 25 + 220})`); // Adjust vertical spacing if needed

        const legendRectSize = 18; // Define the size of the legend rectangle
        const legendSpacing = 6; // Define spacing between rectangle and text

        legendComparison.append('rect')
          .attr('x', width - legendRectSize)
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', (d, i) => i === 0 ? palestineColor : europeColor);  // Use Palestine and Europe colors

        legendComparison.append('text')
          .attr('x', width - legendRectSize - legendSpacing)
          .attr('y', legendRectSize / 2)
          .attr('dy', '.35em')
          .style('text-anchor', 'end')
          .text(d => d);

      }).catch(error => {
        console.error("Error loading European data:", error);
      });
    }).catch(error => {
      console.error("Error loading Palestine data:", error);
    });
  }, [palestineCsvFilePath, europeanCsvFilePath, conversionRate, selectedMonth]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ComparisonBarChart;
