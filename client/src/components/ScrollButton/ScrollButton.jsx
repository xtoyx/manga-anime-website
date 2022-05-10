import React, {useState , useEffect} from 'react';
import { Button } from './Styles';

const ScrollButton = () =>{

const [visible, setVisible] = useState(false)

const toggleVisible = () => {
	const scrolled = document.documentElement.scrollTop;
	console.log(scrolled)
	if (scrolled > 300){
	setVisible(true)
	}
	else if (scrolled <= 300){
	setVisible(false)
	}
};

const scrollToTop = () =>{
	window.scrollTo({
	top: 0,
	behavior: 'smooth'
	/* you can also use 'auto' behaviour
		in place of 'smooth' */
	});
};
console.log(document.getElementsByClassName('container'))
window.addEventListener('scroll', function (){
	toggleVisible()}
	,false);

return (
	<Button>
	<label onClick={scrollToTop}
	style={{display: visible ? 'inline' : 'none'}}>hello</label>
	</Button>
);
}

export default ScrollButton;
