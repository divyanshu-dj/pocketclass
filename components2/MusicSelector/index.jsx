import { Tag } from "antd";
import SportSelectionWidget from "../SportSelectionWidget";
import { useState } from "react";

function MusicSelector() {
  const [activeKey, setActiveKey] = useState("music");

  const handleTagClick = (key) => {
    setActiveKey(key);
    console.log("Active category:", key);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    flexShrink: 0
  };

  const tagContainerStyle = {
    paddingLeft: '64px',
    paddingRight: '48px',
    display: 'flex',
    gap: '10px'
  };

  return (
    <div style={containerStyle}>
      <div style={tagContainerStyle}>
        <Tag.CheckableTag
          checked={activeKey === "music"}
          onChange={() => handleTagClick("music")}
          style={{
            minWidth: '79px',
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100px',
            border: '2px solid black',
            backgroundColor: activeKey === "music" ? '#261f22' : 'white',
            color: activeKey === "music" ? 'white' : 'black'
          }}
        >
          Music
        </Tag.CheckableTag>
        <Tag.CheckableTag
          checked={activeKey === "sport"}
          onChange={() => handleTagClick("sport")}
          style={{
            minWidth: '79px',
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100px',
            border: '2px solid black',
            backgroundColor: activeKey === "sport" ? '#261f22' : 'white',
            color: activeKey === "sport" ? 'white' : 'black'
          }}
        >
          Sport
        </Tag.CheckableTag>
        <Tag.CheckableTag
          checked={activeKey === "art"}
          onChange={() => handleTagClick("art")}
          style={{
            minWidth: '79px',
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100px',
            border: '2px solid black',
            backgroundColor: activeKey === "art" ? '#261f22' : 'white',
            color: activeKey === "art" ? 'white' : 'black'
          }}
        >
          Art
        </Tag.CheckableTag>
      </div>
      <SportSelectionWidget category={activeKey} />
    </div>
  );
}

export default MusicSelector;
