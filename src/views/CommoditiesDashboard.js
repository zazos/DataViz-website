import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';
import RaceBarChart from '../components/RaceBarChart.js';
import ComparisonBarChart from '../components/ComparisonBarChart.js';
import commodityPrices from '../commodity-prices.csv';
import europeanCommodityPrices from '../european-commodity-prices.csv';

function CommoditiesDashboard(props) {
  const [bigChartData, setBigChartData] = useState('data1');
  const [selectedMonth, setSelectedMonth] = useState('Sep-23');

  const setBgChartData = (name) => {
    setBigChartData(name);
  };

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
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Race Bar Chart</h5>
                    <CardTitle tag="h2">Commodity Prices Over Time</CardTitle>
                  </Col>
                  <Col sm="6" style={{ position: 'relative' }}>
                    <ButtonGroup className="btn-group-toggle float-right" data-toggle="buttons">
                      <Button tag="label" className="btn-simple" color="info" id="play" size="lg">
                        <span className="d-none d-lg-block d-md-block d-lg-block d-xl-block">Play</span>
                        <span className="d-block d-lg-none">
                          <i className="tim-icons icon-triangle-right-17" />
                        </span>
                      </Button>
                      <Button color="info" id="pause" size="lg" tag="label" className="btn-simple">
                        <span className="d-none d-lg-block d-md-block d-lg-block d-xl-block">Pause</span>
                        <span className="d-block d-lg-none">
                          <i className="tim-icons icon-square" />
                        </span>
                      </Button>
                      <Button color="info" id="reset" size="lg" tag="label" className="btn-simple">
                        <span className="d-none d-lg-block d-md-block d-lg-block d-xl-block">Reset</span>
                        <span className="d-block d-lg-none">
                          <i className="tim-icons icon-refresh-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                    <input type="range" id="slider" min="0" max="7" step="1" defaultValue="0" />
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <RaceBarChart csvFilePath={commodityPrices} conversionRate={0.27} />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Comparison Bar Chart</h5>
                    <CardTitle tag="h2">Commodity Prices: Europe vs Palestine</CardTitle>
                  </Col>
                  <Col sm="6" style={{ position: 'relative' }}>
                    <ButtonGroup className="btn-group-toggle float-right" data-toggle="buttons">
                      {['Sep-23', 'Oct-23', 'Nov-23', 'Dec-23', 'Jan-24', 'Feb-24', 'Mar-24', 'Apr-24'].map((month) => (
                        <Button
                          key={month}
                          tag="label"
                          className={`btn-simple ${selectedMonth === month ? 'active' : ''}`}
                          color="info"
                          size="sm"
                          onClick={() => handleMonthChange(month)}
                        >
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">{month}</span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-calendar-60" />
                          </span>
                        </Button>
                      ))}
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <ComparisonBarChart
                  palestineCsvFilePath={commodityPrices}
                  europeanCsvFilePath={europeanCommodityPrices}
                  conversionRate={0.27}
                  selectedMonth={selectedMonth}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CommoditiesDashboard;
