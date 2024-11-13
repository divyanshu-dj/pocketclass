import { Tag } from "antd";
import SportSelectionWidget from "../SportSelectionWidget";
import { useState } from "react";
import { categories } from "../../utils/categories";

function MusicSelector() {
  const [activeKey, setActiveKey] = useState(categories[0].name.toLowerCase());

  const handleTagClick = (key) => {
    setActiveKey(key);
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
        {categories.map((category) => (
          <Tag.CheckableTag
            key={category.name}
            checked={activeKey === category.name.toLowerCase()}
            onChange={() => handleTagClick(category.name.toLowerCase())}
            style={{
              minWidth: '79px',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '100px',
              border: '2px solid black',
              backgroundColor: activeKey === category.name.toLowerCase() ? '#261f22' : 'white',
              color: activeKey === category.name.toLowerCase() ? 'white' : 'black'
            }}
          >
            {category.name}
          </Tag.CheckableTag>
        ))}
      </div>
      <SportSelectionWidget category={activeKey} />
    </div>
  );
}

export default MusicSelector;
