import { createTheme, ThemeOptions } from "@material-ui/core";

import overrides from "./overrides";
import palette from "./palette";
import props from "./props";

const baseTheme: ThemeOptions = {
	typography: {
		fontFamily: "Nunito",
	},
	palette,
	overrides,
	props,
};

const theme = createTheme(baseTheme);

export default theme;
