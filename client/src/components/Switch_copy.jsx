import React from 'react';
import '../pages-css/Switch.css';

const Switch2 = ({ isOn2, handleToggle2, onColor2 ,TexttoType2 }) => {
  return (
    <>
        {
          isOn2 ? <h6>
        {TexttoType2}
          </h6> :<h6 style={{color:'white'}}>
          {TexttoType2}
            </h6>
        }
      <input
        checked={isOn2}
        onChange={handleToggle2}
        className="react-switch-checkbox"
        id={`react-switch-new2`}
        type="checkbox"
        />
      <label
        style={{ background: isOn2 && onColor2 }}
        className="react-switch-label"
        htmlFor={`react-switch-new2`}
        >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch2;