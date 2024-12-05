import React, {useState} from "react";
import { SlHome } from "react-icons/sl";
import { IoMapOutline } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { BsFillPostageHeartFill } from "react-icons/bs";
import "../App.css";

const TopIcon = () => {
  const [logo, setLogo] = useState(null);
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };
  const iconComponents = [<SlHome />, <IoMapOutline />, <VscAccount />, <BsFillPostageHeartFill />];
  return(    
    <header className="home-header">
      <div className="logo-container">
        {logo ? (
          <img src={logo} alt="Logo" className="logo" />
        ) : (
          <label className="file-input">
            로고 선택
            <input type="file" accept="image/*" onChange={handleLogoChange} />
          </label>
        )}
      </div>
      <div className="icon-container">
        {iconComponents.map((Icon, i) => (
          <div key={i} className="icon">
              {Icon}
          </div>
        ))}
      </div>  
    </header>
  )
}

export default TopIcon;