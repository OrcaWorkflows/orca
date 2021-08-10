import { useState, useEffect } from "react";

function getCanvasId() {
	return JSON.parse(localStorage.getItem("lastCanvasId") as string);
}

const useLastCanvasId = (): string => {
	const [lastCanvasId, setLastCanvasId] = useState(getCanvasId());

	useEffect(() => {
		const handleChangeStorage = () => {
			setLastCanvasId(getCanvasId());
		};

		window.addEventListener("storage", () => handleChangeStorage);
		return () =>
			window.removeEventListener("storage", () => handleChangeStorage);
	}, []);

	return lastCanvasId;
};

export default useLastCanvasId;
