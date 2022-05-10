import React from 'react';
import { useState } from 'react'
import Switch2 from "../components/Switch_copy.jsx";
import useLocalStorage from 'use-local-storage';

import '../pages-css/Home.css';
const Clienturl='http://localhost:3000/'
    function Footer(){
		
	const [value, setValue] = useState(true);
	const [visible, setVisible] = useState(false)
	const [theme, setTheme] = useLocalStorage('theme' ? 'dark' : 'light')
		setInterval(() => {
			if(localStorage.getItem('theme') === 'dark'){
				setValue(true) //fix this first 
			}else {
				setValue(false) 
			}
		}, 5000);
    const switchTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		
    }

		return(
			<footer className="footer">
				
				<div className="container">
					<div className="row">
						<div className="col-lg-3">
							<div className="footer__logo">
								<a href={Clienturl}>
									{
									value ? 
									<img src="img/logo.png" alt=""/> :<img src="img/logo.png" alt="" style={{filter: "invert(100%)",
										WebkitFilter: "invert(100%)"}}/>	  
									}
									</a>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="footer__nav">
								<ul>
									<li className="active"><a href={Clienturl}>Homepage</a></li>
									<li><a href='#' id='scrollToTopButton'>Categories</a></li>
									<li><a href={Clienturl+'blog'}>Our Blog</a></li>
									<li><a href={Clienturl+'contacts'} >Contacts</a></li>
								</ul>
							</div>
						</div>
						<div className="col-lg-3">
							<p>Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0.
								Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i className="fa fa-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
								Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0.</p>

						</div>
					</div>
				</div>
				<center>
				{theme ==='light' ?<i className="far fa-sun fa-lg" style={{color:'yellow'}}></i> :<i className="far fa-moon fa-lg" style={{color:'white'}}></i>}
				
					<Switch2
                    isOn2={theme === 'light' ? true : false}
                    onColor2={theme === 'light' ? "white":"black"}
                    handleToggle2={() => switchTheme()}
					TexttoType2={theme === 'light' ? "Light Mode":"Dark Mode"}
                    />
				</center>
    </footer>  
	)};
  
export default Footer;