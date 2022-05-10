import '../pages-css/edit_profile.css';
import { useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import Footer from "./footer";
import Header from "./header";
import Popup from "../components/Popup";
import axios from 'axios';
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';


function Edit_Profile({ data2 }) {
    const navigate = useNavigate()
    let update=false;
    /*conditions for header 
    profile page is logoutava:true,firsttime:false,profile:false
    logout page is profileava:true,firsttime:true ,logoutava:false
    anything else will be everything true 
    */
    const [ButtonPopup,setButtonPopup] =useState(false);
    const [Username, setUsername] = useState('')
    console.log(JSON.stringify(data2.User))
    const [photo,setPhoto]=useState('');
    const [src,setSrc]=useState('');
    const [SecondName, setSecondName] = useState('')
    const [FirstName, setFirstName] = useState('')
	const [Email, setEmail] = useState('')
    const [Emailtosend, setEmailtosend] = useState('')
    const [Usernametosend, setUsernametosend] = useState('')
	const [Newpassword, setNewPassword] = useState('')
    const [Passwordtosend,setPasswordtosend] = useState('')
    const [ConfrimPasssword, setConfrimPasssword] = useState('')
    const [ConfrimPasssword2, setConfrimPasssword2] = useState('')

    const [HelpText, setHelpText] = useState('')
    const [ShowHelpText,setShowHelpText] = useState(false)
    const [Gender, setGender] = useState('')
    const [MorA, setMorA] = useState('')
    const [Age, setAge] = useState(1)
    const [Birth_of_Date, setBirth_of_Date] = useState('')
    const [Country, setCountry] = useState('')

    const[Show_Error, setShow_Error]= useState(false)
    const [ErrortoDisplay, setErrortoDisplay]= useState('')

    let unlocked=false;
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

    const infoforheader = {isloggedin:true,logoutava:true,profileava:false,firsttime:false};
	
    function checkingConfrim_Passwordwithmainone_others(){
        fetch("http://localhost:5000/auth/checkpass", {
            method: 'POST',
            credentials: "include",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
               ConfrimPasssword,
               user2:data2.User,
            }),
			})
			.then((response) => {
				if (response.status === 200) return response.json();
                if(response.status == 400) {
                    setShow_Error(true);
                    return setErrortoDisplay('Not The Right Password');
                }
            })
			.then((resObject) => {
                if(resObject.status == 'ok') {
                    unlocked=true;
                    setShow_Error(false);
                    setButtonPopup(false);
                   if(data2.User.source=='website') EditUser_webiste();
                   else{
                    EditUser_others();
                   }
                }
				return;
				})
				.catch((err) => {
					console.log(err);
				});

    }


    function checkingConfrim_Passwordwithmainone() {
        fetch("http://localhost:5000/api/checkpass", {
            method: 'POST',
            credentials: "include",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
               ConfrimPasssword,
            }),
			})
			.then((response) => {
				if (response.status === 200) return response.json();
                if(response.status == 400) {
                    setShow_Error(true);
                    return setErrortoDisplay('Not The Right Password');
                }
            })
			.then((resObject) => {
                if(resObject.status == 'ok') {
                    unlocked=true;
                    setShow_Error(false);
                    setButtonPopup(false);
                   if(data2.User.source=='website') EditUser_webiste();
                   else{
                    EditUser_others();
                   }
                }
				return;
				})
				.catch((err) => {
					console.log(err);
				});

	}





    function ConfrimAllpassword(){
        if(data2.User.source=='website'){
            if(ConfrimPasssword == ConfrimPasssword2){
                if(ConfrimPasssword !='' && ConfrimPasssword2!='' && ConfrimPasssword.length >5){
                    return checkingConfrim_Passwordwithmainone();
                }
                else{
                    setShow_Error(true);
                    setErrortoDisplay('Not Empty and it must be Above 5 charcter length');
                    return;
                }
            }
            else{
                setShow_Error(true);
                setErrortoDisplay('Same Confrim Password please');
                return;
            }
        }
        else{
            if(ConfrimPasssword == ConfrimPasssword2){
                if(ConfrimPasssword !='' && ConfrimPasssword2!='' && ConfrimPasssword.length >5){
                    return checkingConfrim_Passwordwithmainone_others();
                }
                else{
                    setShow_Error(true);
                    setErrortoDisplay('Not Empty and it must be Above 5 charcter length');
                    return;
                }
            }
            else{
                setShow_Error(true);
                setErrortoDisplay('Same Confrim Password please');
                return;
            }
        }
    }
    async function EditUser_webiste() {
        if(unlocked) {
            const response = await fetch('http://localhost:5000/api/update', {
                method: 'POST',
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({
                    _id:data2.User._id,
                    SecondName,
                    FirstName,
                    Usernametosend,
                    Emailtosend,
                    Passwordtosend,
                    Gender,
                    MorA,
                    Age,
                    Birth_of_Date,
                    photo,
                    Country
                }),
            })
            
            if(src !=''){
                try {
                    await fetch('http://localhost:5000/api/upload/photo', {
                        method: 'POST',
                        credentials: "include",
                        body: JSON.stringify({ data: src , _id:data2.User._id}),
                        headers: {  Accept: "application/json",
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Credentials": true, },
                    });
                } catch (err) {
                    console.error(err);
                }
            }
            const data = await response.json()
            
            if (data.status === 'ok') {
                navigate('/')
            }
        }
	}
    async function EditUser_others() {
        if(unlocked) {
            const response = await fetch('http://localhost:5000/auth/update', {
                method: 'POST',
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({
                    SecondName,
                    FirstName,
                    Usernametosend,
                    Emailtosend,
                    Passwordtosend,
                    Gender,
                    MorA,
                    Age,
                    Birth_of_Date,
                    photo,
                    Country,
                    user2:data2.User,
                }),
            })
            
            if(src !=''){
                try {
                    await fetch('http://localhost:5000/auth/upload/photo', {
                        method: 'POST',
                        credentials: "include",
                        body: JSON.stringify({ data: src , _id:data2.User._id,
                        }),
                        headers: {  Accept: "application/json",
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Credentials": true, },
                    });
                } catch (err) {
                    console.error(err);
                }
            }
            const data = await response.json()
            
            if (data.status === 'ok') {
                navigate('/')
            }
        }
	}
   async function checkingEverything(){
        if(Username=='' || Username== data2.User.name){
            setUsernametosend(data2.User.name)
        }
        else{
            setUsernametosend(Username)
        }
        if(Email=='' || Email== data2.User.email){
            setEmailtosend(data2.User.email)
        }
        else{
            setEmailtosend(Email)
        }  
        if(Newpassword.length <5){
            unlocked=false;
            setShowHelpText(true);
            setHelpText('please the new password will be above 5 charcters ')
        }
        else{
            setPasswordtosend(Newpassword)
        }
        if(Age!='1'){
            setBirth_of_Date(2022-Age);
        }
        if(src!=''){
            unlocked=true;
            setShowHelpText(false);
            setButtonPopup(true);
        }
        if(FirstName==''||SecondName==''||Gender==''||MorA==''||Country==''||Age==1){
           unlocked=false;
           setShowHelpText(true);
           setHelpText('please fill all fields required')
        }
        if(FirstName!=''&&SecondName!=''&&Gender!=''&&MorA!=''&&Age!=''){
            unlocked=true;
            setButtonPopup(true)
        }
    }
        var t=setTimeout(()=>{
            if(src =='' && !update){
                setPhoto(data2.User.photo);
                console.log(data2.User.photo);
                console.log('get called again' + src)
            }
            setUsername(data2.User.name);
            setEmail(data2.User.email);
        },10000)
        
    function imageHandler(e){
        const reader = new FileReader();
        reader.onload = () =>{
            if(reader.readyState === 2){
            setSrc(reader.result)
            setPhoto(reader.result)
            if(t!=null){
                clearTimeout(t)
                t=null;
            }
            update=true;
            console.log(update)
          }
        }
        reader.readAsDataURL(e.target.files[0])
    
    }
        return (
        <>
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
        <div id="preloder">
                <div className="loader"></div>
            </div><Header Infoforheader={infoforheader} />
            <div className="container rounded bg-white mt-5 mb-5" ></div>
            <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5 rounded-circle">
                        <img className="rounded-circle mt-5" src={!update ? photo : src} alt='wait 10 sec then change the photo'></img>
                        <input type="file" accept="image/*" name="image-upload" id="input" onChange={imageHandler} />
                    <i className="far fa-file-image"></i>
					<div classNameName="label">
                            <label classNameName="image-upload" htmlFor="input">
					</label>
                            </div>
                            <span className="font-weight-bold text-white-50">{Username}</span>
                            <span className="text-white-50">{Email}</span><span> </span></div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right ">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6"><label className="labels text-white-50">First Name</label>
                                    <input className="form-control"
                                    value={FirstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    type="text" 
                                    placeholder="First name"/></div>
                                <div className="col-md-6"><label className="labels text-white-50">Family name</label>
                                    <input type="text" 
                                    className="form-control"
                                    value={SecondName}
                                    onChange={(e) => setSecondName(e.target.value)}
                                    placeholder="Family name"/></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className="labels text-white-50">Which you like more</label>
                                    <input className="form-control"
                                    value={MorA}
                                    onChange={(e) => setMorA(e.target.value)}
                                    type="text"
                                    placeholder="Manga or anime"/></div>
                                <div className="col-md-12">
                                    <label className="labels text-white-50">Gender</label>
                                    <input type="text" className="form-control" 
                                    value={Gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    placeholder="enter your Gender"/></div>
                                <div className="col-md-12">
                                    <label className="labels text-white-50">How old are you?</label>
                                    <input type="number" className="form-control" onKeyDown="return event.keyCode !== 69"
                                    value={Age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="Age : Numbers only"/></div>
                                <div className="col-md-12">
                                    <label className="labels text-white-50">Email</label>
                                    <input className="form-control" 
                                    value={Emailtosend}
                                    onChange={(e) => setEmailtosend(e.target.value)}
                                    type="email"
                                    placeholder="enter new email"/></div>
                                <div className="col-md-12">
                                    <label className="labels text-white-50">Username</label>
                                    <input type="text" className="form-control" 
                                    value={Usernametosend}
                                    onChange={(e) => setUsernametosend(e.target.value)}
                                    placeholder="new Username" /></div>
                                <div className="col-md-12">
                                    <label className="labels text-white-50">password</label>
                                    <input type="password" className="form-control" 
                                    value={Newpassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="new password"/></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12"><label className="labels text-white-50">Country</label>
                                    <input type="text" className="form-control" 
                                    value={Country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder="Country"/></div>
                                
                            </div>
                            
                            <div className="mt-5 text-center">{ ShowHelpText ?
                                <label className="labels text-white-50">{HelpText}</label> : null
                            } </div>
                            
                            <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="button" onClick={checkingEverything}>Save Profile</button></div>
                            <div className="col-md-4">
                        </div>
                            
                            <Popup trigger={ButtonPopup} setTrigger={setButtonPopup}>
                                <h2 className="text-center">Confrim your password</h2> 
                                <div className="row mt-3">
                                    <div className="col-md-12">
                                        <input type="password" className="form-control" 
                                        value={ConfrimPasssword}
                                        onChange={(e) => setConfrimPasssword(e.target.value)}
                                        placeholder="Password:"/>
                                        <input type="password" className="form-control" 
                                        value={ConfrimPasssword2}
                                        onChange={(e) => setConfrimPasssword2(e.target.value)}
                                        placeholder="Again:"/>
                                    </div>
                                </div>
                                    <div className="modal-footer">
                                        {
                                            Show_Error ?  <h7 className="text-left text-black-50">Error : {ErrortoDisplay}</h7>  : null
                                        }
                                    <button type="button" className="btn btn-primary" onClick={ConfrimAllpassword}>Save changes</button>
                                    </div>
                            </Popup>
    
    
                        </div>
                    </div>      
                </div>
                <Footer />
                </ThemeProvider>
                </>
                    )
    }
    export default Edit_Profile