import color from "color";
import {black, white, pinkA400, jaune} from "./colors";
import configureFonts from "./fonts";

import {Theme} from "./types";

const DefaultTheme: Theme = {
  dark: false,
  roundness: 4,
  colors: {
    primary: jaune,
    accent: "#03dac4",
    background: "#f6f6f6",
    surface: white,
    error: "#B00020",
    text: jaune,
    onBackground: "#000000",
    onSurface: "#000000",
    disabled: color(black)
      .alpha(0.26)
      .rgb()
      .string(),
    placeholder: color(black)
      .alpha(0.54)
      .rgb()
      .string(),
    backdrop: color(black)
      .alpha(0.5)
      .rgb()
      .string(),
    notification: pinkA400
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0
  }
};

export default DefaultTheme;
