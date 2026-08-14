import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "white",
      options: {
        // Neutrals / Base Canvas
        white: { name: "White (Neutral 50)", value: "#ffffff" },
        offWhite: { name: "Off-White", value: "#FAF9F6" },
        light: { name: "Light (Neutral 100)", value: "#f2f2f2" },
        neutral200: { name: "Neutral 200", value: "#e6e6e6" },
        neutral700: { name: "Neutral 700", value: "#333333" },
        dark: { name: "Dark (Neutral 800)", value: "#1a1a1a" },
        black: { name: "Black (Neutral 900)", value: "#000000" },

        // Primary Green Scale
        primaryGreen50: { name: "Primary Green 50", value: "#dbf9ea" },
        primaryGreen100: { name: "Primary Green 100", value: "#008f47" },
        primaryGreen200: { name: "Primary Green 200", value: "#006633" },
        primaryGreen300: { name: "Primary Green 300", value: "#003d1f" },

        // Secondary Green Scale
        secondaryGreen100: { name: "Secondary Green 100", value: "#4bc445" },

        // Blue Scale
        blue50: { name: "Blue 50", value: "#eef3fc" },
        blue200: { name: "Blue 200", value: "#2f63c0" },
        blue400: { name: "Blue 400", value: "#174290" },

        // Status Backgrounds
        statusInfoBg: { name: "Status Info 100", value: "#d4e7fc" },
        statusWarningBg: { name: "Status Warning 100", value: "#ffeab4" },
        statusErrorBg: { name: "Status Error 100", value: "#ff8f8a" },
        statusSuccessBg: { name: "Status Success 100", value: "#75dca8" },

        // Light Accent Surfaces
        accentPurpleLight: { name: "Accent Purple Light", value: "#eae7ff" },
        accentPinkLight: { name: "Accent Pink Light", value: "#fad5f2" },
        accentOrangeLight: { name: "Accent Orange Light", value: "#ffe7ce" },
        accentYellowLight: { name: "Accent Yellow Light", value: "#feeecf" },
      },
    },
  },
};

export default preview;
