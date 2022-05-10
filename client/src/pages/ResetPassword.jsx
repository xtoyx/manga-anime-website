import { useNavigate,Link,useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../pages-css/login.css'

import Footer from "./footer";
import Header from "./header";
import { alertTitleClasses } from '@mui/material';
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';
const Clienturl='http://localhost:3000/'
function ResetPassword() {
	const navigate = useNavigate()
	const [Password_1, setPassword_1] = useState('')
    const [Password_2, setPassword_2] = useState('')
	const {idfor} = useParams();
	const [Response_Message, setResponse_Message] = useState('')
	const [StartShowing,setStartShowing]= useState(false);

	async function SumbitPasswords(event) {
		event.preventDefault()
		if(Password_1 === Password_2 && Password_1.length > 5 && Password_2.length > 5 && Password_2.length > 5){
		const response = await fetch('http://localhost:5000/api/Update_Password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials:'include',
				body: JSON.stringify({
					id:idfor,
					Pass:Password_1
				}),
		})
	
		const data = await response.json()
			if(data.status==='ok'){
						alert('Your Password Have Been Changed');
						navigate('/')
			}


		} else {
			setResponse_Message('Please Same Password , Above 6 Characters And No Special Charcters')
		}
	}
	useEffect(async () => {
		const response = await fetch('http://localhost:5000/api/Did_You_Order_Pass', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials:'include',
				body: JSON.stringify({
					id:idfor,
				}),
		})
	
		const data = await response.json()
			if(data.status === 'ok'){
			setStartShowing(true)
			}
	},[])
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
    const infoforheader = {isloggedin:false,logoutava:true,profileava:true,firsttime:true};
	return (
    <>
	<ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>
		{StartShowing ? 
		<div>
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
							<div className="login__form" style={{marginTop:'10%',marginRight:'10%',marginBottom:'50px'}}>
								<form onSubmit={SumbitPasswords}>
									<div className="input__item">
										<input value={Password_1}
										onChange={(e) => setPassword_1(e.target.value)}
										type="password"
										placeholder="Password"/>
										<span className="fa fa-key"></span>
										</div>
                                        <div className="input__item">
										<input value={Password_2}
										onChange={(e) => setPassword_2(e.target.value)}
										type="password"
										placeholder="Password Again"/>
										<span className="fa fa-key"></span>
										</div>
									<button className="site-btn" type="submit" value="Login">Send</button>
								</form> 
							<br/>
							<br/>
							{
								Response_Message ? 
								<label style={{color:'white',marginBottom:'50px'}}>{Response_Message}</label>
								:null
							}
							</div>
			</center>
		</div>
		: <center>
			<h2 style={{margin:'100px'}}>Hello This Side is usluess</h2>
			</center>
			}
			<Footer/>
			</ThemeProvider>
		</>
		
	)
}

export default ResetPassword