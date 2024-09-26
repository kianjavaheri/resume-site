import React, {useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import './../styling/components/Scroll.css'


function ScrollButton() {
	const [visible, setVisible] = useState(false)
	const toggleVisible = () => {
		const scrolled = document.documentElement.scrollTop;
		if (scrolled > 400){
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

	// scroll function

	return (
		<button className="scroll-top"	 onClick={scrollToTop} style={{display: visible ? 'inline' : 'none'}}>
			<FontAwesomeIcon icon={faArrowUp} className="arrow" size="2x"/>
		</button>
	);
}

export default ScrollButton;