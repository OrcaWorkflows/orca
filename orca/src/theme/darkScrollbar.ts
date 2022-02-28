// track, thumb and active are derieved from macOS 10.15.7
const scrollBar = {
	track: "#575555",
	thumb: "#696666",
	active: "#bdbdbd",
};

export default function darkScrollbar(options = scrollBar): any {
	return {
		scrollbarColor: `${options.thumb} ${options.track}`,
		"&::-webkit-scrollbar, & *::-webkit-scrollbar": {
			backgroundColor: options.track,
		},
		"&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
			borderRadius: 8,
			backgroundColor: options.thumb,
			minHeight: 24,
			border: `3px solid ${options.track}`,
		},
		"&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
			backgroundColor: options.active,
		},
		"&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
			backgroundColor: options.active,
		},
		"&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
			backgroundColor: options.active,
		},
		"&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
			backgroundColor: options.track,
		},
	};
}
