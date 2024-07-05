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
import Dashboard from "views/Dashboard.js";
import Map from "views/Map.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import CommoditiesDashboard from "views/CommoditiesDashboard.js";
import WaterDashboard from "views/WaterDashboard";

var routes = [
  {
    path: "/typography",
    name: "Home",
    icon: "tim-icons icon-align-center",
    component: <Typography />,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
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
    path: "/tables",
    name: "Table List",
    icon: "tim-icons icon-puzzle-10",
    component: <TableList />,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Credits",
    icon: "tim-icons icon-align-center",
    component: <Typography />,
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
  }
];
export default routes;
