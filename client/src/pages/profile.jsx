import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import '../pages-css/profile.css'
import { useNavigate,Link,useParams } from 'react-router-dom'
import Footer  from './footer'
import Popup from "../components/Popup.jsx";
import Header from './header'
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';
const Clienturl='http://localhost:3000/'

const Profile = ({ data }) => {
	const Navigate = useNavigate()
    const User = data.User
    const [ButtonPopup,setButtonPopup] =useState(false);
    const [CodeForVerify,SetCodeForVerify] = useState('');
    const [OpenForChangeEmail,setOpenForChangeEmail] = useState(false);
    const [EmailFuture,setEmailFuture] = useState('');

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
    // let {id}=useParams() //for :id
	/*conditions for header 
    profile page is logoutava:false,firsttime:false 
    logout page is profileava:true,firsttime:true 
    anything else will be everything true 
    */
    async function VerifyMailSend (event) {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/send_mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                },
                body: JSON.stringify({
                    EmailTargeted:User.email,
                    type:'verify'
                }),
            })
    
            const data = await response.json()
            if(data.status === 'ok'){
                alert('sent Email Verify')
            }
        } catch(ERR){
            console.log(ERR)
        }
    }
    const Enablepopup =async (e)=>{
        e.preventDefault();
        setButtonPopup(true);
        try {
            const response = await fetch('http://localhost:5000/api/send_mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                },
                body: JSON.stringify({
                    EmailTargeted:User.email,
                    type:'Change Email'
                }),
            })
    
            const data = await response.json()
            if(data.status === 'ok'){
                alert('sent Email A Code ')
            }
            if(data.status === 'NotV'){
                if(User.source==='website'){
                    alert('Please Verify First ')
                }
            }
        } catch(ERR){
            console.log(ERR)
        }
    }

    const SumbitChangeEmailCode=async ( e )=>{
        e.preventDefault();

        if(User.source ==='website'){
            try {
                const response = await fetch('http://localhost:5000/api/CheckForCodeEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                    },
                    body: JSON.stringify({
                        EmailBefore:User.email,
                        Codetogo:CodeForVerify,
                    }),
                })
        
                const data = await response.json()
                if(data.status === 'ok'){
                    setOpenForChangeEmail(true)
                }
                
            } catch(ERR){
                console.log(ERR)
            }
        } else {
            try {
                const response = await fetch('http://localhost:5000/auth/CheckForCodeEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                    },
                    body: JSON.stringify({
                        EmailBefore:User.email,
                        Codetogo:CodeForVerify,
                    }),
                })
        
                const data = await response.json()
                if(data.status === 'ok'){
                    setOpenForChangeEmail(true)
                }
                
            } catch(ERR){
                console.log(ERR)
            }
        }
    }
    const ChangeEmailNow=async (e)=>{
        e.preventDefault();

        if(User.source ==='website'){
            try {
                const response = await fetch('http://localhost:5000/api/ChangeEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        "Access-Control-Allow-Credentials": true,

                    },
                    body: JSON.stringify({
                        EmailBefore:User.email,
                        EmailAfter:EmailFuture,
                    }),
                })
        
                const data = await response.json()
                if(data.status === 'ok'){
                    setOpenForChangeEmail(false)
                    setButtonPopup(false);
                    SetCodeForVerify('')
                    setEmailFuture('')
                    alert('Changed Email')
                }
                
            } catch(ERR){
                console.log(ERR)
            }
        } else {
            try {
                const response = await fetch('http://localhost:5000/auth/ChangeEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        "Access-Control-Allow-Credentials": true,
                    },
                    body: JSON.stringify({
                        EmailBefore:User.email,
                        EmailAfter:EmailFuture,
                    }),
                })
        
                const data = await response.json()
                if(data.status === 'ok'){
                    setOpenForChangeEmail(false)
                    setButtonPopup(false);
                    SetCodeForVerify('')
                    setEmailFuture('')
                    alert('Changed Email')
                }
                
            } catch(ERR){
                console.log(ERR)
            }
        }
    }
    const infoforheader = {isloggedin:true,logoutava:true,profileava:false,firsttime:false};
	return (
    <>
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>
        <div className="container">
            <div id="content" className="content p-0">
                <div className="profile-header">
                    <div className="profile-header-cover"></div>

                    <div className="profile-header-content">
                        <div className="profile-header-img">
                            <img src={User.photo} alt="" width="300" height="110"/>
                        </div>

                        <div className="profile-header-info">
                            <h4 className="m-t-sm">{User.name}</h4>
                            <p className="m-b-sm">which you like more manga or anime</p>
                            <Link to='/profile/edit' className="btn btn-xs btn-info mb-4">Edit Profile</Link>
                        </div>
                    </div>

                    <ul className="profile-header-tab nav nav-tabs">
                        <li className="nav-item"><a href={Clienturl+'profile'+'0'+'comments'} className="nav-link" data-toggle="tab">COMMENTS</a></li>
                        {/* <!-- go to bottom profile page --> */}
                        {/* <li className="nav-item"><a href="#profile-about" className="nav-link" data-toggle="tab">ABOUT</a></li> */}
                        <li className="nav-item"><a href={Clienturl+'profile'+'0'+'manga'} className="nav-link" data-toggle="tab">MANGA</a></li>
                        <li className="nav-item"><a href={Clienturl+'profile'+'0'+'anime'} className="nav-link active show" data-toggle="tab">ANIME</a></li>
                        <li className="nav-item"><a href={Clienturl+'profile'+'0'+'freinds'} className="nav-link" data-toggle="tab">FRIENDS</a></li>
                    </ul>
                </div>

                <div className="profile-container">
                    <div className="row row-space-20">
                        <div className="col-md-8">
                            <div className="tab-content p-0">
                                <div className="tab-pane active show" id="profile-videos">
                                    <div className="m-b-10"><b>Recent Watched Anime (5)</b></div>

                                    <div className="row row-space-2" id='row2'>
                                        <div className="col-sm-8" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/3Kf-FlECN7M?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/izsjRpcgfmk?showinfo=0"></iframe>
                                            </div>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/j876xgnTVUg?showinfo=0"></iframe>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row row-space-2" id='row2'>
                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/wUqH_5memWY?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/wXmu-EYAmKU?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/xS1DghfzuMc?showinfo=0"></iframe>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="m-b-10"><b>Favorite Anime (5)</b></div>
                                    <div className="row row-space-2" id='row2'>
                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/v3ZkCLUFrys?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/toPm-L7Ib44?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/qD8OnPC1fLI?showinfo=0"></iframe>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row row-space-2" id='row2'>
                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/Guo7gR0XyaU?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/ADfIlLfs5Bk?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/8Wg1MYjOguI?showinfo=0"></iframe>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="m-b-10"><b>Bookmarked Anime (5)</b></div>
                                    <div className="row row-space-2" id='row2'>
                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/v3ZkCLUFrys?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/toPm-L7Ib44?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/qD8OnPC1fLI?showinfo=0"></iframe>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row row-space-2" id='row2'>
                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/Guo7gR0XyaU?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/ADfIlLfs5Bk?showinfo=0"></iframe>
                                            </div>
                                        </div>

                                        <div className="col-sm-4" id='column2'>
                                            <div className="embed-responsive embed-responsive-16by9 m-b-2">
                                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/8Wg1MYjOguI?showinfo=0"></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>


                                    

                                        

                        <div className="col-md-4 hidden-xs hidden-sm">
                            <ul className="profile-info-list">
                                <li className="title">PERSONAL INFORMATION</li>
                                <li>
                                    <div className="field">Email: </div>
                                    <div className="value" >{User.email}
                                     {User.verifed==='true' ? 
                                     <i className="fa fa-check" style={{marginLeft:'20px'}}></i> 
                                     : 
                                     <button onClick={(event)=>VerifyMailSend(event)} className='btn btn-xs btn-info mb-4' style={{marginLeft:'20px'}}>
                                     Verify</button> }
                                     <br/>
                                     <button onClick={(e)=>Enablepopup(e)} className='btn btn-xs btn-info mb-4'>
                                        Change Email</button></div>
                                </li>
                                <li>
                                    <div className="field">Anime Read Count:</div>
                                    <div className="value">0</div>
                                </li>
                                <li>
                                    <div className="field">Manga Read count:</div>
                                    <div className="value">0</div>
                                </li>
                                <li>
                                    <div className="field">Birth of Date:</div>
                                    <div className="value">{User.Birth_of_Date}</div>
                                </li>
                                <li>
                                    <div className="field">Country:</div>
                                    <div className="value">{User.Country || null}</div>
                                </li>
                                <li>
                                    <div className="field">Gender:</div>
                                    <div className="value">
                                        {User.gender}
                                    </div>
                                </li>
                                
                                <li className="title">FRIEND LIST (9)</li>
                                <li className="img-list">
                                    <a href={Clienturl+'profile'+'1'} className="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="" /></a>
                                    <a href={Clienturl+'profile'+'2'} className="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="" /></a>
                                    <a href={Clienturl+'profile'+'3'} className="m-b-5"><img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="" /></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        <Popup trigger={ButtonPopup} setTrigger={setButtonPopup}>
            <center>
                {OpenForChangeEmail ? 
                <h3>Type Your Email</h3>
                :<h3>Please Put The Code To Change The Email .</h3>
            }
            {!OpenForChangeEmail ? 
            
            <>
            <br/>
            <div className="input__item">
			<input value={CodeForVerify}
			onChange={(e) => SetCodeForVerify(e.target.value)}
			type="text"
			placeholder="The Code From Email You Get Sent"/>
			</div>
            {User.source !=='website' && User.FirstTimeUsed === 'false' ? 
            <p>Else You Want Change It And Its Your First Time <label style={{color:'red'}}>{User.VFirstTime}</label></p >
            :null}
            </>


            :null}
            {OpenForChangeEmail ? 
                <div className="input__item">
			<input value={EmailFuture}
			onChange={(e) => setEmailFuture(e.target.value)}
			type="text"
			placeholder="Email You Want To Change To "/>
            <br/>
                <button onClick={(e)=>ChangeEmailNow(e)} className='btn btn-xs btn-info mb-4'>Submit</button>
			</div>            
            :
            <button onClick={(e)=>SumbitChangeEmailCode(e)} className='btn btn-xs btn-info mb-4'>Submit</button>
             }
            </center>
        </Popup>
        </ThemeProvider>
        </>
	)
}

export default Profile



