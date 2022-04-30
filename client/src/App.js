import "./App.css";
import LeftDrawer from "./components/LeftDrawer";
import {useEffect, useState} from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getPluginData()
  }, []);

  function getPluginData() {
    fetch("/getData")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
      });
  }

  const updatePlugin = async (pluginName, isActive, selectedTab) => {
    if (isActive) {
      data.tabdata[selectedTab].active.push(pluginName);
      data.tabdata[selectedTab].inactive = data.tabdata[
        selectedTab
      ].inactive.filter((d) => d !== pluginName);
    } else {
      data.tabdata[selectedTab].inactive.push(pluginName);
      data.tabdata[selectedTab].active = data.tabdata[
        selectedTab
      ].active.filter((d) => d !== pluginName);
    }

    await updatePluginData(data);
    await getPluginData();
  };

  const enableDisableAllPlugin = async (isDisabled, selectedTab) => {
    if (isDisabled) {
      const disabledData = data.tabdata[selectedTab].disabled;
      disabledData.filter((item, 
        index) => disabledData.indexOf(item) === index).forEach((activePlugin) => {
        data.tabdata[selectedTab].inactive.push(activePlugin);
      });
      data.tabdata[selectedTab].active.forEach((activePlugin) => {
        data.tabdata[selectedTab].disabled.push(activePlugin);
      });
      data.tabdata[selectedTab].inactive.forEach((inactivePlugin) => {
        !data.tabdata[selectedTab].disabled.includes(inactivePlugin) && data.tabdata[selectedTab].disabled.push(inactivePlugin);
      });
    } else {
      data.tabdata[selectedTab].disabled = [];
    }

    await updatePluginData(data);
    await getPluginData();
  };

  async function updatePluginData(data) {
    await fetch("/updateData", {
      method: "POST",
      body: JSON.stringify({
        data: data,
      }),
      headers: {"Content-Type": "application/json"},
    });
  }

  return (
    <div className="App">
      <LeftDrawer
        tabData={data?.tabdata}
        tabs={data?.tabs}
        plugins={data?.plugins}
        updatePlugin={updatePlugin}
        enableDisableAllPlugin={enableDisableAllPlugin}
        key={data}
      />
    </div>
  );
}

export default App;
