import { useRef, useEffect, DependencyList } from "react";

const useUpdateEffect = (effect: () => void, deps: DependencyList): void => {
	const isFirstMount = useRef(true);
	useEffect(() => {
		if (!isFirstMount.current) effect();
		else isFirstMount.current = false;
	}, deps);
};

export default useUpdateEffect;
