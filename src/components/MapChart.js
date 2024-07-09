import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const MapChart = () => {
  const [plotData, setPlotData] = useState(null);
  const [plotLayout, setPlotLayout] = useState(null);
  const [plotFrames, setPlotFrames] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/map_plot')
      .then(response => {
        console.log('Plot data received:', response.data);
        const fig = JSON.parse(response.data);
        setPlotData(fig.data);
        setPlotLayout(fig.layout);
        setPlotFrames(fig.frames);
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
          frames={plotFrames}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MapChart;
