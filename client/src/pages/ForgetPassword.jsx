import { useNavigate,Link } from 'react-router-dom'
import { useState } from 'react'
import '../pages-css/login.css'

import Footer from "./footer";
import Header from "./header";
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';
const Clienturl='http://localhost:3000/'

function ForgetPassword() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [Response_Message, setResponse_Message] = useState('')

	const [theme, setTheme] = useState('dark');
	const isDarkTheme = theme === "dark";
    setInterval(() => {
        if(localStorage.getItem('theme')){
            const savedTheme = localStorage.getItem("theme");
            if(theme !== savedTheme){
                const prefersDark = window.matchMedia &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme && ["dark", "light"].includes(savedTheme)) {
                  setTheme(savedTheme);
                } else if (prefersDark) {
                  setTheme("dark");
                }
            }
        }
    },5000)

	async function SumbitEmail(event) {
		event.preventDefault()

		const response = await fetch('http://localhost:5000/api/checkemail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials:'include',
			body: JSON.stringify({
				email,
			}),
		})

		const data = await response.json()
		if (data.status=== "bad" ) {
			setResponse_Message('No email')
		} 
		if(data.status==='ok'){
			setResponse_Message('Sent Please Look At Your Email')
			await fetch('http://localhost:5000/api/send_mail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials:'include',
			body: JSON.stringify({
				EmailTargeted:email,
				type:'forget'
			}),
		})
		
		}
	}

	const Reload_Everything=(e)=>{
		e.preventDefault();
		setEmail('')
		setResponse_Message('')
	}
    const infoforheader = {isloggedin:false,logoutava:true,profileava:true,firsttime:true};
	return (
    <>
	<ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>
		<section className="normal-breadcrumb set-bg" data-setbg="img/normal-breadcrumb.jpg">
				<div className="container">
					<div className="row">
						<div className="col-lg-12 text-center">
							<div className="normal__breadcrumb__text">
								<h2>Forget your password</h2>
							</div>
						</div>
					</div>
				</div>
			</section>
						<center>
							<div className="login__form" style={{marginTop:'20px'}}>
							{
								Response_Message !== 'Sent Please Look At Your Email' ? 
								<form onSubmit={SumbitEmail}>
									<div className="input__item">
										<input value={email}
										onChange={(e) => setEmail(e.target.value)}
										type="email"
										placeholder="Email address"/>
										<span className="icon_mail"></span>
										</div>
									<button className="site-btn" type="submit" value="Login">Send</button>
								</form> : <>
								<label  style={{color:'white'}}>{email}</label>
								<br/>
								<br/>
								<button className="site-btn" type="submit" value="Login" onClick={(e)=>Reload_Everything(e)}>Not Your Email</button>
								</>
							}
							<br/>
							<br/>
							{
								Response_Message ? 
								<label style={{color:'white',marginBottom:'50px'}}>{Response_Message}</label>
								:null
							}
							</div>
						</center>
			<Footer/>
			</ThemeProvider>
		</>
		
	)
}

export default ForgetPassword