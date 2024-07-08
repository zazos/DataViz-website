import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';
import RaceBarChart from '../components/RaceBarChart.js';
import ComparisonBarChart from '../components/ComparisonBarChart.js';
import commodityPrices from '../commodity-prices.csv';
import europeanCommodityPrices from '../european-commodity-prices.csv';
import '../assets/css/event-section-commodities.css';

function CommoditiesDashboard(props) {
  const [raceMonth, setRaceMonth] = useState('Sep-23');
  const [comparisonMonth, setComparisonMonth] = useState('Sep-23');
  const [visibleSections, setVisibleSections] = useState([]);
  const [isSecondColumnVisible, setIsSecondColumnVisible] = useState(false);

  const handleRaceMonthChange = (month) => {
    setRaceMonth(month);
  };

  const handleComparisonMonthChange = (month) => {
    setComparisonMonth(month);
  };

  useEffect(() => {
    const eventSections = [
      "Initial Attacks (7 October – 27 October 2023)",
      "Invasion of the Gaza Strip (28 October – 23 November 2023)",
      "First Ceasefire (24 November 2023 – 11 January 2024)",
      "Yemen Airstrikes (12 January 2024 – 6 May 2024)",
      "Rafah Offensive (7 May 2024 – Present)"
    ];

    eventSections.forEach((_, index) => {
      setTimeout(() => {
        setVisibleSections(prev => [...prev, index]);
      }, index * 1000); // delay each section by 1 second
    });

    setTimeout(() => {
      setIsSecondColumnVisible(true);
    }, 3000); // show the second column after 3000ms
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <CardTitle tag="h2">Commodity Prices Over Time</CardTitle>
                    <h5 className="card-category">sources: <a href="https://data.humdata.org/group/pse">Humdata</a></h5>
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
                    <input type="range" id="slider" min="0" max="7" step="1" value={['Sep-23', 'Oct-23', 'Nov-23', 'Dec-23', 'Jan-24', 'Feb-24', 'Mar-24', 'Apr-24'].indexOf(raceMonth)} onChange={(e) => handleRaceMonthChange(['Sep-23', 'Oct-23', 'Nov-23', 'Dec-23', 'Jan-24', 'Feb-24', 'Mar-24', 'Apr-24'][e.target.value])} />
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <RaceBarChart csvFilePath={commodityPrices} conversionRate={0.27} currentMonth={raceMonth} onMonthChange={handleRaceMonthChange} />
                <p className="text-muted" style={{ width: '1820px', margin: '0 auto', textAlign: 'center' }}>*Prices are converted to USD for comparison</p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h2">The 7-Month-Timeline</CardTitle>
                <h5 className="card-category">sources:
                  <a href="https://en.wikipedia.org/wiki/Timeline_of_the_Israel%E2%80%93Hamas_war"> Wikipedia</a>,
                  <a href="https://www.dw.com/en/escalation-in-the-middle-east-israel-hamas-war-chronology/a-67361568"> DW</a>,
                  <a href="https://www.britannica.com/event/Israel-Hamas-War"> Britannica</a>
                </h5>
              </CardHeader>
              <CardBody className="commodities-dashboard">
                {visibleSections.includes(0) && (
                  <div className="event-section">
                    <h3>Initial Attacks (7 October – 27 October 2023)</h3>
                    <p><strong>Event Overview:</strong> The conflict began on October 7, 2023, when Hamas launched a large-scale, coordinated assault on Israel, marking a severe escalation in hostilities. Israel responded with "Operation Iron Swords," targeting Gaza with airstrikes and cutting off food, water, and electricity supplies to the region.</p>
                    <p><strong>Commodity Impact:</strong> The immediate disruption caused by these attacks led to a sharp increase in travel expenses and fuel prices, reflecting the beginning of supply chain issues.</p>
                  </div>
                )}
                {visibleSections.includes(1) && (
                  <div className="event-section">
                    <h3>Invasion of the Gaza Strip (28 October – 23 November 2023)</h3>
                    <p><strong>Event Overview:</strong> Israel initiated a ground invasion of Gaza, further intensifying the conflict. Significant events included Israeli airstrikes on schools and hospitals, heavy fighting in urban areas, and the destruction of critical infrastructure​.</p>
                    <p><strong>Commodity Impact:</strong> During this period, gas prices soared to $102.60 in November, and flour prices rose sharply, indicating severe disruptions in fuel and food supply chains.</p>
                  </div>
                )}
                {visibleSections.includes(2) && (
                  <div className="event-section">
                    <h3>First Ceasefire (24 November 2023 – 11 January 2024)</h3>
                    <p><strong>Event Overview:</strong> A ceasefire was declared, offering a brief respite from the conflict. However, the humanitarian situation remained dire with ongoing shortages and limited aid reaching Gaza​.</p>
                    <p><strong>Commodity Impact:</strong> Despite the ceasefire, prices for essentials like flour remained extremely high ($222.75 in December), showing that the supply chain issues were far from resolved.</p>
                  </div>
                )}
                {visibleSections.includes(3) && (
                  <div className="event-section">
                    <h3>Yemen Airstrikes (12 January 2024 – 6 May 2024)</h3>
                    <p><strong>Event Overview:</strong> The conflict expanded with airstrikes in Yemen, reflecting a broader regional impact and involvement of multiple actors including Iran-backed groups. This period saw continued fighting and significant humanitarian challenges in Gaza.</p>
                    <p><strong>Commodity Impact:</strong> January saw flour prices peak at $276.75, and sugar prices also increased substantially, reflecting ongoing and worsening shortages of basic commodities.</p>
                  </div>
                )}
                {visibleSections.includes(4) && (
                  <div className="event-section">
                    <h3>Rafah Offensive (7 May 2024 – Present)</h3>
                    <p><strong>Event Overview:</strong> The conflict saw a new phase with the Rafah offensive, focusing on strategic locations and involving intense fighting. This period is characterized by attempts to control key entry points and routes in and out of Gaza. </p>
                    <p><strong>Commodity Impact:</strong> By February and March, prices for cigarettes and fuel saw significant increases (e.g., gasoline $37.35 in February, $47.25 in March), and staple food prices like flour and sugar remained high. This phase indicates the extended impact on both luxury and essential goods due to sustained conflict and blockades.</p>
                  </div>
                )}
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
                    <CardTitle tag="h2">Commodity Prices: Europe vs Palestine</CardTitle>
                    <h5 className="card-category">sources:
                      <a href="https://www.numbeo.com/cost-of-living/country_price_rankings?itemId=17&region=150&displayCurrency=EUR"> Numbeo</a>,
                      <a href="https://www.brusselstimes.com/787140/cigarettes-to-cost-twice-as-much-in-belgium-as-in-luxembourg-next-year"> BrusselsTimes</a>,
                      <a href="https://worldpopulationreview.com/country-rankings/bottled-water-cost-by-country"> WorldPopulationReview</a>,
                      <a href="https://www.selinawamucii.com/insights/prices/france/mineral-water/"> SelinaWamucii</a>,
                      <a href="https://www.globalproductprices.com/USA/flour_prices/"> GlobalProductPrices</a>,
                      <a href="https://www.tolls.eu/fuel-prices"> TollsEU</a>
                    </h5>
                  </Col>
                  <Col sm="6" style={{ position: 'relative' }}>
                    <ButtonGroup className="btn-group-toggle float-right" data-toggle="buttons">
                      {['Sep-23', 'Oct-23', 'Nov-23', 'Dec-23', 'Jan-24', 'Feb-24', 'Mar-24', 'Apr-24'].map((month) => (
                        <Button
                          key={month}
                          tag="label"
                          className={`btn-simple ${comparisonMonth === month ? 'active' : ''}`}
                          color="info"
                          size="sm"
                          onClick={() => handleComparisonMonthChange(month)}
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
                  selectedMonth={comparisonMonth}
                />
                <p className="text-muted" style={{ width: '1820px', margin: '0 auto', textAlign: 'center' }}>*Prices are converted to USD for comparison</p>
                <p className="text-muted" style={{ width: '1585px', margin: '0 auto', textAlign: 'center' }}>**European data has been averaged by many European Countries (2022-2024)</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CommoditiesDashboard;
