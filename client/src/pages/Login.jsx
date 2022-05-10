import { useNavigate,Link } from 'react-router-dom'
import { useState } from 'react'
import '../pages-css/login.css'

import Footer from "./footer";
import Header from "./header";
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';
const Clienturl='http://localhost:3000/'
function App() {
	const navigate = useNavigate();

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

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [Checkedbox,setCheckedbox] = useState(false);
	const google = () => {
		window.open("http://localhost:5000/auth/google", "_self");
	};
	
	const twitter=() => {
		window.open("http://localhost:5000/auth/twitter",'_self')
	}
	const github = () => {
		window.open("http://localhost:5000/auth/github", "_self");
	};
	
	const facebook = () => {
		window.open("http://localhost:5000/auth/facebook", "_self");
	};

	async function loginUser(event) {
		event.preventDefault()
		if(!Checkedbox){
			const response = await fetch('http://localhost:5000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials:'include',
				body: JSON.stringify({
					email,
					password,
				}),
			})
	
			const data = await response.json()
	
			if (data.user) {
				localStorage.setItem('token', data.user)
				alert('Login successful')
				navigate('/')
				window.location.reload('false');
			} else {
				alert('Please check your username and password')
			}
		}
		else {
			const response = await fetch('http://localhost:5000/api/loginAndRemberMe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials:'include',
				body: JSON.stringify({
					email,
					password,
				}),
			})
	
			const data = await response.json()
	
			if (data.user) {
				localStorage.setItem('token', data.user)
				alert('Login successful')
				navigate('/')
				window.location.reload('false');
			} else {
				alert('Please check your username and password')
			}
		}
	}

	/*conditions for header 
    profile page is logoutava:false,firsttime:false 
    logout page is profileava:true,firsttime:true 
    anything else will be everything true 
    */

    const infoforheader = {isloggedin:false,logoutava:true,profileava:true,firsttime:true};
	return (

    <>
	<ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
	<div id="preloder">
			<div className="loader"></div>
		</div>
		<Header Infoforheader={infoforheader}/>
		<section className="normal-breadcrumb set-bg" data-setbg="img/normal-breadcrumb.jpg">
				<div className="container">
					<div className="row">
						<div className="col-lg-12 text-center">
							<div className="normal__breadcrumb__text">
								<h2>Login</h2>
								<p>Welcome to the official Anime blog.</p>
							</div>
						</div>
					</div>
				</div>
			</section><section className="login spad">
				<div className="container">
					<div className="row">
						<div className="col-lg-6">
							<div className="login__form">
								<h3>Login</h3>
								<form onSubmit={loginUser}>
									<div className="input__item">
										<input value={email}
										onChange={(e) => setEmail(e.target.value)}
										type="email"
										placeholder="Email address"/>
										<span className="icon_mail"></span>
										</div>
									<div className="input__item">
										<input value={password}
										onChange={(e) => setPassword(e.target.value)}
										type="password"
										placeholder="Password"/>
											<span className="icon_lock"></span>
										</div>
										<input type="checkbox" 
                        				name="topping"  
                        				value={Checkedbox}
                        				onChange={(e) => setCheckedbox(e.target.checked)}
                        				id={`custom-checkbox`}/>
                        				<label style={{marginLeft:'10px'}}>Remember Me ?</label>
										<br/>
									<button className="site-btn" type="submit" value="Login">Login Now</button>
								</form>
								<Link to='/forget_password' className="forget_pass">Forgot Your Password ?</Link>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="login__register">
								<h3>Dont’t Have An Account?</h3>
								<a href={Clienturl+'register'} className="primary-btn">Register Now</a>
							</div>
						</div>
					</div>
					<div className="login__social">
						<div className="row d-flex justify-content-center">
							<div className="col-lg-6">
								<div className="login__social__links">
									<span>or</span>
									<ul>
										<li><a  className="facebook"onClick={facebook}><i className="fa fa-facebook"></i> Sign in With
											Facebook</a></li>
										<li><a  className="google" onClick={google}><i className="fa fa-google"></i> Sign in With Google</a></li>
										<li><a  className="twitter" onClick={twitter}><i className="fa fa-twitter"></i> Sign in With Twitter</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer/>
			</ThemeProvider>
		</>
		
	)
}

export default App
