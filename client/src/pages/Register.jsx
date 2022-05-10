import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../pages-css/login.css'
import Footer from "./footer";
import Header from "./header";
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';
const Clienturl='http://localhost:3000/'
function App({data}) {
	const navigate = useNavigate()

	const google = () => {
		window.open("http://localhost:5000/auth/google", "_self");
	};
	
	const twitter = () => {
		window.open("http://localhost:5000/auth/twitter",'_self');
	}


	const github = () => {
		window.open("http://localhost:5000/auth/github", "_self");
	};
	
	const facebook = () => {
		window.open("http://localhost:5000/auth/facebook", "_self");
	};


	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	async function registerUser(event) {
		event.preventDefault()
		if(!(name === '' && email === '' && password.length < 5)){
			const response = await fetch('http://localhost:5000/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					email,
					password,
				}),
			})
			const data = await response.json()
			if (data.status === 'ok') {
				navigate('/login')
			}
		}
		else{
			
		}
	}
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
	const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true};
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
								<h2>Sign Up</h2>
								<p>Welcome to the official Anime blog.</p>
							</div>
						</div>
					</div>
				</div>
			</section><section className="signup spad">
				<div className="container">
					<div className="row">
						<div className="col-lg-6">
							<div className="login__form">
								<h3>Sign Up</h3>
								<form onSubmit={registerUser}>
									<div className="input__item">
										<input value={email}
										onChange={(e) => setEmail(e.target.value)}
										type="email"
										placeholder="Email Address"/>
										<span className="icon_mail"></span>
									</div>
									<div className="input__item">
										<input value={name}
										onChange={(e) => setName(e.target.value)}
										type="text"
										placeholder="Username"/>
										<span className="icon_profile"></span>
									</div>
									<div className="input__item">
										<input value={password}
										onChange={(e) => setPassword(e.target.value)}
										type="password"
										placeholder="Password"/>
										<span className="icon_lock"></span>
									</div>
									<button type="submit" value="Register" className="site-btn">Register Now</button>
								</form>
								<h5>Already have an account? <a href={Clienturl+'login'} style={{ marginLeft: '10px' }}>Log In!</a></h5>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="login__social__links">
								<h3>Sign Up With:</h3>
								<ul>
									<li><a className="facebook" onClick={facebook}><i className="fa fa-facebook"></i> Sign Up With Facebook</a>
									</li>
									<li><a  className="google"onClick={google}><i className="fa fa-google"></i> Sign Up With Google</a></li>
									<li><a  className="twitter" onClick={twitter}><i className="fa fa-twitter"></i> Sign Up With Twitter</a></li>
								</ul>
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

export default App;
