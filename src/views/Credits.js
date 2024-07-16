import React from "react";
import { Helmet } from 'react-helmet';
import "../assets/css/credits.css";
import { Card, CardBody, Row, Col } from "reactstrap";

const linkedInLogo = "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png";

function Credits() {
  return (
    <>
      <Helmet>
        <title>Credits</title>
      </Helmet>
      <div className="custom-content">
        <div className="custom-image-text">
          #FreePalestine
        </div>
      </div>
      <div className="content">
        <Row className="justify-content-center mb-4">
          <Col lg="8" md="10" sm="12" className="text-center">
            <h2 className="our-team-title" style={{ color: "#007bff", fontWeight: "bold" }}>Our Team</h2>
          </Col>
        </Row>
        <Row>
          <Col lg="4" md="6" sm="12">
            <Card className="team-card-chart">
              <CardBody className="team-card-body text-center">
                <div className="image-wrapper">
                  <img src={require("../assets/img/athina-vekraki.jpeg")} alt="Athina Vekraki" className="team-img" />
                </div>
                <h5 className="team-card-title">Athina Vekraki</h5>
                <a href="https://www.linkedin.com/in/athina-vekraki-9ba6b4208/" target="_blank" rel="noopener noreferrer">
                  <img src={linkedInLogo} alt="LinkedIn Profile" className="img-fluid linkedin-logo" />
                </a>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" md="6" sm="12">
            <Card className="team-card-chart">
              <CardBody className="team-card-body text-center">
                <div className="image-wrapper">
                  <img src={require("../assets/img/eleni-kartsonaki.jpeg")} alt="Eleni Kartsonaki" className="team-img" />
                </div>
                <h5 className="team-card-title">Eleni Kartsonaki</h5>
                <a href="https://www.linkedin.com/in/eleni-kartsonaki-105170299/" target="_blank" rel="noopener noreferrer">
                  <img src={linkedInLogo} alt="LinkedIn Profile" className="img-fluid linkedin-logo" />
                </a>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4" md="6" sm="12">
            <Card className="team-card-chart">
              <CardBody className="team-card-body text-center">
                <div className="image-wrapper">
                  <img src={require("../assets/img/panagiotis-zazos.jpeg")} alt="Panagiotis Zazos" className="team-img" />
                </div>
                <h5 className="team-card-title">Panagiotis Zazos</h5>
                <a href="https://www.linkedin.com/in/panagiotis-zazos-ba1a02188/" target="_blank" rel="noopener noreferrer">
                  <img src={linkedInLogo} alt="LinkedIn Profile" className="img-fluid linkedin-logo" />
                </a>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center mb-4">
          <Col lg="8" md="10" sm="12" className="text-center">
            <h2 className="our-team-title" style={{ color: "#007bff", fontWeight: "bold" }}>Course Consultant</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg="4" md="6" sm="12" className="mx-auto">
            <Card className="team-card-chart">
              <CardBody className="team-card-body text-center">
                <div className="image-wrapper">
                  <img src={require("../assets/img/maria-rousou.jpg")} alt="Maria Rousou" className="team-img" />
                </div>
                <h5 className="team-card-title">Maria Rousou</h5>
                <a href="https://www.linkedin.com/in/mariaroussou/?original_referer=https%3A%2F%2Fwww%2Egoogle%2Ecom%2F&originalSubdomain=gr" target="_blank" rel="noopener noreferrer">
                  <img src={linkedInLogo} alt="LinkedIn Profile" className="img-fluid linkedin-logo" />
                </a>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Credits;
