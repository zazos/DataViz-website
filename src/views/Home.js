import React from "react";
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import "../assets/css/home.css"; // Import the custom CSS file with unique names

function Home() {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="custom-content">
        <div className="custom-home-header">
          Visualizing the Humanitarian Crisis in Palestine
        </div>
      </div>
      <Row className="content-row">
        <Col md="6" sm="12">
          <Card className="abstract-card">
            <CardHeader>
              <CardTitle tag="h2" style={{ color: "#007bff", fontWeight: "bold" }}>
                Abstract
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p>
                Our website is dedicated to providing insightful data visualizations on the Palestinian conflicts and humanitarian crisis from October 2023 to April 2024.
              </p>
              <p>
                Focusing on the Gaza Strip and West Bank, we present detailed visualizations of conflict-related events and fatalities,
                analyze commodity prices in Palestine compared to Europe, and highlight critical water quality and availability issues.
              </p>
              <p>
                Through interactive maps, time-series charts, and comparative infographics, we aim to offer a clear, unbiased depiction of these pressing issues,
                fostering a deeper understanding and encouraging informed dialogue and action.
              </p>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" sm="12">
          <Card className="video-card">
            <CardBody>
              <iframe
                width="100%"
                height="320"
                src="https://www.youtube.com/embed/vfnIxu-WC4U"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="content-row">
        <Col md="6" sm="12">
          <Card className="target-audience-card">
            <CardHeader>
              <CardTitle tag="h2" style={{ color: "#007bff", fontWeight: "bold" }}>Target Audience</CardTitle>
            </CardHeader>
            <CardBody>
              <p>
                <span className="icon">🌍</span> <strong>General Public:</strong> Individuals of all ages who may not typically engage with this issue but can benefit from accessible, engaging content.
              </p>
              <p>
                <span className="icon">⏳</span> <strong>Busy Individuals:</strong> Those who may lack time or energy to delve deeply into the subject but can benefit from visually pleasing, easy-to-digest information.
              </p>
              <p>
                <span className="icon">💡</span> <strong>Detached Society Members:</strong> People who may have the resources to help but are often detached from global humanitarian issues. Our goal is to reconnect them with the human side of the story.
              </p>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" sm="12">
          <Card className="reasons-card">
            <CardHeader>
              <CardTitle tag="h2" style={{ color: "#007bff", fontWeight: "bold" }}>Rationale Behind Our Focus</CardTitle>
            </CardHeader>
            <CardBody>
              <p>
                <span className="icon">🚫</span> <strong>Neglect:</strong> Addresses the tendency of societies to overlook such crises due to distance, disinterest, or numbness.
              </p>
              <p>
                <span className="icon">📅</span> <strong>Relevance:</strong> Focuses on up-to-date, real-world problems that are often ignored.
              </p>
              <p>
                <span className="icon">🌟</span> <strong>Impact:</strong> Highlights the ongoing humanitarian crisis, aiming to inform and invoke action.
              </p>
              <p>
                <span className="icon">❤️</span> <strong>Empathy and Action:</strong> By presenting real data in an engaging format, we hope to bridge the gap between awareness and empathy.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="content-row">
        <Col md="12" sm="12">
          <div className="logos-section">
            <span>Visualizations made with</span>
            <img src="https://raw.githubusercontent.com/d3/d3-logo/master/d3.png" alt="D3.js" className="logo" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Python_logo_01.svg/2048px-Python_logo_01.svg.png" alt="Python" className="logo" />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Home;
