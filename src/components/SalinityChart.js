import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const SalinityChart = () => {
  const [plotData, setPlotData] = useState(null);
  const [plotLayout, setPlotLayout] = useState(null);

  useEffect(() => {
    axios.get('https://dataviz-website-restless-sound-977.fly.dev/plot')
      .then(response => {
        console.log('Plot data received:', response.data);
        const fig = JSON.parse(response.data);
        setPlotData(fig.data);
        setPlotLayout(fig.layout);
      })
      .catch(error => {
        console.error('Error fetching plot:', error);
      });
  }, []);

  return (
    <div>
      {plotData && plotLayout ? (
        <Plot
          data={plotData}
          layout={plotLayout}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SalinityChart;
