/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Map from "views/Map.js";
import Home from "views/Home.js";
import CommoditiesDashboard from "views/CommoditiesDashboard.js";
import WaterDashboard from "views/WaterDashboard";
import Credits from "views/Credits";

var routes = [
  {
    path: "/home",
    name: "Home",
    icon: "tim-icons icon-align-center",
    component: <Home />,
    layout: "/admin",
  },
  {
    path: "/map",
    name: "Map",
    icon: "tim-icons icon-pin",
    component: <Map />,
    layout: "/admin",
  },
  {
    path: "/commodities",
    name: "Commodities",
    icon: "tim-icons icon-chart-pie-36",
    component: <CommoditiesDashboard />,
    layout: "/admin",
  },
  {
    path: "/water",
    name: "Water",
    icon: "tim-icons icon-chart-pie-36",
    component: <WaterDashboard />,
    layout: "/admin",
  },
  {
    path: "/credits",
    name: "Credits",
    icon: "tim-icons icon-align-center",
    component: <Credits />,
    layout: "/admin",
  }
];
export default routes;
