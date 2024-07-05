import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';
import RaceBarChart from '../components/RaceBarChart.js';
import ComparisonBarChart from '../components/ComparisonBarChart.js';
import SalinityChart from '../components/SalinityChart';
import WaterTankChart from '../components/WaterTankChart';
import WaterAvailabilityGazaChart from '../components/WaterAvailabilityGazaChart';
import WaterAvailabilityWorldChart from '../components/WaterAvailabilityWorldChart';
import commodityPrices from '../commodity-prices.csv';
import europeanCommodityPrices from '../european-commodity-prices.csv';

function WaterDashboard(props) {
  const [selectedMonth, setSelectedMonth] = useState('Sep-23');

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h2">Salinity Chart</CardTitle>
              </CardHeader>
              <CardBody>
                <SalinityChart />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h2">Water Tank Chart</CardTitle>
              </CardHeader>
              <CardBody>
                <WaterTankChart />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h2">Water Availability in Gaza</CardTitle>
              </CardHeader>
              <CardBody>
                <WaterAvailabilityGazaChart />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h2">Water Availability in Different Regions</CardTitle>
              </CardHeader>
              <CardBody>
                <WaterAvailabilityWorldChart />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default WaterDashboard;
