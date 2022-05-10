import { useNavigate,Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../pages-css/login.css'

import Footer from "./footer";

import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';
import Header from "./header";
const Clienturl='http://localhost:3000/'

function VerifyPage() {
	const navigate = useNavigate()
	const [NumberVer, setNumberVer] = useState('')
    const [Email, setEmail] = useState('')
	const [Response_Message, setResponse_Message] = useState('')
	async function SumbitCode(event) {
		event.preventDefault()

		const response = await fetch('http://localhost:5000/api/CheckVerifyAndEmail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials:'include',
			body: JSON.stringify({
				Number:NumberVer,
                Email:Email
			}),
		})

		const data = await response.json()
		if (data.status=== "bad" ) {
			setResponse_Message('Not correct email/verify key')
		} 
		if(data.status==='ok'){
            alert('You Get Verifed')
            navigate('/')
		}
	}
	const infoforheader = {isloggedin:false,logoutava:true,profileava:true,firsttime:true};

	
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
								<h2>Verify Your Email</h2>
							</div>
						</div>
					</div>
				</div>
			</section>
						<center>
							<div className="login__form" style={{marginTop:'10%',marginRight:'10%',marginBottom:'50px'}}>
								<form onSubmit={SumbitCode}>
                                <div className="input__item">
										<input value={Email}
										onChange={(e) => setEmail(e.target.value)}
										type="email"
										placeholder="Email Adress"/>
										<span className="icon_mail"></span>
										</div>
									<div className="input__item">
										<input value={NumberVer}
										onChange={(e) => setNumberVer(e.target.value)}
										type="text"
										placeholder="Verify Code"/>
										<span className="fa fa-key"></span>
										</div>
                                        
									<button className="site-btn" type="submit" value="Login">Send</button>
								</form>
								
							<br/>
							<br/>
							{
								Response_Message ? 
								<label style={{marginBottom:'50px'}}>{Response_Message}</label>
								:null
							}
							</div>
						</center>
			<Footer/>
			</ThemeProvider>
		</>
		
	)
}

export default VerifyPage