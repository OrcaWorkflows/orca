import palette from "../palette";

const MuiTabs = {
	indicator: {
		display: "flex",
		justifyContent: "center",
		backgroundColor: "transparent",
		"& > div": {
			maxWidth: 72,
			marginTop: -8,
			width: "100%",
			backgroundColor: palette.primary.main,
		},
	},
};

export default MuiTabs;
