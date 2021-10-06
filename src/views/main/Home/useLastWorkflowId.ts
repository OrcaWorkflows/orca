import { useState, useEffect } from "react";

function getWorkflowID(username: string | undefined) {
	return JSON.parse(
		localStorage.getItem(username + "-" + "lastVisitedWorkflowID") as string
	);
}

const useLastWorkflowID = (username: string | undefined): string => {
	const [lastWorkflowID, setLastworkflowID] = useState(getWorkflowID(username));

	useEffect(() => {
		setLastworkflowID(getWorkflowID(username));

		const handleChangeStorage = () => {
			setLastworkflowID(getWorkflowID(username));
		};
		window.addEventListener("storage", () => handleChangeStorage);
		return () =>
			window.removeEventListener("storage", () => handleChangeStorage);
	}, [username]);

	return lastWorkflowID;
};

export default useLastWorkflowID;
