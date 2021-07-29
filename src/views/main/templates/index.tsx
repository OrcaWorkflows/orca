import SideHeader from "../navigation/sideheader";
import "./templates.css";

export const Templates = () => {
	return (
		<div className={"templates-root"}>
			<SideHeader />
			<div className={"templates"}>
				<h2>Templates !</h2>
			</div>
		</div>
	);
};

export default Templates;
