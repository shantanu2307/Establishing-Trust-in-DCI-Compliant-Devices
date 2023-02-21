import React from "react";
import {
    AppBar,
    Toolbar,
    Typography
} from "@material-ui/core";


const Footer = () =>
    <>
        <AppBar position="static" elevation={0} component="footer" style={{
            backgroundColor: "black",
        }}>
            <Toolbar style={{ justifyContent: "center" }}>
                <Typography variant="caption">©2022</Typography>
            </Toolbar>
        </AppBar>
    </>

export default Footer;