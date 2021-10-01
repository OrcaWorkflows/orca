import { useState } from "react";

import {
	Container,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { User, Tool, HelpCircle } from "react-feather";
import { Link as RouterLink } from "react-router-dom";

import Account from "views/main/Settings/Account";
import Help from "views/main/Settings/Help";

const useStyles = makeStyles((theme) => ({
	bold: { fontWeight: theme.typography.fontWeightBold },
	container: { marginTop: 100, marginBottom: 100 },
	link: {
		"&:hover": {
			fontWeight: theme.typography.fontWeightBold,
			textDecoration: "underline",
		},
	},
	selected: {
		backgroundColor: theme.palette.primary.dark,
		borderRadius: theme.shape.borderRadius,
	},
}));

export const Settings = (): JSX.Element => {
	const classes = useStyles();
	const [selectedSettings, setSelectedSettings] = useState("account");

	return (
		<Container maxWidth="md" className={classes.container}>
			<Grid container spacing={2}>
				<Grid item xs="auto">
					<List dense>
						<ListItem
							className={clsx({
								[classes.selected]: selectedSettings === "account",
							})}
							button
							onClick={() => {
								setSelectedSettings("account");
							}}
							divider
						>
							<ListItemIcon>
								<User />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									className: clsx({
										[classes.bold]: selectedSettings === "account",
									}),
								}}
								primary="Account"
							/>
						</ListItem>
						<ListItem
							component={RouterLink}
							button
							to="/settings/operator-configurations"
							divider
						>
							<ListItemIcon>
								<Tool />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									className: classes.link,
								}}
								primary="System Configurations"
							/>
						</ListItem>
						<ListItem
							className={clsx({
								[classes.selected]: selectedSettings === "help",
							})}
							button
							onClick={() => {
								setSelectedSettings("help");
							}}
							divider
						>
							<ListItemIcon>
								<HelpCircle />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									className: clsx({
										[classes.bold]: selectedSettings === "help",
									}),
								}}
								primary="Help"
							/>
						</ListItem>
					</List>
				</Grid>
				<Grid item xs>
					{selectedSettings === "account" && <Account />}
					{selectedSettings === "help" && <Help />}
				</Grid>
			</Grid>
		</Container>
	);
};

export default Settings;
