import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../pages-css/login.css'

import Footer from "./footer";
import Header from "./header";
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';
const Clienturl='http://localhost:3000/'

function App() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [passworddata, setPassworddata] = useState('')
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

	async function loginUser(event) {
		event.preventDefault()

		const response = await fetch('http://localhost:5000/api/Adminlogin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials:'include',
			body: JSON.stringify({
                username,
				email,
				password,
                passworddata
			}),
		})

		const data = await response.json()

		if (data.user) {
			alert('Login successful')
			navigate('/admin/DashBoard/Admin')
		} else {
			alert('Please check Data Backend for more information')
		}
	}

	/*conditions for header 
    profile page is logoutava:false,firsttime:false 
    logout page is profileava:true,firsttime:true 
    anything else will be everything true 
    //<div id="preloder">
	// 		<div className="loader"></div>
	// 	</div>
    */

	return (
    <>
	<ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
		<section className="normal-breadcrumb set-bg" data-setbg="img/normal-breadcrumb.jpg">
				<div className="container">
					<div className="row">
						<div className="col-lg-12 text-center">
							<div className="normal__breadcrumb__text">
								<h2>Login Admin Side</h2>
								<p>Where You need to sumbit your kidney to enter</p>
							</div>
						</div>
					</div>
				</div>
			</section>

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
										<input value={username}
										onChange={(e) => setUsername(e.target.value)}
										type="text"
										placeholder="Username"/>
										<span className="icon_mail"></span>
										</div>


                                        <div className="input__item">
										<input 
                                        value={password}
										onChange={(e) => setPassword(e.target.value)}
										type="password"
										placeholder="Password"/>
											<span className="icon_lock"></span>
										</div>
                                        <div className="input__item">
										<input value={passworddata}
										onChange={(e) => setPassworddata(e.target.value)}
										type="password"
										placeholder="Password from backend"/>
											<span className="icon_lock"></span>
										</div>
									<button className="site-btn" type="submit" value="Login">Login Now</button>
								</form>
							</div>
			</ThemeProvider>						
		</>
		
	)
}

export default App
