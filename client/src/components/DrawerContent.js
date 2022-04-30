import React, { useEffect, useState } from "react";
import { Box, Toolbar, Grid } from '@mui/material';
import CardComponent from "./CardComponent";

export default function DrawerContent(props) {
  const [allCardData, setAllCardData] = useState([]);

  useEffect(() => {
    if(props.tabData) {
     const result = [].concat(props.tabData[props.selectedTab]?.active, props.tabData[props.selectedTab]?.inactive, props.tabData[props.selectedTab]?.disabled); 
      setAllCardData(result.filter((item, 
        index) => result.indexOf(item) === index));
    }
  }, [props.selectedTab, props.tabData]);

  const updatePlugin = (pluginName, isActive) => {
    props.updatePlugin(pluginName, isActive)
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: "background.default",
        p: 3,
        display: "flex",
        mt: 10,
        justifyContent: "space-between",
      }}
    >
      <Toolbar />
      <Grid container spacing={4}>
        {allCardData.map((pluginName, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <CardComponent
            plugin={props.plugins[pluginName]}
            pluginName={pluginName}
            checked={props.tabData[props.selectedTab]?.active.includes(pluginName)}
            key={index}
            selectedTab={props.selectedTab}
            disabled={props.tabData[props.selectedTab]?.disabled.includes(pluginName)}
            updatePlugin={updatePlugin}
          />
        </Grid>
        ))}
      </Grid>
    </Box>
  );
}
