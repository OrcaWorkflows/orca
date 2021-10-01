import { createTheme, ThemeOptions } from "@material-ui/core";

import darkScrollbar from "./darkScrollbar";
import overrides from "./overrides";
import palette from "./palette";
import props from "./props";

const baseTheme: ThemeOptions = {
	typography: {
		fontFamily: "Nunito",
	},
	palette,
	overrides: {
		...overrides,
		MuiCssBaseline: { "@global": { body: darkScrollbar() } },
	},
	props,
};

const theme = createTheme(baseTheme);

export default theme;
