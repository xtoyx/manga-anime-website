import React from 'react'
import { BrowserRouter, Routes, Route, Navigate,  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


import ScrollToTop from "./components/ScrollToTop";
import Home from'./pages/Home.jsx';
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Edit_Profile from './pages/edit_profile.jsx';
import Profile from './pages/profile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Categories from './pages/categories.jsx' //do this
import Blog from './pages/blog.jsx'
import Manga_details from './pages/Manga-details.jsx';
import Manga_Watching from './pages/Manga-Watching.jsx';
import Manga_List from './pages/Manga_List.jsx';
import All_mangas from './pages/All_Mangas.jsx';
import Popular_Mangas from './pages/Popular_Mangas.jsx';
import Profile_Unknow from './pages/Profile_Unknow.jsx'
import Test3 from './pages/Search_Page.jsx'
import Download_page from './pages/Download_Page.jsx'
import AdminLogin from './pages/AdminLogin.jsx';
import ForgetPassword from './pages/ForgetPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyPage from './pages/VerifyPage.jsx';
import Contacts from './pages/Contacts.jsx';
import FirstBlog from './pages/FirstBlog.jsx';
import Manga_trending from './pages/Manga-trending.jsx';

const App = () => {
	const [user, setUser] = useState(null);
	const [Admin, setAdmin] = useState(null);
	const [isloggedin,setIsloggedin]=useState(false);
	const [mangas,setMangas] = useState('');
	const [geners,setTags]= useState('');
	const [Stop,setStop]=useState(false);
	// const navigate = useNavigate();
	const dataneeded={
		'Geners':geners,
		'Mangas':mangas,
		'User':user,
		'isloggedin':{isloggedin},
		logoutava:true,
		profileava:true,
		firsttime:true
	};

		useEffect(() => {
			
			  
			  function sleep(ms) {
				return new Promise((resolve) => {
				  setTimeout(resolve, ms);
				});
			  }
			var stop=false;
			const getUserWebsite = () =>{
				try {
					if(!Stop) {
						fetch("http://localhost:5000/api/user", {
							method: "GET",
							credentials: "include",
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								"Access-Control-Allow-Credentials": true,
							},
						})
						.then((response) => {
							if (response.status === 200) return response.json();
						})
						.then((resObject) => {
							if(resObject !== undefined) {
								setUser(resObject.data);
								setIsloggedin(true)
								setStop(true);
								console.log('logged in website')
								dataneeded.User=resObject.data;
							}
							return;
							})
							.catch((err) => {
								console.log(err);
							});
						};
				}catch(err){
					console.log("error : in website login"+err);
				}
			}
			const getUsergoogle = () => {
				try{
					if(!Stop ) {
						fetch("http://localhost:5000/auth/login/success", {
							method: "GET",
							credentials: "include",
					  headers: {
						  Accept: "application/json",
						  "Content-Type": "application/json",
						  "Access-Control-Allow-Credentials": true,
						},
					})
					.then((response) => {
						if (response.status === 200) return response.json();
					})
					.then((resObject) => {
						if(resObject !== undefined) {
							setUser(resObject.user);
							setStop(true);
							setIsloggedin(true);
							console.log('logged in google')
							dataneeded.User=resObject.user;
						}
						return;
					})
					.catch((err) => {
						console.log(err);
					});
					}
				}catch(err) {
					console.log('error in google login :'+err);
				}
			
			}
			const get_allmangas=()=>{
				fetch("http://localhost:5001/m", {
									method: "GET",
									credentials: "include",
									headers: {
										Accept: "application/json",
										"Content-Type": "application/json",
										"Access-Control-Allow-Credentials": true,
									},
								})
								.then((response) => {
									if (response.status === 200) return response.json();
								})
								.then((resObject) => {
									setMangas(resObject)
									})
									.catch((err) => {
										console.log(err);
									});
			}
			const get_allmangatags=()=>{
				fetch("http://localhost:5001/tags/", {
									method: "GET",
									credentials: "include",
									headers: {
										Accept: "application/json",
										"Content-Type": "application/json",
										"Access-Control-Allow-Credentials": true,
									},
								})
								.then((response) => {
									if (response.status === 200) return response.json();
								})
								.then((resObject) => {
									setTags(resObject)
									})
									.catch((err) => {
										console.log(err);
									});
			}
			const getAdminChecking = () =>{
				try {
					if(!Stop) {
						fetch("http://localhost:5000/api/CheckForAdminCookie", {
							method: "GET",
							credentials: "include",
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								"Access-Control-Allow-Credentials": true,
							},
						})
						.then((response) => {
							if (response.status === 200) return response.json();
						})
						.then((resObject) => {
							if(resObject !== undefined) {
								setAdmin(resObject.data);
								setIsloggedin(false)
								setStop(true);
								console.log('logged as Admin website')
							}
							return;
							})
							.catch((err) => {
								console.log(err);
							});
						};
				}catch(err){
					console.log("error : in website login"+err);
				}
			}
			if(user==null) {
				async function init() {
					get_allmangas();
					getUsergoogle();
					await sleep(2000);
					getUserWebsite();
					await sleep(1000);
					get_allmangatags();
					await sleep(1000);
					getAdminChecking();
				}
				init()
		}
		
	}, []);
	
	return (
		
		<div>
			<BrowserRouter>
			<ScrollToTop/>
				<Routes>
					
				<Route path="/blog" element={<Blog data={dataneeded}/>}/>
				<Route path="/categories" element={<Categories data={dataneeded}/>}/>
				<Route path="/register" element={<Register data={dataneeded}/>} />

				<Route 
				path="/profile"
				element={user ? <Profile data={dataneeded}/> : <Navigate to="/login" />}				
				/>
				
				<Route 
				path="/profile/name=:Name"
				element={<Profile_Unknow data={dataneeded}/>}				
				/>

				<Route 
				path="/profile/edit"
				element={user ? <Edit_Profile data2={dataneeded}/> : <Navigate to="/login" />}/>

				{/* from this  */}
				<Route path="/admin/DashBoard/:title" element={
				Admin ? <Dashboard data={dataneeded}/> : null
				} />
				<Route path="/admin/DashBoard/:title/:hmn" element={
				Admin ? <Dashboard data={dataneeded}/> : null
				} />

				{/* To This */}
				 <Route path="/" 
				element={<Home data={dataneeded}/>}/>
				
				<Route
					path="/login"
					element={user ? <Navigate to='/profile' /> : <Login />
				}
				/>
				<Route path="/manga_list/:id"
				element={<Manga_List data={dataneeded}/>}/>
				<Route path="/all_mangas/:tags"
				element={<All_mangas data={dataneeded}/>}/>
				<Route path="/popular_mangas/"
				element={<Popular_Mangas data={dataneeded}/>}/>
				<Route path="/manga/:title"
				element={<Manga_details data={dataneeded}/>}/>
				<Route path="/manga/:title/pages/:idk" 
				element={<Manga_Watching data={dataneeded}/>}/>
				<Route path="/manga/:title/Downloadpage"
				element={<Download_page data={dataneeded}/>}/>
				<Route path="/search/" 
				element={<Test3 data={dataneeded}/>}/>
				<Route path="/adminLogin/$9837465120sahuediudasijoxjoiczsa" 
				element={<AdminLogin/>}/>
				<Route path='/forget_password' element={<ForgetPassword/>}/>
				<Route path='/ResetPassword/:idfor' element={<ResetPassword/>}/>
				<Route path='/VerifyEmail' element={<VerifyPage/>}/>
				<Route path='/contacts' element={<Contacts data={dataneeded}/>}/>
				<Route path='blog/First_Blog' element={<FirstBlog data={dataneeded}/>}/>

				<Route path='/manga_trending/:id' element={<Manga_trending data={dataneeded}/>}/>
				<Route path='*' //error page
				/>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
