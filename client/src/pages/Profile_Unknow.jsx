import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import '../pages-css/profile.css'
import { useNavigate,Link,useParams } from 'react-router-dom'
import Footer  from './footer'
import Header from './header'
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';
const Clienturl='http://localhost:3000/'

const Profile_Unknow = ({ data }) => {
    const nav=useNavigate();
    let {Name}=useParams() //for :id
	/*conditions for header 
    profile page is logoutava:false,firsttime:false 
    logout page is profileava:true,firsttime:true 
    anything else will be everything true 
    */
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

    const [StartShowing,setStartShowing]=useState(false);
    const [User,setUser]=useState();
    var doitonce=true;

    /*************************
     *   Follow & Unfollow   *
     *                       *   
     *************************/
    const [Following,setFollowing]=useState(false)
    const [UnFollowing,setUnFollowing]=useState(false)
    const FollowThisPerson=async (e)=>{
        e.preventDefault()
       if(data.User && data.isloggedin.isloggedin &&data.User.name!==Name){
            if(data.User.source === 'google'){
                try{
                await  fetch("http://localhost:5000/auth/followthisuser", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                        name:Name,
                                        id:data.User._id
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    setFollowing(true)
                                    setUnFollowing(false);
                                    return;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                }catch(err){
                    console.log(err)
                }
            }
            else{
                try{
                    await  fetch("http://localhost:5000/api/followthisuser", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            name:Name,
                                            id:data.User._id
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                        setFollowing(true)
                                        setUnFollowing(false);
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                    }catch(err){
                        console.log(err)
                    } 
            }
       }
    }
    const RemoveFollowThisPerson=async (e)=>{
        e.preventDefault()
        if(data.User && data.isloggedin.isloggedin &&data.User.name!==Name){
            if(data.User.source === 'google'){
                try{
                await  fetch("http://localhost:5000/auth/Removefollowthisuser", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                        name:Name,
                                        id:data.User._id
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    setFollowing(false)
                                    return;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                }catch(err){
                    console.log(err)
                }
            }
            else{
                try{
                    await  fetch("http://localhost:5000/api/Removefollowthisuser", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            name:Name,
                                            id:data.User._id
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                        setFollowing(false)
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                    }catch(err){
                        console.log(err)
                    } 
            }
       }
    }
    
    
    const UnFollowThisPerson=async (e)=>{
        e.preventDefault()
        if(data.User && data.isloggedin.isloggedin &&data.User.name!==Name){
            if(data.User.source === 'google'){
                try{
                await  fetch("http://localhost:5000/auth/unfollowthisuser", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                        name:Name,
                                        id:data.User._id
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    setUnFollowing(true)
                                    setFollowing(false)
                                    return;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                }catch(err){
                    console.log(err)
                }
            }
            else{
                try{
                    await  fetch("http://localhost:5000/api/unfollowthisuser", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            name:Name,
                                            id:data.User._id
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                        setUnFollowing(true)
                                        setFollowing(false)
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                    }catch(err){
                        console.log(err)
                    } 
            }
       }
        
    }
    const RemoveUnFollowThisPerson=async (e)=>{
        e.preventDefault()
        if(data.User && data.isloggedin.isloggedin &&data.User.name!==Name){
            if(data.User.source === 'google'){
                try{
                await  fetch("http://localhost:5000/auth/Removeunfollowthisuser", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                        name:Name,
                                        id:data.User._id
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    setUnFollowing(false)
                                    return;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                }catch(err){
                    console.log(err)
                }
            }
            else{
                try{
                    await  fetch("http://localhost:5000/api/Removeunfollowthisuser", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            name:Name,
                                            id:data.User._id
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                        setUnFollowing(false)
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                    }catch(err){
                        console.log(err)
                    } 
            }
       }
       
    }
    /****************************/


        /********************************
        GO TO ANOTHER PROFILE 
        ********************************/
        const GoToProfile=(e,username)=> {
            e.preventDefault();
            nav('/profile/name='+username)
            window.location.reload(false);
        }


        /*********************************/


    /*************************
     *     tabs for showing  *
     *                       *   
     *************************/

    const [ShowMangasLiked,setShowMangasLiked]=useState(false)
    const [ShowComments,setShowComments]=useState(false)
    const [ShowAnimeLiked,setShowAnimeLiked]=useState(false)
    const [ShowFollowers,setShowFollowers]=useState(false)

    const [MangasLiked,setMangasLiked]=useState([]);
    
    
    const [Comments,setComments]=useState([]);
    const [CommentsDislike,setCommentsDislike]=useState([]);
    const [AnimeLiked,setAnimeLiked]=useState([]);
    const [Followers,setFollowers]=useState([]);
    const [UnFollowers,setUnFollowers]=useState([]);


    const SwitchShowMangasLiked=(e)=>{
        e.preventDefault();
        setShowComments(false)
        setShowAnimeLiked(false)
        setShowFollowers(false)
        setShowMangasLiked(true)
        try{
            User.MangaLiked.map(async (value,index)=>{
                await  fetch("http://localhost:5001/m/findbyname", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                       name:value
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    if(User.MangaLiked.length !== MangasLiked.length ){
                                        setMangasLiked((manga) => [...manga,
                                        resObject]) 
                                    }
                                    return;
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                            })
            }catch(err){
                            console.log(err)
            } 
    }
    const SwitchShowComments=(e)=>{
        e.preventDefault();
        setShowComments(true)
        setShowAnimeLiked(false)
        setShowFollowers(false)
        setShowMangasLiked(false)
        try{
            User.Like.map(async (value,index)=>{
                await  fetch("http://localhost:5001/comments/findbyid", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                       id:value
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    if(Comments.length <= User.Like.length){
                                        setComments((comment) => [...comment,
                                        resObject]) 
                                    }
                                    return;
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
            })
            User.Dislike.map(async (value,index)=>{
                await  fetch("http://localhost:5001/comments/findbyid", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                       id:value
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    if( CommentsDislike.length  <= User.Dislike.length){
                                        setCommentsDislike((commentd) => [...commentd,
                                        resObject]) 
                                    }
                                    return;
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
            })
            }catch(err){
                            console.log(err)
            } 
    }
    const SwitchShowAnimeLiked=(e)=>{
        e.preventDefault();
        setShowComments(false)
        setShowAnimeLiked(true)
        setShowFollowers(false)
        setShowMangasLiked(false)
    }
    const SwitchShowFollowers=(e)=>{
        e.preventDefault();
        setShowComments(false)
        setShowAnimeLiked(false)
        setShowFollowers(true)
        setShowMangasLiked(false)
        try{
            if(User.source ==='google') {
                User.Following.map(async (value,index)=>{
                    await fetch("http://localhost:5000/auth/finduser", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                        name:value
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    if(Followers.length <=  User.Following.length){
                                        setFollowers((follow) => [...follow,
                                            resObject])
                                    }
                                    return;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                })
                User.UnFollowing.map(async (value,index)=>{
                    await fetch("http://localhost:5000/auth/finduser", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                        name:value
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    if(UnFollowers.length <= User.UnFollowing.length){
                                        setUnFollowers((unfollow) => [...unfollow,
                                            resObject])
                                    }
                                    return;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                })
            }
            if(User.source === 'website'){
                User.Following.map(async (value,index)=>{
                    await fetch("http://localhost:5000/api/finduser", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                        name:value
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    if(Followers.length <=  User.Following.length){
                                        setFollowers((follow) => [...follow,
                                            resObject])
                                    }
                                    return;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                })
                User.UnFollowing.map(async (value,index)=>{
                    await fetch("http://localhost:5000/api/finduser", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Credentials": true,
                        },body:JSON.stringify({
                            name:value
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    if(UnFollowers.length !==  User.UnFollowing.length){
                                        console.log(resObject)
                                        setUnFollowers((unfollow) => [...unfollow,
                                            resObject])
                                    }
                                    return;
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                })
            }
        }catch(err){
            console.log(err)
        }
    }
    /****************************/



    var t=setTimeout(() =>{
        if(data.User && data.isloggedin.isloggedin && doitonce){
            doitonce=false;
            data.User.Following.map((value,index)=>{
                if(value===Name){
                    setFollowing(true);
                    setUnFollowing(false);
                }
            })
            data.User.UnFollowing.map((value,index)=>{
                if(value===Name){
                    setFollowing(false);
                    setUnFollowing(true);
                }
            })
        }
        setStartShowing(true);
    },5000)
    if(StartShowing){      
        clearTimeout(t);
        t=null;
    }
    const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true};
	
    useEffect(()=>{
        
        try{
            fetch("http://localhost:5000/auth/finduser", {
							method: "POST",
							credentials: "include",
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								"Access-Control-Allow-Credentials": true,
							},body:JSON.stringify({
                                name:Name
                            }),
						})
						.then((response) => {
							if (response.status === 200) return response.json();
						})
						.then((resObject) => {
                            setUser(resObject)
							return;
							})
							.catch((err) => {
								console.log(err);
							});
        }catch(err){
            console.log(err)
        }
        
        
    },[])
    
    if(!StartShowing){
        return  (<div id="preloder">
        <div className="loader">Loading</div>
    </div>
    );
    }
    
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

                            {
                                Following && (!UnFollowing) ? <a className="btn btn-xs btn-info mb-4" onClick={(e)=>RemoveFollowThisPerson(e)}>Following<i className="fas fa-heart" style={{marginLeft: '4px',color:'black'}}></i></a>
                                :<a className="btn btn-xs btn-info mb-4"onClick={(e)=>FollowThisPerson(e)}>Follow<i className="far fa-heart" style={{marginLeft: '4px'}}></i></a>
                            }
                            {
                                UnFollowing && (!Following) ? <a className="btn btn-xs btn-info mb-4" onClick={(e)=>RemoveUnFollowThisPerson(e)} style={{marginLeft:'10px'}}>UnFollowing<i className="fas fa-heart-broken" style={{marginLeft: '4px',color:'black'}}></i></a> :
                                <a className="btn btn-xs btn-info mb-4" onClick={(e)=>UnFollowThisPerson(e)} style={{marginLeft:'10px'}}>UnFollow<i className="fas fa-heart-broken" style={{marginLeft: '4px'}}></i></a>
                            }
                            
                        </div>
                    </div>

                    <ul className="profile-header-tab nav nav-tabs">
                        {
                            ShowComments ? 
                            <li className="nav-item"><a onClick={(e)=>SwitchShowComments(e)} className="nav-link active show" data-toggle="tab" style={{cursor:'pointer'}}>COMMENTS</a></li>
                            :<li className="nav-item"><a  onClick={(e)=>SwitchShowComments(e)} className="nav-link" data-toggle="tab"style={{cursor:'pointer'}}>COMMENTS</a></li>
                        }
                        {/* <!-- go to bottom profile page --> */}
                        {/* <li className="nav-item"><a href="#profile-about" className="nav-link" data-toggle="tab">ABOUT</a></li> */}
                        {
                            ShowMangasLiked ?  <li className="nav-item"><a onClick={(e)=>SwitchShowMangasLiked(e)} className="nav-link active show" data-toggle="tab"style={{cursor:'pointer'}}>MANGA</a></li>
                            :  <li className="nav-item"><a className="nav-link" onClick={(e)=>SwitchShowMangasLiked(e)} data-toggle="tab"style={{cursor:'pointer'}}>MANGA</a></li>
                        }
                        {
                            ShowAnimeLiked ? <li className="nav-item"><a onClick={(e)=>SwitchShowAnimeLiked(e)} className="nav-link active show" data-toggle="tab"style={{cursor:'pointer'}}>ANIME</a></li>
                            : <li className="nav-item"><a className="nav-link"  onClick={(e)=>SwitchShowAnimeLiked(e)} data-toggle="tab"style={{cursor:'pointer'}}>ANIME</a></li>
                        }
                        {
                            ShowFollowers ? <li className="nav-item"><a  onClick={(e)=>SwitchShowFollowers(e)}  className="nav-link active show" data-toggle="tab"style={{cursor:'pointer'}}>Followers</a></li>
                            : <li className="nav-item"><a  className="nav-link" onClick={(e)=>SwitchShowFollowers(e)} data-toggle="tab"style={{cursor:'pointer'}}>Followers</a></li>
                        }
                    </ul>
                </div>

                <div className="profile-container">
                    <div className="row row-space-20">
                       
                        <div className="col-md-8">
                            <div className="tab-content p-0">
                                <div className="row">
                                {    
                                    ShowMangasLiked && MangasLiked.length >0 ? 
                                    MangasLiked.map((manganow,index2)=>{
                                        return(
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                            <div className="product__item">
                                            <div onClick={()=>{nav('/manga/'+manganow[0].Name)}} className="product__item__pic" key={manganow[0].Name} style={{ backgroundImage: `url(${manganow[0].PictureLink})`,cursor: 'pointer' }}>
                                                    <div  className="ep">{manganow[0].data[manganow[0].data.length -1].counter} / 18</div>
                                                    <div className="comment"><i className="fa fa-comments"></i> 11</div>
                                                    <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                </div>
                                                <div className="product__item__text">
                                                    <ul>
                                                        <li>Active</li>
                                                        <li>Movie</li>
                                                    </ul>
                                                    <h5><Link to={'/manga/'+manganow[0].Name}>{manganow[0].Name}</Link></h5>
                                                </div>
                                            </div>
                                        </div>
                                        );
                                    }) : null
                                }
                                </div>

                                {
                                     ShowComments && Comments.length > 0 ? 
                                     <div className="section-title">              
                                     <h5>Comments Liked ({Comments.length})</h5>
                                 </div> : null
                                }

                                {
                                    ShowComments && Comments.length > 0 ? 
                                    Comments.map((com,index)=>{
                                        return(
                                    <div key={com._id} className="anime__review__item"> 
                                    <div className="anime__review__item__pic">
                                        <img src={com.PictureLink} alt="justsomeimages" style={{cursor: 'pointer'}} onClick={(e)=>GoToProfile(e,com.username)}/>  
                                    </div>
                                    <div className="anime__review__item__text">
                                            <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                            <p>{com.commentdata}</p>
                                    </div>
                                    </div>
                                        )
                                    })
                                        :null
                                }

                                {
                                     ShowComments && CommentsDislike.length > 0 ? 
                                     <div className="section-title">              
                                     <h5>Comments Disliked ({CommentsDislike.length})</h5>
                                 </div> : null
                                }
                                
                                {
                                    ShowComments && CommentsDislike.length > 0 ? 
                                    CommentsDislike.map((com,index)=>{
                                        return(
                                    <div key={com._id} className="anime__review__item"> 
                                    <div className="anime__review__item__pic">
                                        <img src={com.PictureLink} alt="justsomeimages" style={{cursor: 'pointer'}} onClick={(e)=>GoToProfile(e,com.username)}/>  
                                    </div>
                                    <div className="anime__review__item__text">
                                            <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                            <p>{com.commentdata}</p>
                                    </div>
                                    </div>
                                        )
                                    })
                                        :null
                                }


                                {
                                    ShowAnimeLiked && AnimeLiked.length > 0 ? <h1>hello</h1>:null
                                }
                               
                                {
                                     ShowFollowers && (Followers.length>0 ) ? 
                                     <div className="section-title">              
                                     <h5>Following({Followers.length})</h5>
                                 </div> : null
                                }


                                <div className="row">
                                {
                                    ShowFollowers && (Followers.length>0 ) ? 
                                    Followers.map((value, index)=>{
                                        return(
                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                            <div className="product__item">
                                                <div onClick={(e)=>GoToProfile(e,value.name)} className="product__item__pic" key={value.name} style={{ backgroundImage: `url(${value.photo})`,cursor: 'pointer' , width: '500px'}}>
                                                    <div className="comment"><i className="fas fa-heart-broken" style={{ color:'black'}}></i>  {value.name}</div>  
                                                </div>
                                            </div>
                                        </div>)
                                    }) :null
                                }
                                </div>

                                    {
                                        ShowFollowers && (UnFollowers.length>0 ) ? 
                                        <div className="section-title">              
                                            <h5>Not Following({UnFollowers.length})</h5>
                                        </div>
                                    :null
                                    }


                                     <div className="row">
                                {
                                    ShowFollowers && (UnFollowers.length>0 ) ? 
                                    UnFollowers.map((value, index)=>{
                                        return(
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="product__item">
                                        <div onClick={(e)=>GoToProfile(e,value.name)} className="product__item__pic" key={value.name} style={{ backgroundImage: `url(${value.photo})`,cursor: 'pointer' , backgroundSize: 'cover' , width:'200px',height:'200px'}}>
                                            <div className="comment"><i className="fas fa-heart-broken" style={{ color:'black'}}></i>  {value.name}</div>  
                                            </div>
                                        </div>
                                    </div>
                                        )
                                    }) 
                                    :null
                                }
                                   
                                </div>

                            </div>
                        </div>
                            
                        <div className="col-md-4 hidden-xs hidden-sm">
                            <ul className="profile-info-list">
                                <li className="title">PERSONAL INFORMATION</li>
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
        </ThemeProvider>
        </>
	)
}

export default Profile_Unknow
