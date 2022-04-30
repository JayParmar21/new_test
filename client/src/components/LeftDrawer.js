import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import { Box, Toolbar, Drawer, AppBar, List, Typography, 
  ListItem, ListItemIcon, ListItemText, FormControlLabel, Switch } from "@mui/material";
import AddBusiness from "@mui/icons-material/AddBusiness";
import AddCard from "@mui/icons-material/AddCard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DrawerContent from "./DrawerContent";
import { styled } from '@mui/material/styles';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} checked={props.checked} />
))(({theme}) => ({
  "width": 42,
  "height": 26,
  "padding": 0,
  "& .MuiSwitch-switchBase": {
    "padding": 0,
    "margin": 2,
    "transitionDuration": "300ms",
    "&.Mui-checked": {
      "transform": "translateX(16px)",
      "color": "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "red" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const drawerWidth = 240;

export default function LeftDrawer(props) {

  const [header, setHeader] = useState("Marketing Plugins");
  const [selectedTab, setSelectedTab] = useState(null);
  const [disableAllPlugins, setDisableAllPlugins] = useState(false);
  const [disableAllPluginNames, setDisableAllPluginsNames] = useState("");
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if(props.tabData && selectedTab) {
      const result = [].concat(props.tabData[selectedTab]?.active, props.tabData[selectedTab]?.inactive, props.tabData[selectedTab]?.disabled);
      const filterResult = result.filter((item, 
        index) => result.indexOf(item) === index)
      setDisableAllPlugins(filterResult.length === props.tabData[selectedTab]?.disabled.length);
    }
  }, [selectedTab, props.tabData])

  const setPageDetail = (tabName, tabNameInternal, index) => {
    setHeader(tabName + " Plugins");
    setSelectedTab(tabNameInternal);
    setSelected(index)
  };

  const updatePlugins = (event) => {
    if(event.target.checked) {
      setDisableAllPlugins(true);
      let pluginNames = [...props.tabData[selectedTab].active,...props.tabData[selectedTab].inactive, ...props.tabData[selectedTab].disabled]
      setDisableAllPluginsNames(pluginNames)
      props.enableDisableAllPlugin(true, selectedTab)
    }
    else {
      setDisableAllPlugins(false);
      props.enableDisableAllPlugin(false, selectedTab)
    }
  }

  useEffect(() => {
    setSelectedTab("tab1");
  }, []);

  const updatePlugin = (pluginName, isActive) => {
    props.updatePlugin(pluginName, isActive, selectedTab)
  }

  return (
    <Box sx={{display: "flex"}}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "white",
          color: "black",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {header}
          </Typography>
        </Toolbar>
      </AppBar>
      <Router>
        <Drawer
          sx={{
            "width": drawerWidth,
            "flexShrink": 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box
            component="img"
            sx={{
              height: "34px",
              marginTop: "15px",
              padding: "0px 14px",
              marginBottom: '7px'
            }}
            alt="Your logo."
            src="data-image.png"
          />

          <List>
            {props.tabs?.map((tabName, index) => (
              <Link
                to={`/${props.tabData[tabName]?.title.toLowerCase()}`}
                style={{textDecoration: "none", color: "#060314bf"}}
                key={tabName}
              >
                <ListItem
                  button
                  key={tabName}
                  selected={selected === index }
                  onClick={() =>
                    setPageDetail(props.tabData[tabName]?.title, tabName, index)
                  }
                >
                  <ListItemIcon>
                    {props.tabData[tabName].title === "Marketing" ? (
                      <AddBusiness />
                    ) : props.tabData[tabName].title === "Finance" ? (
                      <AddCard />
                    ) : props.tabData[tabName].title === "Personnel" ? (
                      <AssignmentTurnedInIcon />
                    ) : (
                      ""
                    )}
                  </ListItemIcon>
                  <ListItemText primary={props.tabData[tabName].title} />
                </ListItem>
              </Link>
            ))}
          </List>
          <Box sx={{marginTop: 'auto', marginBottom: '3rem'}}>
            <FormControlLabel
              value="bottom"
              control={
                <IOSSwitch
                  sx={{m: 1}}
                  checked={disableAllPlugins}
                  onChange={updatePlugins}
                />
              }
              label="All plugins disabled"
              sx={{color: 'black'}}
              labelPlacement="start"
            />
          </Box>
        </Drawer>
        <Routes>
          <Route
            exact
            path="*"
            element={
              <DrawerContent
                tabData={props.tabData}
                tabs={props.tabs}
                plugins={props.plugins}
                selectedTab={selectedTab}
                disableAllPlugins={disableAllPlugins}
                disableAllPluginNames={disableAllPluginNames}
                updatePlugin={updatePlugin}
              />
            }
          />
        </Routes>
      </Router>
    </Box>
  );
}
