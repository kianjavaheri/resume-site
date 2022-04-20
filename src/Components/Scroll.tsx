import React, {useState} from 'react';
import uparrow from '../svgs/uparrow.svg';

const ScrollButton = () =>{
const [visible, setVisible] = useState(false)
const toggleVisible = () => {
	const scrolled = document.documentElement.scrollTop;
	if (scrolled > 300){
		setVisible(true)
	}
	else {
		setVisible(false)
	}
};

const scrollToTop = () =>{
	window.scrollTo({
	top: 0,
	behavior: 'smooth'
	});
};

window.addEventListener('scroll', toggleVisible);

return (
	<button className="scroll-top" onClick={scrollToTop} style={{display: visible ? 'inline' : 'none'}}>
		<img src={uparrow}></img>
	</button>
);
}

export default ScrollButton;