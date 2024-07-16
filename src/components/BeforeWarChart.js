import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './BeforeWarChart.css'; // Add your CSS styles for the SVG here

const BeforeWarChart = () => {
  const svgRef = useRef();
  const startAnimationsRef = useRef();  //TEST LINE

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear any previous content
    svg.selectAll('*').remove();

    // Your D3.js code here

    // Background rectangle above the river (light blue)
    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "50%")
        .attr("fill", "lightblue");

    // Background rectangle below the river (light brown)
    svg.append("rect")
        .attr("x", 0)
        .attr("y", "50%")
        .attr("width", "100%")
        .attr("height", "50%")
        .attr("fill", "#CA986D");

    // River dimensions
    const riverWidth = 1400; // Doubled river width
    const riverHeight = 160;
    const riverY = 150; // Y position remains the same

    // Wave path for the river's upper side
    const wavePath = d3.line()
        .x((d, i) => i * (riverWidth / 20))
        .y((d, i) => riverY + 10 * Math.sin(i * 0.6));

    // River data points
    const riverData = Array.from({ length: 21 }, (_, i) => i);

    // Create the wavy path
    const wave = svg.append("path")
        .datum(riverData)
        .attr("d", wavePath)
        .attr("fill", "none")
        .attr("stroke", "none");

    // Get the path data to use for the river shape
    const wavePathData = wave.node().getAttribute('d');

    // Draw the river using the wave path data
    svg.append("path")
        .attr("d", `${wavePathData} L${riverWidth},${riverY + riverHeight} L0,${riverY + riverHeight} Z`)
        .attr("class", "river");

    // Tank dimensions
    const tankWidth = 200;
    const tankHeight = 250;
    const tank1X = 350;
    const tank2X = 800; // Adjusted tank 2 position
    const tankY = riverY + riverHeight + 25;

    // Draw the tanks with three sides (no top)
    svg.append("path")
        .attr("d", `M${tank1X},${tankY} L${tank1X},${tankY + tankHeight} L${tank1X + tankWidth},${tankY + tankHeight} L${tank1X + tankWidth},${tankY}`)
        .attr("class", "tank");

    svg.append("path")
        .attr("d", `M${tank2X},${tankY} L${tank2X},${tankY + tankHeight} L${tank2X + tankWidth},${tankY + tankHeight} L${tank2X + tankWidth},${tankY}`)
        .attr("class", "tank");

    // Add water to the tanks
    const water1 = svg.append("rect")
        .attr("x", tank1X)
        .attr("y", tankY + tankHeight)
        .attr("width", tankWidth)
        .attr("height", 0)
        .attr("class", "water");

    const water2 = svg.append("rect")
        .attr("x", tank2X)
        .attr("y", tankY + tankHeight)
        .attr("width", tankWidth)
        .attr("height", 0)
        .attr("class", "water");

    // Rectangles to visualize water flow from river to tanks
    const rectWidth = 10; // Adjust the width of the rectangles
    const cx1 = tank1X + tankWidth / 2;
    const cx2 = tank2X + tankWidth / 2;

    const waterFlow1 = svg.append("rect")
        .attr("x", cx1 - rectWidth / 2) // Position at the center of tank 1
        .attr("y", riverY + riverHeight)
        .attr("width", rectWidth)
        .attr("height", 0)
        .attr("fill", "cornflowerblue");

    const waterFlow2 = svg.append("rect")
        .attr("x", cx2 - rectWidth / 2) // Position at the center of tank 2
        .attr("y", riverY + riverHeight)
        .attr("width", rectWidth)
        .attr("height", 0)
        .attr("fill", "cornflowerblue");

    // Function to start animations
    function startAnimations() {
        waterFlow1.transition()
            .duration(3000)
            .attr("height", tankHeight + 25) // Set height to tank height
            .on("end", () => {
                // Animate the water filling the first tank
                water1.transition()
                    .duration(3000)
                    .attr("y", tankY + tankHeight - tankHeight * 0.8)
                    .attr("height", tankHeight * 0.8)
                    .on("end", () => {
                        waterFlow1.remove(); // Remove rectangle when water level animation ends
                    });
            });

        waterFlow2.transition()
            .duration(2000)
            .delay(1000)
            .attr("height", tankHeight + 25) // Set height to tank height
            .on("end", () => {
                // Animate the water filling the second tank
                water2.transition()
                    .duration(3000)
                    .attr("y", tankY + tankHeight - tankHeight * 0.2)
                    .attr("height", tankHeight * 0.2)
                    .on("end", () => {
                        waterFlow2.remove(); // Remove rectangle when water level animation ends
                    });
            });

        // Create water drops from each cloud
        createWaterDrop(390, 60);
        createWaterDrop(470, 60);
        createWaterDrop(445, 60);
        createWaterDrop(445, 60);
        createWaterDrop(415, 60);
        createWaterDrop(415, 60);
        createWaterDrop(610, 60);
        createWaterDrop(690, 60);
        createWaterDrop(665, 50);
        createWaterDrop(665, 70);
        createWaterDrop(635, 50);
        createWaterDrop(635, 70);
        createWaterDrop(160, 60);
        createWaterDrop(80, 60);
        createWaterDrop(105, 50);
        createWaterDrop(105, 70);
        createWaterDrop(135, 50);
        createWaterDrop(135, 70);
        createWaterDrop(1135, 70);
        createWaterDrop(1135, 50);
        createWaterDrop(1135, 70);
        createWaterDrop(1165, 70);
        createWaterDrop(1155, 50);
        createWaterDrop(1155, 70);
        createWaterDrop(935, 50);
        createWaterDrop(935, 70);
        createWaterDrop(965, 70);
        createWaterDrop(955, 50);
        createWaterDrop(955, 70);
    }

    startAnimationsRef.current = startAnimations;  //TEST LINE

    // Function to create water drops in the shape of water droplets
    function createWaterDrop(cx, cy) {
        const drop = svg.append("path")
            .attr("d", `M${cx},${cy + 20} C${cx - 8},${cy + 35} ${cx + 8},${cy + 35} ${cx},${cy + 60} Q${cx - 8},${cy + 45} ${cx},${cy + 60} C${cx + 8},${cy + 45} ${cx - 8},${cy + 45} ${cx},${cy + 20} Z`)
            .attr("class", "drop")
            .attr("opacity", 0); // Initially hidden

        drop.transition()
            .delay(Math.random() * 2000) // Random delay for each drop
            .duration(2000)
            .attr("transform", `translate(0, 50)`) // Move drop downwards
            .attr("opacity", 1) // Make drop visible
            .remove(); // Remove drop at the end of the animation
    }


 // Add labels beneath the tanks
 svg.append("text")
 .attr("x", tank1X + tankWidth / 2)
 .attr("y", tankY + tankHeight + 20)
 .attr("class", "tank-label")
 .text("Israel: 80% Water Intake");

svg.append("text")
 .attr("x", tank2X + tankWidth / 2)
 .attr("y", tankY + tankHeight + 20)
 .attr("class", "tank-label")
 .text("Palestine: 20% Water Intake");


     // Add labels above the river
     const riverLabels = svg.append("g")
     .attr("class", "river-labels");

 riverLabels.append("text")
     .attr("x", riverWidth / 2)
     .attr("y", riverY + 140) // Adjust for position above the river
     .attr("class", "river-label")
     .text("West Bank Mountain Aquifer");
    // Cloud groups to contain multiple circles for each cloud
    const cloudGroup = svg.append("g");
    cloudGroup.append("circle")
    .attr("cx", 390)
    .attr("cy", 80)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 470)
    .attr("cy", 80)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 445)
    .attr("cy", 70)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 445)
    .attr("cy", 90)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 415)
    .attr("cy", 70)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 415)
    .attr("cy", 80)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 610)
    .attr("cy", 40)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 690)
    .attr("cy", 40)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 665)
    .attr("cy", 30)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 665)
    .attr("cy", 50)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 635)
    .attr("cy", 30)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 635)
    .attr("cy", 50)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 160)
    .attr("cy", 40)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 80)
    .attr("cy", 40)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 105)
    .attr("cy", 30)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 105)
    .attr("cy", 50)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 135)
    .attr("cy", 30)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 135)
    .attr("cy", 50)
    .attr("r", 20)
    .attr("class", "cloud");

    cloudGroup.append("circle")
    .attr("cx", 415)
    .attr("cy", 100)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 910)
    .attr("cy", 80)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 990)
    .attr("cy", 80)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 965)
    .attr("cy", 70)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 965)
    .attr("cy", 90)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 935)
    .attr("cy", 70)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 935)
    .attr("cy", 90)
    .attr("r", 20)
    .attr("class", "cloud");


    cloudGroup.append("circle")
    .attr("cx", 910)
    .attr("cy", 80)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 990)
    .attr("cy", 80)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 965)
    .attr("cy", 70)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 965)
    .attr("cy", 90)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 935)
    .attr("cy", 70)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 935)
    .attr("cy", 90)
    .attr("r", 20)
    .attr("class", "cloud");


    cloudGroup.append("circle")
    .attr("cx", 1110)
    .attr("cy", 40)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 1190)
    .attr("cy", 40)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 1165)
    .attr("cy", 30)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 1165)
    .attr("cy", 50)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 1135)
    .attr("cy", 30)
    .attr("r", 20)
    .attr("class", "cloud");

cloudGroup.append("circle")
    .attr("cx", 1135)
    .attr("cy", 50)
    .attr("r", 20)
    .attr("class", "cloud");


    // Start animations when the window loads
    //window.onload = startAnimations;

  }, []);

  return <div className="before-war-chart">
  <h1 className="chart-title">Water Intake from the West Bank Aquifer </h1>
  <svg ref={svgRef} width="1400" height="625"></svg>
  <button onClick={() => startAnimationsRef.current()}>Water Intake</button>
</div>
};

export default BeforeWarChart;