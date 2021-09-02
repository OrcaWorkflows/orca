import { useState, useEffect } from "react";

function getWorkflowID() {
	return JSON.parse(localStorage.getItem("lastWorkflowID") as string);
}

const useLastWorkflowID = (): string => {
	const [lastWorkflowID, setLastworkflowID] = useState(getWorkflowID());

	useEffect(() => {
		const handleChangeStorage = () => {
			setLastworkflowID(getWorkflowID());
		};

		window.addEventListener("storage", () => handleChangeStorage);
		return () =>
			window.removeEventListener("storage", () => handleChangeStorage);
	}, []);

	return lastWorkflowID;
};

export default useLastWorkflowID;
