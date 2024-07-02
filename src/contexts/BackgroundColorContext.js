import { createContext } from "react";

export const backgroundColors = {
  primary: "primary",
  red: "red",
  green: "green",
};

export const BackgroundColorContext = createContext({
  color: backgroundColors.blue,
  changeColor: (color) => {},
});
