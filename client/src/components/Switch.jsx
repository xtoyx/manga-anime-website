import React from 'react';
import '../pages-css/Switch.css';

const Switch = ({ isOn, handleToggle, onColor ,TexttoType }) => {
  return (
    <>
        {
          isOn ? <h6>
        {TexttoType}
          </h6> :<h6 style={{color:'white'}}>
          {TexttoType}
            </h6>
        }
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
        />
      <label
        style={{ background: isOn && onColor }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
        >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;