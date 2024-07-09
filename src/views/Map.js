import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as d3 from 'd3';
import { Row, Col, Card, CardBody, Button, ButtonGroup, CardTitle } from 'reactstrap';
import EventsFatalities from '../sorted_aggregated_events_fatalities_per_year_with_coordinates.csv';
import '../assets/css/map.css'; // Import the new CSS file

const MapWrapper = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [years, setYears] = useState([]);
  const [data, setData] = useState([]);
  const mapRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([31.7767, 35.2333], 8);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.carto.com/attributions">CARTO</a>'
      }).addTo(mapRef.current);

      fetch('/palestine.geo.json')
        .then(response => response.json())
        .then(geojson => {
          L.geoJSON(geojson).addTo(mapRef.current);
        })
        .catch(error => {
          console.error('Error loading GeoJSON file:', error);
        });
    }

    d3.csv(EventsFatalities)
      .then(data => {
        const years = Array.from(new Set(data.map(d => d.Year))).sort();
        setYears(years);
        setData(data);
        setSelectedYear(years[0]);
      })
      .catch(error => {
        console.error('Error loading CSV file:', error);
      });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (selectedYear && data.length > 0) {
      updateVisualizations(selectedYear, data);
    }
  }, [selectedYear, data]);

  const updateVisualizations = (selectedYear, data) => {
    const yearData = data.filter(d => d.Year === selectedYear);
    updateBarChart(yearData);
    updateMap(yearData);
  };

  const updateBarChart = (yearData) => {
    const barSvg = d3.select('#barChart'),
      barMargin = { top: 20, right: 20, bottom: 100, left: 40 },
      barWidth = +barSvg.attr('width') - barMargin.left - barMargin.right,
      barHeight = +barSvg.attr('height') - barMargin.top - barMargin.bottom;

    barSvg.selectAll('*').remove();

    const barG = barSvg.append('g').attr('transform', `translate(${barMargin.left},${barMargin.top})`);

    const x0 = d3.scaleBand().rangeRound([0, barWidth]).padding(0.1),
      x1 = d3.scaleBand().padding(0.05),
      y = d3.scaleLinear().rangeRound([barHeight, 0]);

    const regions = yearData.map(d => d.Region);
    const categories = ['Events', 'Fatalities'];

    x0.domain(regions);
    x1.domain(categories).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(yearData, d => Math.max(d.Events, d.Fatalities))]);

    barG
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${barHeight})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .style('text-anchor', 'end')
      .style('fill', 'white')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    barG.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(10))
      .selectAll('text')
      .style('fill', 'white');

    const region = barG
      .selectAll('.region')
      .data(yearData)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${x0(d.Region)},0)`);

    region
      .selectAll('rect')
      .data(d => categories.map(key => ({ key, value: d[key] })))
      .enter()
      .append('rect')
      .attr('x', d => x1(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => barHeight - y(d.value))
      .attr('fill', d => (d.key === 'Events' ? 'rgba(244, 204, 66, 0.7)' : 'rgb(139, 0, 0)'));

    const legend = barG
      .selectAll('.legend')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    legend
      .append('rect')
      .attr('x', barWidth - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', d => (d === 'Events' ? 'rgba(244, 204, 66, 0.7)' : 'rgb(139, 0, 0)'));

    legend
      .append('text')
      .attr('x', barWidth - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .style('fill', 'white')
      .text(d => d);
  };

  const updateMap = (yearData) => {
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();
    } else {
      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    const colorScale = d3.scaleThreshold().domain([1, 10, 20, 50]).range(['green', '#f7dc6f', '#f39c12', '#e74c3c', '#c0392b']);

    yearData.forEach(d => {
      L.circleMarker([d.latitude, d.longitude], {
        radius: 5,
        fillColor: colorScale(d.Fatalities),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(layerGroupRef.current)
        .bindPopup(`${d.Region}<br>Events: ${d.Events}<br>Fatalities: ${d.Fatalities}`);
    });

    const legend = d3.select('#legend')
      .html("")
      .append('svg')
      .attr('width', 180)
      .attr('height', 120)
      .selectAll('g')
      .data(colorScale.range().map(d => {
        const r = colorScale.invertExtent(d);
        if (!r[0]) r[0] = 0;
        return r;
      }))
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', d => colorScale(d[0]));

    legend.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('fill', 'white')
      .text(d => {
        if (d[0] === 0) return '0 deaths';
        if (d[1] > 50) return '50+ deaths';
        return `${d[0]}-${d[1]} deaths`;
      });
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <CardTitle tag="h2" className="map-title">Events and Fatalities Map</CardTitle>
          <h5 className="card-category" style={{ marginTop: '10px' }}>source: <a href="https://data.humdata.org/group/pse">Humdata</a></h5>
        </div>
        <ButtonGroup className="btn-group-toggle" data-toggle="buttons">
          {years.map((year) => (
            <Button
              key={year}
              tag="label"
              className={`btn-simple ${selectedYear === year ? 'active' : ''}`}
              color="info"
              size="sm"
              onClick={() => handleYearChange(year)}
            >
              {year}
            </Button>
            ))}
        </ButtonGroup>
      </div>
      <div id="chart-container" style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div id="map" style={{ height: '600px', width: '600px', marginRight: '20px' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <svg id="barChart" width="600" height="400"></svg>
          <div id="legend" style={{ marginTop: '100px' }}></div>
        </div>
      </div>
      <p className="map-paragraph" style={{ textAlign: 'center', marginTop: '20px' }}>Click on the dots on the map to see the events and fatalities for each region.</p>
    </div>
  );
};

const InfoCard = () => (
  <Card className="map-card">
    <CardBody>
      <CardTitle tag="h2" className="map-title">History of Attacks</CardTitle>
      <h5 className="card-category" style={{ marginTop: '10px' }}>source: <a href="https://www.history.com/topics/middle-east/palestine">History</a></h5>
      <ul className="map-paragraph">
        <li><strong>2016:</strong> A wave of violence marked by individual stabbings, shootings, and car-ramming attacks, mostly carried out by young Palestinians. This period is often referred to as the "Knife Intifada" or "Jerusalem Intifada".</li>
        <li><strong>2018:</strong> Starting in March, weekly protests known as the "Great March of Return" were held along the Gaza-Israel border. These protests often turned violent, with Israeli forces using live ammunition against protesters, resulting in numerous casualties.</li>
        <li><strong>2021:</strong> An 11-day conflict in May between Israel and Hamas, triggered by tensions in Jerusalem, particularly around the Al-Aqsa Mosque and eviction threats in Sheikh Jarrah. This conflict saw extensive rocket fire from Gaza and Israeli airstrikes, leading to a significant number of casualties on both sides.</li>
        <li><strong>2022:</strong> In August, over 1,000 rockets were fired at Israel by Palestinian Islamic Jihad during a three-day conflict. This operation included the targeted killing of PIJ commander Tayseer al-Jabari and ended with a ceasefire. Hamas did not participate in this conflict.</li>
        <li><strong>2023:</strong> On October 7, Hamas launched a large-scale attack involving rockets and ground incursions into Israeli territory. This attack led to significant Israeli military responses, marking one of the deadliest escalations in recent years.</li>
        <li><strong>2024:</strong> Hostilities have persisted into 2024, with various skirmishes and military operations continuing between Israeli forces and Palestinian groups, contributing to ongoing instability and violence in the region.</li>
      </ul>
    </CardBody>
  </Card>
);

function Map() {
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="map-card">
              <CardBody>
                <MapWrapper />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <InfoCard />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Map;
