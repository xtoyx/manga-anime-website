import React from 'react'
import '../pages-css/popup.css';
function Popup(props) {
    return ( props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button type="button" class="close"aria-label="Close" onClick={() =>props.setTrigger(false)}>
                <span aria-hidden="true">&times;</span>
                </button>
                {props.children}                
            </div>
        </div>
    ) : "";
}

export default Popup
