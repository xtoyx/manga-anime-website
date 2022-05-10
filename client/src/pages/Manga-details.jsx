import { useEffect, useState } from 'react'
import { Link , useParams ,useNavigate, Navigate} from 'react-router-dom';
import '../pages-css/Home.css'

import Footer from "./footer";
import Header from "./header";
import StarsRating from '../components/StarsRating/StarsRating.jsx'
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';

function Manga_details({data}) {
	
/*conditions for header 
    profile page is logoutava:true,firsttime:false,profile:false
    logout page is profileava:true,firsttime:true ,logoutava:false
    anything else will be everything true 
    */
    const [What_SizeIsIt,setWhat_SizeIsIt]=useState('Normal');

   const [AdminExists,setAdminExists]=useState(false);
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
    function useWindowSize(){
        const [size,setSize]=useState([window.innerHeight,window.innerWidth]);
        useEffect(()=>{
            const handleResize=()=>{
                setSize([window.innerHeight,window.innerWidth])
             }
             window.addEventListener('resize',handleResize)
     },[])
     return size;
 } 
    useEffect(() => {
         if(width >  992 && width < 1119){
             setWhat_SizeIsIt('Meduim')
         } else if(width > 768 && width < 991){
             setWhat_SizeIsIt('Tablet')
         } else if(width < 767 && width > 480){
             setWhat_SizeIsIt('Wide Mobile')
         } else if(width < 479 ){
             setWhat_SizeIsIt('Small Mobile')
         } else {setWhat_SizeIsIt('Normal')}
     },[])
 
     
     const [height,width]=useWindowSize();
    const nav=useNavigate();
    const [StartShowing,setStartShowing]=useState(false);
    const {title}=useParams();
    const [FollowingManga,setFollowingManga]=useState(false);
    const [Url,setUrl] = useState();
    /* comments side */
    const [IsThereComments,setIsThereComments]=useState(true);
    const [Comments,setComments]=useState();
    const [AddComment,setAddComment]=useState();
    const [AddReply,setAddReply]=useState();
    const [WhoIsItReplying,setWhoIsItReplying]=useState();
    const [ShowReplyTextArea,setShowReplyTextArea]=useState(false);
    const [commentuser,setCommentUser]=useState();
    const [value, setValue] = useState(true);
    const [Waitcoolodwn,setWaitcooldown]= useState(false);
    const [TimerWaitcoolodwn,setTimerWaitcooldown]= useState(false);   
    const [EditActive,setEditActive]=useState();
    const [ShowEditedSide,setShowEditedSide]= useState(false);
    var Today=new Date();
    const [ActiveCommentorReply,setActiveCommentorReply]=useState(JSON.parse(localStorage.getItem('Active')));    
    const [LengthofComments,setLengthOfComments]= useState();
    /* ********************************/

    /*Like Or Dislike*/
    const [LocationCheckLike,setLocationCheckLike]=useState([]);
    const [LocationCheckDislike,setLocationCheckDislike]=useState([]);
    const [FirstTime1,setFirstTime1]=useState(true);
    const [FirstTime2,setFirstTime2]=useState(true);
    const [Liked,setLiked]=useState([]);
    const [Disliked,setDisliked]=useState([]);
    /*****************/

    /* Chapters */
    let restofmangastoshowmore=[];
    const [ShowMore, setShowMore] = useState(false);
    const [Changed,setChanged]=useState('Show More');
    const ShowMoreNow=()=>{
        if(ShowMore){
            setShowMore(false);
            setChanged('Show More')
        }
        else{
            setShowMore(true);
            setChanged('Show Less')
        }
    }
    /*********************************/

     /* Download Files */
     const [checked, setChecked] = useState([]);
    /*********************************/
    var WhatManga;
    var Genre;
    const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true};
    
    var t=setTimeout(() =>{
    setStartShowing(true);
        setActiveCommentorReply(JSON.parse(localStorage.getItem('Active')))
        if(data.User){
            setCommentUser(data.User.name);
        }
    },5000)
    if(StartShowing){  
        if(data.User && Comments){ 
            if(LocationCheckLike.length == 0 && FirstTime1){
                if(findCommonElements3(Comments,data.User.Like)){
                            setFirstTime1(false)
                            setLocationCheckLike(data.User.Like)
                            
                        }
                }
            if(LocationCheckDislike.length ==0 && FirstTime2){
                    if(findCommonElements3(Comments,data.User.Dislike)){
                            setFirstTime2(false)
                            setLocationCheckDislike(data.User.Dislike)
                        }
                        
                }
                
        }
        if(data.Mangas){
            data.Mangas.map((value,index)=>{
                if(value.Name == title){
                    WhatManga = value;
                    Genre=value.Genre.join(",  ")
                }
            })
        }
            if(FirstTime1 && data.Mangas){
                var helppppp=[];
                WhatManga.data.map((value,index)=>{
                    helppppp.push({id:index,checked:false})
                })
                setChecked(helppppp)
                setFirstTime1(false)
            }
            clearTimeout(t);
            t=null;
       }
       function findCommonElements3(arr1, arr2) {
        return arr1.some(item => arr2.includes(item._id))
    }
       /*comments */
       useEffect(()=>{
        
        try{
            fetch("http://localhost:5001/comments/find", {
							method: "POST",
							credentials: "include",
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								"Access-Control-Allow-Credentials": true,
							},body:JSON.stringify({
                                title,
                                idk:0
                            }),
						})
						.then((response) => {
							if (response.status === 200) return response.json();
						})
						.then((resObject) => {
                            if(resObject.length >0){
                                setIsThereComments(true)
                                var commentsonly=[];
                                var replyonly=[];
                                var mixed=[];
                                resObject.map((value,index)=>{
                                    if(!value.Replyto){
                                        commentsonly.push(value); // getting only comments
                                    }
                                    else {
                                        replyonly.push(value) // getting only reply
                                    }
                                })
                                commentsonly.map((value, index)=>{
                                    mixed.push(value);
                                    replyonly.map((reply, postion)=>{
                                        if(value.username == reply.Replyto){
                                            mixed.push(reply)
                                        }
                                    })
                                })
                                setComments(mixed);
                                mixed.map((value,index)=>{
                                    setLiked((like) => [...like,
                                        {count:0,id:value._id}]) 
                                    setDisliked((dislike) => [...dislike,
                                        {count:0,id:value._id}])  
                                })
                            }
                            else{
                                setIsThereComments(false)
                            }
							return;
							})
							.catch((err) => {
								console.log(err);
							});
        }catch(err){
            console.log(err)
        }
        try{
            fetch("http://localhost:5001/comments/length", {
							method: "POST",
							credentials: "include",
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
								"Access-Control-Allow-Credentials": true,
							},body:JSON.stringify({
                                title
                            }),
						})
						.then((response) => {
							if (response.status === 200) return response.json();
						})
						.then((resObject) => {
                            setLengthOfComments(resObject)
							return;
							})
							.catch((err) => {
								console.log(err);
							});
        }catch(err){
            console.log(err)
        }
        const getAdminChecking = () =>{
            try {
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
                            setAdminExists(true);
                            console.log('logged as Admin website')
                        }
                        return;
                        })
                        .catch((err) => {
                            console.log(err);
                        });
            }catch(err){
                console.log("error : in website login"+err);
            }
        }
        getAdminChecking();
    },[])
    if(!TimerWaitcoolodwn){

        var t2=setTimeout(() => {
            if(CheckTimer())setTimerWaitcooldown(true)
        },5000)
    }
    if(TimerWaitcoolodwn){
        clearTimeout(t2);
        t2=null;
    }

    const AddComment2=(e)=>{
        e.preventDefault();
        if(!Waitcoolodwn || !localStorage.getItem('Waiting')){
            if(data.User){
                if(AddComment != '' && AddComment){
                    const commentdata = AddComment;
                    const username = data.User.name;
                    const pictureLink = data.User.photo;
                    StartTimer(commentdata, username, pictureLink);
                    const Manga = title;
                    const Replyto=null;
                    const HowMany = 0; //change it to the pagesnumber 
                    try{
                        fetch("http://localhost:5001/comments/add", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            commentdata,
                                            username,
                                            pictureLink,
                                            Replyto,
                                            Manga,
                                            HowMany
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                        setAddComment('');
                                        console.log('added Comment')
                                        window.location.reload(false);
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                    }catch(err){
                        console.log(err)
                    }
                }
            } else{
                alert("Please log in To Comment / if you see this how did you do it?????")
            }
        }
    }
    const ReplytoWho=(e,whoisit,locationofid)=>{

        e.preventDefault();
        //put a popup if there no user 
        if(data.User){
            setWhoIsItReplying(locationofid);
            setShowReplyTextArea(true)
        } else{
            alert("Please log in To Reply")
        }
    }
    const CancelReplytoWho=(e)=>{
        e.preventDefault();
        //put a popup if there no user 
        if(data.User){
            setWhoIsItReplying();
            setShowReplyTextArea(!ShowReplyTextArea)
        } else{
            alert("Please log in To Reply")
        }
    }
    const AddReplytosomeome=(e,whoisit)=>{
        e.preventDefault()
        if(!Waitcoolodwn || !localStorage.getItem('Waiting')){
            if(AddReply != '' && AddReply){
                const commentdata = AddReply;
                const username = data.User.name;
                const pictureLink = data.User.photo;
                StartTimer(AddReply,username,pictureLink);
                const Manga = title;
                const Replyto=whoisit;
                const HowMany = 0; //change it to the pagesnumber 
                try{
                    fetch("http://localhost:5001/comments/add", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                        "Access-Control-Allow-Credentials": true,
                                    },body:JSON.stringify({
                                        commentdata,
                                        username,
                                        pictureLink,
                                        Replyto,
                                        Manga,
                                        HowMany
                                    }),
                                })
                                .then((response) => {
                                    if (response.status === 200) return response.json();
                                })
                                .then((resObject) => {
                                    setAddReply('');
                                    console.log('added Reply')
                                    window.location.reload(false);
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

    /* Timer set to 2 mins */
    const StartTimer=(commentdata,name,picturelink)=>{
        var test3={
            Hours:Today.getHours(),
            Minutes:Today.getMinutes()+5,
            Seconds:Today.getSeconds()
        }
        var test4={
            name:name,
            commentdata:commentdata,
            picturelink:picturelink
        }
        localStorage.setItem('TimeUntil',JSON.stringify(test3))
        localStorage.setItem('Waiting',true)
        localStorage.setItem('Active',JSON.stringify(test4))
        setWaitcooldown(true);
    }

    const CheckTimer=()=>{
        var test1=JSON.parse(localStorage.getItem('TimeUntil'))
        var test2={
            Hours:Today.getHours(),
            Minutes:Today.getMinutes(),
            Seconds:Today.getSeconds()
        }
        if(test1 &&((test2.Minutes-test1.Minutes) >= 0 && (test2.Seconds-test1.Seconds) >= 0)){
            localStorage.removeItem('Active');
            localStorage.removeItem('TimeUntil');
            localStorage.removeItem('Waiting');

            console.log('Time passed')
            return true
        }
        return false
    }


    const RemoveCommentorReply=(e,username,comment,picture,pages,id)=>{
        e.preventDefault();
        
        try{
            fetch("http://localhost:5001/comments/del", {
                            method: "DELETE",
                            credentials: "include",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Credentials": true,
                            },body:JSON.stringify({
                                id
                            }),
                        })
                        .then((response) => {
                            if (response.status === 200) return response.json();
                        })
                        .then((resObject) => {
                            localStorage.removeItem('Active');
                            localStorage.removeItem('TimeUntil');
                            localStorage.removeItem('Waiting');
                            console.log('Removed Successfully')
                            window.location.reload(false);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
        }catch(err){
            console.log(err)
        }
    }
    const EditCommentorReply=(e)=>{
        e.preventDefault();
        setShowEditedSide(true)
    }

    const EditCommentNow=(e,username,comment,picture
        ,pages,id)=>{
            e.preventDefault();
        if(EditActive){
            try{
                fetch("http://localhost:5001/comments/edit", {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    "Access-Control-Allow-Credentials": true,
                                },body:JSON.stringify({
                                    id,
                                    EditActive
                                }),
                            })
                            .then((response) => {
                                if (response.status === 200) return response.json();
                            })
                            .then((resObject) => {
                            localStorage.removeItem('Active');
                            localStorage.removeItem('TimeUntil');
                            localStorage.removeItem('Waiting');
                            StartTimer(EditActive, username, picture);
                                console.log('Edited Successfully')
                                window.location.reload(false);
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
            }catch(err){
                console.log(err)
            }
        }
    }
    /*************/

       const FollowThisManga=(e)=>{
        e.preventDefault();
        if(FollowingManga){
            if(data.isloggedin.isloggedin){
                if(data.User.source == 'google'){
                    //fetch a post send data with name manga ,username And Id
                    try{
                        fetch("http://localhost:5000/auth/AddFollow", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            title,
                                            id:data.User._id,
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                        console.log('Followed Added')
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                    }catch(err){
                        console.log(err)
                    }
                }
                if(data.User.source == 'website'){
                    //fetch a post send data with name manga ,username And Id
                    try{
                        fetch("http://localhost:5000/api/AddFollow", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            title,
                                            id:data.User._id,
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                        console.log('Good Added')
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
        }else{
         if(data.isloggedin.isloggedin){
             if(data.User.source == 'google'){
                 //fetch a post send data with name manga ,username And Id
                 try{
                     fetch("http://localhost:5000/auth/RemoveFollow", {
                                     method: "POST",
                                     credentials: "include",
                                     headers: {
                                         Accept: "application/json",
                                         "Content-Type": "application/json",
                                         "Access-Control-Allow-Credentials": true,
                                     },body:JSON.stringify({
                                         title,
                                         id:data.User._id,
                                     }),
                                 })
                                 .then((response) => {
                                     if (response.status === 200) return response.json();
                                 })
                                 .then((resObject) => {
                                     console.log('Good Added')
                                     return;
                                     })
                                     .catch((err) => {
                                         console.log(err);
                                     });
                 }catch(err){
                     console.log(err)
                 }
             }
             if(data.User.source == 'website'){
                 //fetch a post send data with name manga ,username And Id
                 try{
                     fetch("http://localhost:5000/api/RemoveFollow", {
                                     method: "POST",
                                     credentials: "include",
                                     headers: {
                                         Accept: "application/json",
                                         "Content-Type": "application/json",
                                         "Access-Control-Allow-Credentials": true,
                                     },body:JSON.stringify({
                                         title,
                                         id:data.User._id,
                                     }),
                                 })
                                 .then((response) => {
                                     if (response.status === 200) return response.json();
                                 })
                                 .then((resObject) => {
                                     console.log('Good Added')
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
         setFollowingManga(!FollowingManga)
        }

        const AddViewUp=(e)=>{
        e.preventDefault();
        try{
            fetch("http://localhost:5001/m/Viewup", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Credentials": true,
                            },body:JSON.stringify({
                                title,
                            }),
                        })
                        .then((response) => {
                            if (response.status === 200) return response.json();
                        })
                        .then((resObject) => {
                            console.log('Added One View')
                            nav('pages/1')
                            return;
                            })
                            .catch((err) => {
                                console.log(err);
                            });
        }catch(err){
            console.log(err)
        }
        }

        /*Like or Dislike */
        const AddLikeForComment=async (e,id)=>{
            e.preventDefault();
            if(data.isloggedin.isloggedin){
                if(!LocationCheckLike.includes(id)){
                    try{
                        await  fetch("http://localhost:5000/auth/AddLike", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            id:data.User._id,
                                            commentid:id
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                       setLocationCheckLike(oldarr => [...oldarr,(id)])
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                        await  fetch("http://localhost:5001/comments/AddLike", {
                                            method: "POST",
                                            credentials: "include",
                                            headers: {
                                                Accept: "application/json",
                                                "Content-Type": "application/json",
                                                "Access-Control-Allow-Credentials": true,
                                            },body:JSON.stringify({
                                               id
                                            }),
                                        })
                                        .then((response) => {
                                            if (response.status === 200) return response.json();
                                        })
                                        .then((resObject) => {                            
                                            setLiked(
                                                        Liked.map((like)=>
                                                        like.id === id ?{...like,count:resObject.Likecounter} :{...like})
                                            ) 
                                            return;
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });
                    }catch(err){
                        console.log(err)
                    }
                } 
                if(LocationCheckDislike.includes(id)){
                    try{
                        await   fetch("http://localhost:5000/auth/RemoveDislike", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            id:data.User._id,
                                            commentid:id
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                       setLocationCheckDislike(LocationCheckDislike.filter((f)=>(f !== id)))
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                        await  fetch("http://localhost:5001/comments/ReDislikeAddLike", {
                                                method: "POST",
                                                credentials: "include",
                                                headers: {
                                                    Accept: "application/json",
                                                    "Content-Type": "application/json",
                                                    "Access-Control-Allow-Credentials": true,
                                                },body:JSON.stringify({
                                                   id
                                                }),
                                            })
                                            .then((response) => {
                                                if (response.status === 200) return response.json();
                                            })
                                            .then((resObject) => {
                                                setDisliked(
                                                    Disliked.map((dislike)=>
                                                    dislike.id === id ?{...dislike,count:resObject.Dislikecounter} :{...dislike})
                                                )
                                                setLiked(
                                                    Liked.map((like)=>
                                                    like.id === id ?{...like,count:resObject.Likecounter} :{...like})
                                                ) 
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
        const RemoveLikeForComment=async (e,id)=>{
            e.preventDefault();
            if(data.isloggedin.isloggedin){
                if(LocationCheckLike.includes(id)){
                    try{
                        await   fetch("http://localhost:5000/auth/RemoveLike", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            id:data.User._id,
                                            commentid:id
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                       setLocationCheckLike(LocationCheckLike.filter((fe)=>(fe !== id)))
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                await  fetch("http://localhost:5001/comments/ReduceLike", {
                                            method: "POST",
                                            credentials: "include",
                                            headers: {
                                                Accept: "application/json",
                                                "Content-Type": "application/json",
                                                "Access-Control-Allow-Credentials": true,
                                            },body:JSON.stringify({
                                               id
                                            }),
                                        })
                                        .then((response) => {
                                            if (response.status === 200) return response.json();
                                        })
                                        .then((resObject) => {
                                        setLiked(
                                            Liked.map((like)=>
                                            like.id === id ?{...like,count:resObject.Likecounter} :{...like})
                                        )
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
        const AddDisLikeForComment=async (e,id)=>{
            e.preventDefault();
            if(data.isloggedin.isloggedin){
                if(!LocationCheckDislike.includes(id)){
                    try{
                      await  fetch("http://localhost:5000/auth/AddDislike", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            id:data.User._id,
                                            commentid:id
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                       setLocationCheckDislike(oldarre => [...oldarre,(id)])
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                        
                    await  fetch("http://localhost:5001/comments/AddDislike", {
                                            method: "POST",
                                            credentials: "include",
                                            headers: {
                                                Accept: "application/json",
                                                "Content-Type": "application/json",
                                                "Access-Control-Allow-Credentials": true,
                                            },body:JSON.stringify({
                                               id
                                            }),
                                        })
                                        .then((response) => {
                                            if (response.status === 200) return response.json();
                                        })
                                        .then((resObject) => {
                                            setDisliked(
                                                Disliked.map((dislike)=>
                                                dislike.id === id ?{...dislike,count:resObject.Dislikecounter} :{...dislike})
                                            )
                                            return;
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });
                                        
                    }catch(err){
                        console.log(err)
                    }
                }
                if(LocationCheckLike.includes(id)){
                    try{
                        await   fetch("http://localhost:5000/auth/RemoveLike", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            id:data.User._id,
                                            commentid:id
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                       setLocationCheckLike(LocationCheckLike.filter((fe)=>(fe !== id)))
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                        await  fetch("http://localhost:5001/comments/ReLikeAddDislike", {
                                                method: "POST",
                                                credentials: "include",
                                                headers: {
                                                    Accept: "application/json",
                                                    "Content-Type": "application/json",
                                                    "Access-Control-Allow-Credentials": true,
                                                },body:JSON.stringify({
                                                   id
                                                }),
                                            })
                                            .then((response) => {
                                                if (response.status === 200) return response.json();
                                            })
                                            .then((resObject) => {
                                                setDisliked(
                                                    Disliked.map((dislike)=>
                                                    dislike.id === id ?{...dislike,count:resObject.Dislikecounter} :{...dislike})
                                                )
                                                setLiked(
                                                    Liked.map((like)=>
                                                    like.id === id ?{...like,count:resObject.Likecounter} :{...like})
                                                )
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
        const RemoveDisLikeForComment=async (e,id)=>{
            e.preventDefault();
            if(data.isloggedin.isloggedin){
                if(LocationCheckDislike.includes(id)){
                    try{
                        await   fetch("http://localhost:5000/auth/RemoveDislike", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json",
                                            "Access-Control-Allow-Credentials": true,
                                        },body:JSON.stringify({
                                            id:data.User._id,
                                            commentid:id
                                        }),
                                    })
                                    .then((response) => {
                                        if (response.status === 200) return response.json();
                                    })
                                    .then((resObject) => {
                                       setLocationCheckDislike(LocationCheckDislike.filter((f)=>(f !== id)))
                                        return;
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                    await  fetch("http://localhost:5001/comments/ReduceDislike", {
                                            method: "POST",
                                            credentials: "include",
                                            headers: {
                                                Accept: "application/json",
                                                "Content-Type": "application/json",
                                                "Access-Control-Allow-Credentials": true,
                                            },body:JSON.stringify({
                                               id
                                            }),
                                        })
                                        .then((response) => {
                                            if (response.status === 200) return response.json();
                                        })
                                        .then((resObject) => {
                                            setDisliked(
                                                Disliked.map((dislike)=>
                                                dislike.id === id ?{...dislike,count:resObject.Dislikecounter} :{...dislike})
                                            )
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
        /*********************************/


        /********************************
        GO TO ANOTHER PROFILE 
        ********************************/
        const GoToProfile=(e,username)=> {
            e.preventDefault();
            nav('/profile/name='+username)
        }


        /*********************************/

        /********************************
        Download Files
        ********************************/
        const GoToDownload=(e)=>{
            e.preventDefault();
            nav('/manga/'+title+'/Downloadpage');
        }
        const handleOnChange = (e,position) => {  
            if(position === 0){
                var helpmenow=[];
                if (e.target.checked) {
                    WhatManga.data.map((value,index)=>{
                        helpmenow.push({id:index,checked:true})
                    })
                } else {
                    WhatManga.data.map((value,index)=>{
                        helpmenow.push({id:index,checked:false})
                    }) 
                }
                setChecked(helpmenow)
               return ; 
            }      
                if (e.target.checked) {
                    setChecked(
                        checked.map((check)=>
                        check.id === position ?{...check,checked:!check.checked} :{...check})
                    ) 
                } else {
                    // remove from list
                    setChecked(
                        checked.map((check)=>
                        check.id === position ?{...check,checked:!check.checked} :{...check})
                    )
                }     
        };
        const DownloadNow=(e)=>{
            e.preventDefault();
            console.log(checked)
        }
        
        /*********************************/

       if(!data.Mangas && !data.User && !WhatManga){
           return(
            <div id="preloder">
			<div className="loader">Loading...</div>
		    </div>
           )
       }
       
    return (
    <>
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>
        
        {What_SizeIsIt === 'Normal' ? 
    <section className="anime-details spad">
        <div className="container">
            <div className="anime__details__content">
            {
                StartShowing?(
                <div className="row">
                    <div className="col-lg-3">
                        <div className="anime__details__pic" style={{ backgroundImage: `url(${WhatManga.PictureLink})`,backgroundSize: '262px 420px',backgroundRepeat:'no-repeat'}}>
                            <div className="comment"><i className="fa fa-comments"></i>{LengthofComments}</div>
                            <div className="view"><i className="fa fa-eye"></i> {WhatManga.views}</div>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="anime__details__text">
                            <div className="anime__details__title">
                                <h3>{WhatManga.Name.slice(0, 45)+'...'}</h3>
                            </div>
                            <div className="anime__details__rating">
                                {data.User ? 
                                <StarsRating title={title} UserIdShow={data.User._id} AdminExists={AdminExists }id ={WhatManga._id}></StarsRating>
                                :<StarsRating title={title} AdminExists={AdminExists } id ={WhatManga._id}></StarsRating>}
                            </div>
                            <label>Description : </label>
                            <br/>
                            <p>{WhatManga.Description}</p>
                            <div className="anime__details__widget">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                        <ul>
                                            <li><span>Alternate Names:</span> {WhatManga.AlternativeNames}</li>
                                            <li><span>Author:</span>{WhatManga.Author}</li>
                                            <li><span>Status:</span>{WhatManga.Status} </li>         
                                            <li><span>Genre:</span>{Genre}</li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <ul>
                                            <li><span>Reading Direction:</span>{WhatManga.ReadingDirection}</li>
                                            <li><span>Views:</span>{WhatManga.views}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="anime__details__btn">
                                <a className="follow-btn" onClick={(e)=>FollowThisManga(e)} style={{cursor: 'pointer'}}>
                                {
                                    data.User && data.User.MangaLiked.includes(title) && !FollowingManga ? 
                                        <i className="fa fa-heart"></i> : <i className="fa fa-heart-o"></i>
                                    }
                                    Follow</a>
                                <Link to="pages/1" onClick={(e)=>AddViewUp(e)} className="watch-btn"> <span>Read Page 1</span> <i
                                    className="fa fa-angle-right"></i></Link>
                                <a onClick={(e)=>GoToDownload(e)} className="watch-btn"> <span>Download</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                ):
                <div className="row">
                <div className="col-lg-3">
                <Skeleton variant="rectangular" animation="wave" width={262} height={420}  sx={{ bgcolor: '#a1a1a1' }}/>
                </div>
                <div className="col-lg-9"> 
                <Skeleton variant="text" animation="wave" height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                <p>
                <Skeleton variant="text" animation="wave" height={300}  sx={{ bgcolor: '#a1a1a1' }}></Skeleton>
                </p>
                </div>
                </div>
            }
            </div>
            {
                 StartShowing?(
                    <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                    <div className="section-title">
                        <h5>Chapters</h5>
                    </div>
                    {
                        WhatManga ? 
                            WhatManga.data.map((value,index)=>{
                                if(index > 0 && index < 10){
                                    return(
                                        <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+index}>{value.chaptersName}</Link>
                                    )
                                }
                                else if(index >= 10 ){
                                    restofmangastoshowmore.push(value)
                                }
                            })
                            :null
                    }
                    {
                        ShowMore ? 
                            restofmangastoshowmore.map((value,index)=>{
                                    return(
                                        <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+value.counter}>{value.chaptersName}</Link>
                                    )
                            })
                            :null
                    }
                </div>
                 ): <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                 <div className="section-title">
                     <h5>Chapters</h5>
                 </div>
                 <Skeleton variant="rectangular" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                 </div>
            }
                         <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
            {
                StartShowing ?
            <div className="row">
                <div className="col-lg-8">
                    <div className="anime__details__review" > 
                        <div className="section-title">
                            {
                                IsThereComments && Comments ?
                                <h5>Comments ({Comments.length})</h5>
                                : <h5>Comments (0)</h5>
                            }
                        </div>
                        {
                             IsThereComments? Comments.map((com,postion)=>{
                                if(!com.Replyto){
                                    return(
                                    <div key={com._id} className="anime__review__item"> 
                                        <div className="anime__review__item__pic">
                                            <img src={com.PictureLink} alt="justsomeimages" style={{cursor: 'pointer'}} onClick={(e)=>GoToProfile(e,com.username)}/>
                                            
                                        </div>
                                        <div className="anime__review__item__text">

                                            {
                                                data.User && (LocationCheckLike.includes(com._id)) ? 
                                                <i onClick={(e)=>RemoveLikeForComment(e,com._id)} className="fas fa-thumbs-up" style={{position: 'absolute',right:'40px',cursor: 'pointer'}}> {Liked.length > 0 ? Liked.map((like,index3)=>{
                                                    if(like.id === com._id){
                                                        return (like.count)
                                                    }
                                                   
                                                }) : 0 } </i>
                                                :
                                                <i onClick={(e)=>AddLikeForComment(e,com._id)} className="far fa-thumbs-up" style={{position: 'absolute',right:'40px',cursor: 'pointer'}}>{Liked.length > 0 ?  Liked.map((like,index3)=>{
                                                    if(like.id === com._id){
                                                    return (like.count)
                                                    }
                                                
                                            }): 0} </i>
                                            }

                                            {
                                                data.User &&( LocationCheckDislike.includes(com._id))?
                                                <i  onClick={(e)=>RemoveDisLikeForComment(e,com._id)} className="fas fa-thumbs-down" style={{position: 'absolute',right:'80px',cursor: 'pointer'}}> {Disliked.length > 0 ? Disliked.map((dislike,index3)=>{ if(dislike.id === com._id){
                                                    return (dislike.count)
                                                }
                                                
                                            }) : 0} </i>
                                                :
                                                <i  onClick={(e)=>AddDisLikeForComment(e,com._id)} className="far fa-thumbs-down" style={{position: 'absolute',right:'80px',cursor: 'pointer'}}> {Disliked.length > 0 ? Disliked.map((dislike,index3)=>{ if(dislike.id === com._id){
                                                    return (dislike.count)
                                                }
                                                
                                            }) : 0}</i>
                                            }


                                            <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                            <p>{com.commentdata}</p>

                                            {
                                                (!ShowReplyTextArea && !(WhoIsItReplying == postion)) && !(com.username == commentuser) && data.User ?
                                                <a onClick={(e)=>ReplytoWho(e,com.username,postion)} style={{color: '#000000',marginBottom:'50px',cursor: 'pointer'}}>Reply</a>
                                                :null
                                            }
                                            {
                                                ShowReplyTextArea && (WhoIsItReplying == postion) ? 
                                                <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                    <form action="#">
                                                        <textarea placeholder="Your Reply" value={AddReply} onChange={(e)=>setAddReply(e.target.value)}></textarea>
                                                        <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddReplytosomeome(e,com.username)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                        <button type="button" disabled={!data.isloggedin.isloggedin} onClick={(e)=>CancelReplytoWho(e)} style={{marginLeft:"20px"}}><i  className="fas fa-times"></i>cancel</button>
                                                    </form>
                                            </div>
                                                :null
                                            }
                                            
                                            {
                                                (ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) ?
                                                <div className='oksooooo'>
                                                <i onClick={(e)=>EditCommentorReply(e)} className="far fa-edit" style={{ cursor: 'pointer'}}></i>
                                                <i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                    ,com.HowMany,com._id)} className="far fa-trash-alt" style={{marginLeft:'30px', cursor: 'pointer'}}></i>
                                                </div> :<i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                    ,com.HowMany,com._id)} className="far fa-trash-alt" style={{cursor: 'pointer',marginLeft:'5px'}}></i>
                                            }
                                            
                                            {
                                                ( ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) && ShowEditedSide ?
                                                <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                    <form action="#">
                                                        <textarea placeholder="Your Edited Text" value={EditActive} onChange={(e)=>setEditActive(e.target.value)}></textarea>
                                                        <button type="submit" onClick={(e)=>EditCommentNow(e,com.username,com.commentdata,com.pictureLink
                                                    ,com.HowMany,com._id)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                    </form>
                                                </div> : null
                                            }

                                        </div>
                                        
                                    </div>
                                    );
                                }
                                else{
                                    return(
                                        <div key={com._id} className="anime__review__item" style={{marginLeft:'50px'}}>
                                            <div className="anime__review__item__pic" >
                                                <img src={com.PictureLink} alt="justsomeimages"/>
                                            </div>
                                            <div className="anime__review__item__text">
                                                <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                                <p>{com.commentdata}</p>

                                                
                                                
                                            </div>
                                        </div>
                                        );
                                }
                            }):<h4>There No Comments</h4>
                        }
                    </div>
                    <div className="anime__details__form">
                        <div className="section-title">
                            <h5>Your Comment</h5>
                        </div>
                        <form action="#">
                            <textarea placeholder="Your Comment" value={AddComment} onChange={(e)=>setAddComment(e.target.value)}></textarea>
                            <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddComment2(e)}><i className="fa fa-location-arrow"></i>Submit</button>
                        </form>
                    </div>
                </div>
            </div>  
            :<div className="row">
                 <div className="anime__details__review" > 
                        <div className="section-title">
                        <h5>Comments</h5>
                    </div>
                    <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                    <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                    <br/>
                    <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                    <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }}style={{marginLeft:'20px'}} />
                    <br/>
                    <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                    <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                    </div>
                </div>  
            }
            </div>
        </section> 
        :null}

        {What_SizeIsIt ==='Meduim'?
         <section className="anime-details spad">
         <div className="container">
             <div className="anime__details__content">
             {
                 StartShowing?(
                 <div className="row">
                     <div className="col-lg-3">
                         <div className="anime__details__pic" style={{ backgroundImage: `url(${WhatManga.PictureLink})`,backgroundSize: '262px 420px',backgroundRepeat:'no-repeat'}}>
                             <div className="comment"><i className="fa fa-comments"></i>{LengthofComments}</div>
                             <div className="view"><i className="fa fa-eye"></i> {WhatManga.views}</div>
                         </div>
                     </div>
                     <div className="col-lg-9">
                         <div className="anime__details__text">
                             <div className="anime__details__title">
                                 <h3>{WhatManga.Name.slice(0, 45)+'...'}</h3>
                             </div>
                             <div className="anime__details__rating">
                                 {data.User ? 
                                 <StarsRating title={title} UserIdShow={data.User._id} AdminExists={AdminExists }id ={WhatManga._id}></StarsRating>
                                 :<StarsRating title={title} AdminExists={AdminExists } id ={WhatManga._id}></StarsRating>}
                             </div>
                             <label>Description : </label>
                             <br/>
                             <p>{WhatManga.Description}</p>
                             <div className="anime__details__widget">
                                 <div className="row">
                                     <div className="col-lg-6 col-md-6">
                                         <ul>
                                             <li><span>Alternate Names:</span> {WhatManga.AlternativeNames}</li>
                                             <li><span>Author:</span>{WhatManga.Author}</li>
                                             <li><span>Status:</span>{WhatManga.Status} </li>         
                                             <li><span>Genre:</span>{Genre}</li>
                                         </ul>
                                     </div>
                                     <div className="col-lg-6 col-md-6">
                                         <ul>
                                             <li><span>Reading Direction:</span>{WhatManga.ReadingDirection}</li>
                                             <li><span>Views:</span>{WhatManga.views}</li>
                                         </ul>
                                     </div>
                                 </div>
                             </div>
                             <div className="anime__details__btn">
                                 <a className="follow-btn" onClick={(e)=>FollowThisManga(e)} style={{cursor: 'pointer'}}>
                                 {
                                     data.User && data.User.MangaLiked.includes(title) && !FollowingManga ? 
                                         <i className="fa fa-heart"></i> : <i className="fa fa-heart-o"></i>
                                     }
                                     Follow</a>
                                 <Link to="pages/1" onClick={(e)=>AddViewUp(e)} className="watch-btn"> <span>Read Page 1</span> <i
                                     className="fa fa-angle-right"></i></Link>
                                 <a onClick={(e)=>GoToDownload(e)} className="watch-btn"> <span>Download</span></a>
                                 </div>
                             </div>
                         </div>
                     </div>
                 ):
                 <div className="row">
                 <div className="col-lg-3">
                 <Skeleton variant="rectangular" animation="wave" width={200} height={420}  sx={{ bgcolor: '#a1a1a1' }}/>
                 </div>
                 <div className="col-lg-9"> 
                 <Skeleton variant="text" animation="wave" height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                 <p>
                 <Skeleton variant="text" animation="wave" height={300}  sx={{ bgcolor: '#a1a1a1' }}></Skeleton>
                 </p>
                 </div>
                 </div>
             }
             </div>
             {
                  StartShowing?(
                     <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                     <div className="section-title">
                         <h5>Chapters</h5>
                     </div>
                     {
                         WhatManga ? 
                             WhatManga.data.map((value,index)=>{
                                 if(index > 0 && index < 10){
                                     return(
                                         <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+index}>{value.chaptersName}</Link>
                                     )
                                 }
                                 else if(index >= 10 ){
                                     restofmangastoshowmore.push(value)
                                 }
                             })
                             :null
                     }
                     {
                         ShowMore ? 
                             restofmangastoshowmore.map((value,index)=>{
                                     return(
                                         <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+value.counter}>{value.chaptersName}</Link>
                                     )
                             })
                             :null
                     }
                 </div>
                  ): <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                  <div className="section-title">
                      <h5>Chapters</h5>
                  </div>
                  <Skeleton variant="rectangular" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                  </div>
             }
                          <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
             {
                 StartShowing ?
             <div className="row">
                 <div className="col-lg-8">
                     <div className="anime__details__review" > 
                         <div className="section-title">
                             {
                                 IsThereComments && Comments ?
                                 <h5>Comments ({Comments.length})</h5>
                                 : <h5>Comments (0)</h5>
                             }
                         </div>
                         {
                              IsThereComments? Comments.map((com,postion)=>{
                                 if(!com.Replyto){
                                     return(
                                     <div key={com._id} className="anime__review__item"> 
                                         <div className="anime__review__item__pic">
                                             <img src={com.PictureLink} alt="justsomeimages" style={{cursor: 'pointer'}} onClick={(e)=>GoToProfile(e,com.username)}/>
                                             
                                         </div>
                                         <div className="anime__review__item__text">
 
                                             {
                                                 data.User && (LocationCheckLike.includes(com._id)) ? 
                                                 <i onClick={(e)=>RemoveLikeForComment(e,com._id)} className="fas fa-thumbs-up" style={{position: 'absolute',right:'40px',cursor: 'pointer'}}> {Liked.length > 0 ? Liked.map((like,index3)=>{
                                                     if(like.id === com._id){
                                                         return (like.count)
                                                     }
                                                    
                                                 }) : 0 } </i>
                                                 :
                                                 <i onClick={(e)=>AddLikeForComment(e,com._id)} className="far fa-thumbs-up" style={{position: 'absolute',right:'40px',cursor: 'pointer'}}>{Liked.length > 0 ?  Liked.map((like,index3)=>{
                                                     if(like.id === com._id){
                                                     return (like.count)
                                                     }
                                                 
                                             }): 0} </i>
                                             }
 
                                             {
                                                 data.User &&( LocationCheckDislike.includes(com._id))?
                                                 <i  onClick={(e)=>RemoveDisLikeForComment(e,com._id)} className="fas fa-thumbs-down" style={{position: 'absolute',right:'80px',cursor: 'pointer'}}> {Disliked.length > 0 ? Disliked.map((dislike,index3)=>{ if(dislike.id === com._id){
                                                     return (dislike.count)
                                                 }
                                                 
                                             }) : 0} </i>
                                                 :
                                                 <i  onClick={(e)=>AddDisLikeForComment(e,com._id)} className="far fa-thumbs-down" style={{position: 'absolute',right:'80px',cursor: 'pointer'}}> {Disliked.length > 0 ? Disliked.map((dislike,index3)=>{ if(dislike.id === com._id){
                                                     return (dislike.count)
                                                 }
                                                 
                                             }) : 0}</i>
                                             }
 
 
                                             <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                             <p>{com.commentdata}</p>
 
                                             {
                                                 (!ShowReplyTextArea && !(WhoIsItReplying == postion)) && !(com.username == commentuser) && data.User ?
                                                 <a onClick={(e)=>ReplytoWho(e,com.username,postion)} style={{color: '#000000',marginBottom:'50px',cursor: 'pointer'}}>Reply</a>
                                                 :null
                                             }
                                             {
                                                 ShowReplyTextArea && (WhoIsItReplying == postion) ? 
                                                 <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                     <form action="#">
                                                         <textarea placeholder="Your Reply" value={AddReply} onChange={(e)=>setAddReply(e.target.value)}></textarea>
                                                         <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddReplytosomeome(e,com.username)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                         <button type="button" disabled={!data.isloggedin.isloggedin} onClick={(e)=>CancelReplytoWho(e)} style={{marginLeft:"20px"}}><i  className="fas fa-times"></i>cancel</button>
                                                     </form>
                                             </div>
                                                 :null
                                             }
                                             
                                             {
                                                 (ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                 ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) ?
                                                 <div className='oksooooo'>
                                                 <i onClick={(e)=>EditCommentorReply(e)} className="far fa-edit" style={{ cursor: 'pointer'}}></i>
                                                 <i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                     ,com.HowMany,com._id)} className="far fa-trash-alt" style={{marginLeft:'30px', cursor: 'pointer'}}></i>
                                                 </div> :<i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                     ,com.HowMany,com._id)} className="far fa-trash-alt" style={{cursor: 'pointer',marginLeft:'5px'}}></i>
                                             }
                                             
                                             {
                                                 ( ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                 ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) && ShowEditedSide ?
                                                 <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                     <form action="#">
                                                         <textarea placeholder="Your Edited Text" value={EditActive} onChange={(e)=>setEditActive(e.target.value)}></textarea>
                                                         <button type="submit" onClick={(e)=>EditCommentNow(e,com.username,com.commentdata,com.pictureLink
                                                     ,com.HowMany,com._id)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                     </form>
                                                 </div> : null
                                             }
 
                                         </div>
                                         
                                     </div>
                                     );
                                 }
                                 else{
                                     return(
                                         <div key={com._id} className="anime__review__item" style={{marginLeft:'50px'}}>
                                             <div className="anime__review__item__pic" >
                                                 <img src={com.PictureLink} alt="justsomeimages"/>
                                             </div>
                                             <div className="anime__review__item__text">
                                                 <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                                 <p>{com.commentdata}</p>
 
                                                 
                                                 
                                             </div>
                                         </div>
                                         );
                                 }
                             }):<h4>There No Comments</h4>
                         }
                     </div>
                     <div className="anime__details__form">
                         <div className="section-title">
                             <h5>Your Comment</h5>
                         </div>
                         <form action="#">
                             <textarea placeholder="Your Comment" value={AddComment} onChange={(e)=>setAddComment(e.target.value)}></textarea>
                             <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddComment2(e)}><i className="fa fa-location-arrow"></i>Submit</button>
                         </form>
                     </div>
                 </div>
             </div>  
             :<div className="row">
                  <div className="anime__details__review" > 
                         <div className="section-title">
                         <h5>Comments</h5>
                     </div>
                     <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                     <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                     <br/>
                     <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                     <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }}style={{marginLeft:'20px'}} />
                     <br/>
                     <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                     <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                     </div>
                 </div>  
             }
             </div>
         </section>
        :null}

         {What_SizeIsIt ==='Tablet'?
          <section className="anime-details spad">
          <div className="container">
              <div className="anime__details__content">
              {
                  StartShowing?(
                  <div className="row">
                      <div className="col-lg-3">
                          <div className="anime__details__pic" style={{ backgroundRepeat:'no-repeat',backgroundSize:'cover',backgroundImage: `url(${WhatManga.PictureLink})`}}>
                              <div className="comment"><i className="fa fa-comments"></i>{LengthofComments}</div>
                              <div className="view"><i className="fa fa-eye"></i> {WhatManga.views}</div>
                          </div>
                      </div>
                      <div className="col-lg-9">
                          <div className="anime__details__text">
                              <div className="anime__details__title">
                                  <h3>{WhatManga.Name.slice(0, 45)+'...'}</h3>
                              </div>
                              <div className="anime__details__rating">
                                  {data.User ? 
                                  <StarsRating title={title} UserIdShow={data.User._id} AdminExists={AdminExists }id ={WhatManga._id}></StarsRating>
                                  :<StarsRating title={title} AdminExists={AdminExists } id ={WhatManga._id}></StarsRating>}
                              </div>
                              <label>Description : </label>
                              <br/>
                              <p>{WhatManga.Description}</p>
                              <div className="anime__details__widget">
                                  <div className="row">
                                      <div className="col-lg-6 col-md-6">
                                          <ul>
                                              <li><span>Alternate Names:</span> {WhatManga.AlternativeNames}</li>
                                              <li><span>Author:</span>{WhatManga.Author}</li>
                                              <li><span>Status:</span>{WhatManga.Status} </li>         
                                              <li><span>Genre:</span>{Genre}</li>
                                          </ul>
                                      </div>
                                      <div className="col-lg-6 col-md-6">
                                          <ul>
                                              <li><span>Reading Direction:</span>{WhatManga.ReadingDirection}</li>
                                              <li><span>Views:</span>{WhatManga.views}</li>
                                          </ul>
                                      </div>
                                  </div>
                              </div>
                              <div className="anime__details__btn">
                                  <a className="follow-btn" onClick={(e)=>FollowThisManga(e)} style={{cursor: 'pointer'}}>
                                  {
                                      data.User && data.User.MangaLiked.includes(title) && !FollowingManga ? 
                                          <i className="fa fa-heart"></i> : <i className="fa fa-heart-o"></i>
                                      }
                                      Follow</a>
                                  <Link to="pages/1" onClick={(e)=>AddViewUp(e)} className="watch-btn"> <span>Read Page 1</span> <i
                                      className="fa fa-angle-right"></i></Link>
                                  <a onClick={(e)=>GoToDownload(e)} className="watch-btn"> <span>Download</span></a>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ):
                  <div className="row">
                  <div className="col-lg-3">
                  <Skeleton variant="rectangular" animation="wave" width={600} height={420}  sx={{ bgcolor: '#a1a1a1' }}/>
                  </div>
                  <div className="col-lg-9"> 
                  <Skeleton variant="text" animation="wave" height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                  <p>
                  <Skeleton variant="text" animation="wave" height={300}  sx={{ bgcolor: '#a1a1a1' }}></Skeleton>
                  </p>
                  </div>
                  </div>
              }
              </div>
              {
                   StartShowing?(
                      <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                      <div className="section-title">
                          <h5>Chapters</h5>
                      </div>
                      {
                          WhatManga ? 
                              WhatManga.data.map((value,index)=>{
                                  if(index > 0 && index < 10){
                                      return(
                                          <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+index}>{value.chaptersName}</Link>
                                      )
                                  }
                                  else if(index >= 10 ){
                                      restofmangastoshowmore.push(value)
                                  }
                              })
                              :null
                      }
                      {
                          ShowMore ? 
                              restofmangastoshowmore.map((value,index)=>{
                                      return(
                                          <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+value.counter}>{value.chaptersName}</Link>
                                      )
                              })
                              :null
                      }
                  </div>
                   ): <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                   <div className="section-title">
                       <h5>Chapters</h5>
                   </div>
                   <Skeleton variant="rectangular" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                   </div>
              }
                           <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
              {
                  StartShowing ?
              <div className="row">
                  <div className="col-lg-8">
                      <div className="anime__details__review" > 
                          <div className="section-title">
                              {
                                  IsThereComments && Comments ?
                                  <h5>Comments ({Comments.length})</h5>
                                  : <h5>Comments (0)</h5>
                              }
                          </div>
                          {
                               IsThereComments? Comments.map((com,postion)=>{
                                  if(!com.Replyto){
                                      return(
                                      <div key={com._id} className="anime__review__item"> 
                                          <div className="anime__review__item__pic">
                                              <img src={com.PictureLink} alt="justsomeimages" style={{cursor: 'pointer'}} onClick={(e)=>GoToProfile(e,com.username)}/>
                                              
                                          </div>
                                          <div className="anime__review__item__text">
  
                                              {
                                                  data.User && (LocationCheckLike.includes(com._id)) ? 
                                                  <i onClick={(e)=>RemoveLikeForComment(e,com._id)} className="fas fa-thumbs-up" style={{position: 'absolute',right:'40px',cursor: 'pointer'}}> {Liked.length > 0 ? Liked.map((like,index3)=>{
                                                      if(like.id === com._id){
                                                          return (like.count)
                                                      }
                                                     
                                                  }) : 0 } </i>
                                                  :
                                                  <i onClick={(e)=>AddLikeForComment(e,com._id)} className="far fa-thumbs-up" style={{position: 'absolute',right:'40px',cursor: 'pointer'}}>{Liked.length > 0 ?  Liked.map((like,index3)=>{
                                                      if(like.id === com._id){
                                                      return (like.count)
                                                      }
                                                  
                                              }): 0} </i>
                                              }
  
                                              {
                                                  data.User &&( LocationCheckDislike.includes(com._id))?
                                                  <i  onClick={(e)=>RemoveDisLikeForComment(e,com._id)} className="fas fa-thumbs-down" style={{position: 'absolute',right:'80px',cursor: 'pointer'}}> {Disliked.length > 0 ? Disliked.map((dislike,index3)=>{ if(dislike.id === com._id){
                                                      return (dislike.count)
                                                  }
                                                  
                                              }) : 0} </i>
                                                  :
                                                  <i  onClick={(e)=>AddDisLikeForComment(e,com._id)} className="far fa-thumbs-down" style={{position: 'absolute',right:'80px',cursor: 'pointer'}}> {Disliked.length > 0 ? Disliked.map((dislike,index3)=>{ if(dislike.id === com._id){
                                                      return (dislike.count)
                                                  }
                                                  
                                              }) : 0}</i>
                                              }
  
  
                                              <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                              <p>{com.commentdata}</p>
  
                                              {
                                                  (!ShowReplyTextArea && !(WhoIsItReplying == postion)) && !(com.username == commentuser) && data.User ?
                                                  <a onClick={(e)=>ReplytoWho(e,com.username,postion)} style={{color: '#000000',marginBottom:'50px',cursor: 'pointer'}}>Reply</a>
                                                  :null
                                              }
                                              {
                                                  ShowReplyTextArea && (WhoIsItReplying == postion) ? 
                                                  <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                      <form action="#">
                                                          <textarea placeholder="Your Reply" value={AddReply} onChange={(e)=>setAddReply(e.target.value)}></textarea>
                                                          <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddReplytosomeome(e,com.username)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                          <button type="button" disabled={!data.isloggedin.isloggedin} onClick={(e)=>CancelReplytoWho(e)} style={{marginLeft:"20px"}}><i  className="fas fa-times"></i>cancel</button>
                                                      </form>
                                              </div>
                                                  :null
                                              }
                                              
                                              {
                                                  (ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                  ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) ?
                                                  <div className='oksooooo'>
                                                  <i onClick={(e)=>EditCommentorReply(e)} className="far fa-edit" style={{ cursor: 'pointer'}}></i>
                                                  <i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                      ,com.HowMany,com._id)} className="far fa-trash-alt" style={{marginLeft:'30px', cursor: 'pointer'}}></i>
                                                  </div> :<i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                      ,com.HowMany,com._id)} className="far fa-trash-alt" style={{cursor: 'pointer',marginLeft:'5px'}}></i>
                                              }
                                              
                                              {
                                                  ( ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                  ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) && ShowEditedSide ?
                                                  <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                      <form action="#">
                                                          <textarea placeholder="Your Edited Text" value={EditActive} onChange={(e)=>setEditActive(e.target.value)}></textarea>
                                                          <button type="submit" onClick={(e)=>EditCommentNow(e,com.username,com.commentdata,com.pictureLink
                                                      ,com.HowMany,com._id)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                      </form>
                                                  </div> : null
                                              }
  
                                          </div>
                                          
                                      </div>
                                      );
                                  }
                                  else{
                                      return(
                                          <div key={com._id} className="anime__review__item" style={{marginLeft:'50px'}}>
                                              <div className="anime__review__item__pic" >
                                                  <img src={com.PictureLink} alt="justsomeimages"/>
                                              </div>
                                              <div className="anime__review__item__text">
                                                  <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                                  <p>{com.commentdata}</p>
  
                                                  
                                                  
                                              </div>
                                          </div>
                                          );
                                  }
                              }):<h4>There No Comments</h4>
                          }
                      </div>
                      <div className="anime__details__form">
                          <div className="section-title">
                              <h5>Your Comment</h5>
                          </div>
                          <form action="#">
                              <textarea placeholder="Your Comment" value={AddComment} onChange={(e)=>setAddComment(e.target.value)}></textarea>
                              <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddComment2(e)}><i className="fa fa-location-arrow"></i>Submit</button>
                          </form>
                      </div>
                  </div>
              </div>  
              :<div className="row">
                   <div className="anime__details__review" > 
                          <div className="section-title">
                          <h5>Comments</h5>
                      </div>
                      <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <br/>
                      <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }}style={{marginLeft:'20px'}} />
                      <br/>
                      <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      </div>
                  </div>  
              }
              </div>
          </section>
        :null}

         {What_SizeIsIt ==='Wide Mobile'?
          <section className="anime-details spad">
          <div className="container">
              <div className="anime__details__content">
              {
                  StartShowing?(
                  <div className="row">
                      <div className="col-lg-3">
                          <div className="anime__details__pic" style={{ backgroundImage: `url(${WhatManga.PictureLink})`,backgroundSize: 'cover',backgroundRepeat:'no-repeat'}}>
                              <div className="comment"><i className="fa fa-comments"></i>{LengthofComments}</div>
                              <div className="view"><i className="fa fa-eye"></i> {WhatManga.views}</div>
                          </div>
                      </div>
                      <div className="col-lg-9">
                          <div className="anime__details__text">
                              <div className="anime__details__title">
                                  <h3>{WhatManga.Name.slice(0, 45)+'...'}</h3>
                              </div>
                              <div className="anime__details__rating">
                                  {data.User ? 
                                  <StarsRating title={title} UserIdShow={data.User._id} AdminExists={AdminExists }id ={WhatManga._id}></StarsRating>
                                  :<StarsRating title={title} AdminExists={AdminExists } id ={WhatManga._id}></StarsRating>}
                              </div>
                              <label>Description : </label>
                              <br/>
                              <p>{WhatManga.Description}</p>
                              <div className="anime__details__widget">
                                  <div className="row">
                                      <div className="col-lg-6 col-md-6">
                                          <ul>
                                              <li><span>Alternate Names:</span> {WhatManga.AlternativeNames}</li>
                                              <li><span>Author:</span>{WhatManga.Author}</li>
                                              <li><span>Status:</span>{WhatManga.Status} </li>         
                                              <li><span>Genre:</span>{Genre}</li>
                                          </ul>
                                      </div>
                                      <div className="col-lg-6 col-md-6">
                                          <ul>
                                              <li><span>Reading Direction:</span>{WhatManga.ReadingDirection}</li>
                                              <li><span>Views:</span>{WhatManga.views}</li>
                                          </ul>
                                      </div>
                                  </div>
                              </div>
                              <div className="anime__details__btn">
                                  <a className="follow-btn" onClick={(e)=>FollowThisManga(e)} style={{cursor: 'pointer'}}>
                                  {
                                      data.User && data.User.MangaLiked.includes(title) && !FollowingManga ? 
                                          <i className="fa fa-heart"></i> : <i className="fa fa-heart-o"></i>
                                      }
                                      Follow</a>
                                  <Link to="pages/1" onClick={(e)=>AddViewUp(e)} className="watch-btn"> <span>Read Page 1</span> <i
                                      className="fa fa-angle-right"></i></Link>
                                  <a onClick={(e)=>GoToDownload(e)} className="watch-btn"> <span>Download</span></a>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ):
                  <div className="row">
                  <div className="col-lg-3">
                  <Skeleton variant="rectangular" animation="wave" width={500} height={420}  sx={{ bgcolor: '#a1a1a1' }}/>
                  </div>
                  <div className="col-lg-9"> 
                  <Skeleton variant="text" animation="wave" height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                  <p>
                  <Skeleton variant="text" animation="wave" height={300}  sx={{ bgcolor: '#a1a1a1' }}></Skeleton>
                  </p>
                  </div>
                  </div>
              }
              </div>
              {
                   StartShowing?(
                      <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                      <div className="section-title">
                          <h5>Chapters</h5>
                      </div>
                      {
                          WhatManga ? 
                              WhatManga.data.map((value,index)=>{
                                  if(index > 0 && index < 10){
                                      return(
                                          <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+index}>{value.chaptersName}</Link>
                                      )
                                  }
                                  else if(index >= 10 ){
                                      restofmangastoshowmore.push(value)
                                  }
                              })
                              :null
                      }
                      {
                          ShowMore ? 
                              restofmangastoshowmore.map((value,index)=>{
                                      return(
                                          <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+value.counter}>{value.chaptersName}</Link>
                                      )
                              })
                              :null
                      }
                  </div>
                   ): <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                   <div className="section-title">
                       <h5>Chapters</h5>
                   </div>
                   <Skeleton variant="rectangular" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                   </div>
              }
                           <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
              {
                  StartShowing ?
              <div className="row">
                  <div className="col-lg-8">
                      <div className="anime__details__review" > 
                          <div className="section-title">
                              {
                                  IsThereComments && Comments ?
                                  <h5>Comments ({Comments.length})</h5>
                                  : <h5>Comments (0)</h5>
                              }
                          </div>
                          {
                               IsThereComments? Comments.map((com,postion)=>{
                                  if(!com.Replyto){
                                      return(
                                      <div key={com._id} className="anime__review__item"> 
                                          <div className="anime__review__item__pic">
                                              <img src={com.PictureLink} alt="justsomeimages" style={{cursor: 'pointer'}} onClick={(e)=>GoToProfile(e,com.username)}/>
                                              
                                          </div>
                                          <div className="anime__review__item__text">
  
                                              {
                                                  data.User && (LocationCheckLike.includes(com._id)) ? 
                                                  <i onClick={(e)=>RemoveLikeForComment(e,com._id)} className="fas fa-thumbs-up" style={{position: 'absolute',right:'40px',cursor: 'pointer'}}> {Liked.length > 0 ? Liked.map((like,index3)=>{
                                                      if(like.id === com._id){
                                                          return (like.count)
                                                      }
                                                     
                                                  }) : 0 } </i>
                                                  :
                                                  <i onClick={(e)=>AddLikeForComment(e,com._id)} className="far fa-thumbs-up" style={{position: 'absolute',right:'40px',cursor: 'pointer'}}>{Liked.length > 0 ?  Liked.map((like,index3)=>{
                                                      if(like.id === com._id){
                                                      return (like.count)
                                                      }
                                                  
                                              }): 0} </i>
                                              }
  
                                              {
                                                  data.User &&( LocationCheckDislike.includes(com._id))?
                                                  <i  onClick={(e)=>RemoveDisLikeForComment(e,com._id)} className="fas fa-thumbs-down" style={{position: 'absolute',right:'80px',cursor: 'pointer'}}> {Disliked.length > 0 ? Disliked.map((dislike,index3)=>{ if(dislike.id === com._id){
                                                      return (dislike.count)
                                                  }
                                                  
                                              }) : 0} </i>
                                                  :
                                                  <i  onClick={(e)=>AddDisLikeForComment(e,com._id)} className="far fa-thumbs-down" style={{position: 'absolute',right:'80px',cursor: 'pointer'}}> {Disliked.length > 0 ? Disliked.map((dislike,index3)=>{ if(dislike.id === com._id){
                                                      return (dislike.count)
                                                  }
                                                  
                                              }) : 0}</i>
                                              }
  
  
                                              <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                              <p>{com.commentdata}</p>
  
                                              {
                                                  (!ShowReplyTextArea && !(WhoIsItReplying == postion)) && !(com.username == commentuser) && data.User ?
                                                  <a onClick={(e)=>ReplytoWho(e,com.username,postion)} style={{color: '#000000',marginBottom:'50px',cursor: 'pointer'}}>Reply</a>
                                                  :null
                                              }
                                              {
                                                  ShowReplyTextArea && (WhoIsItReplying == postion) ? 
                                                  <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                      <form action="#">
                                                          <textarea placeholder="Your Reply" value={AddReply} onChange={(e)=>setAddReply(e.target.value)}></textarea>
                                                          <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddReplytosomeome(e,com.username)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                          <button type="button" disabled={!data.isloggedin.isloggedin} onClick={(e)=>CancelReplytoWho(e)} style={{marginLeft:"20px"}}><i  className="fas fa-times"></i>cancel</button>
                                                      </form>
                                              </div>
                                                  :null
                                              }
                                              
                                              {
                                                  (ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                  ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) ?
                                                  <div className='oksooooo'>
                                                  <i onClick={(e)=>EditCommentorReply(e)} className="far fa-edit" style={{ cursor: 'pointer'}}></i>
                                                  <i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                      ,com.HowMany,com._id)} className="far fa-trash-alt" style={{marginLeft:'30px', cursor: 'pointer'}}></i>
                                                  </div> :<i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                      ,com.HowMany,com._id)} className="far fa-trash-alt" style={{cursor: 'pointer',marginLeft:'5px'}}></i>
                                              }
                                              
                                              {
                                                  ( ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                  ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) && ShowEditedSide ?
                                                  <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                      <form action="#">
                                                          <textarea placeholder="Your Edited Text" value={EditActive} onChange={(e)=>setEditActive(e.target.value)}></textarea>
                                                          <button type="submit" onClick={(e)=>EditCommentNow(e,com.username,com.commentdata,com.pictureLink
                                                      ,com.HowMany,com._id)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                      </form>
                                                  </div> : null
                                              }
  
                                          </div>
                                          
                                      </div>
                                      );
                                  }
                                  else{
                                      return(
                                          <div key={com._id} className="anime__review__item" style={{marginLeft:'50px'}}>
                                              <div className="anime__review__item__pic" >
                                                  <img src={com.PictureLink} alt="justsomeimages"/>
                                              </div>
                                              <div className="anime__review__item__text">
                                                  <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                                  <p>{com.commentdata}</p>
  
                                                  
                                                  
                                              </div>
                                          </div>
                                          );
                                  }
                              }):<h4>There No Comments</h4>
                          }
                      </div>
                      <div className="anime__details__form">
                          <div className="section-title">
                              <h5>Your Comment</h5>
                          </div>
                          <form action="#">
                              <textarea placeholder="Your Comment" value={AddComment} onChange={(e)=>setAddComment(e.target.value)}></textarea>
                              <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddComment2(e)}><i className="fa fa-location-arrow"></i>Submit</button>
                          </form>
                      </div>
                  </div>
              </div>  
              :<div className="row">
                   <div className="anime__details__review" > 
                          <div className="section-title">
                          <h5>Comments</h5>
                      </div>
                      <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <br/>
                      <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }}style={{marginLeft:'20px'}} />
                      <br/>
                      <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      </div>
                  </div>  
              }
              </div>
          </section>
        :null}

         {What_SizeIsIt ==='Small Mobile'?
          <section className="anime-details spad">
          <div className="container">
              <div className="anime__details__content">
              {
                  StartShowing?(
                  <div className="row">
                      <div className="col-lg-3">
                          <div className="anime__details__pic" style={{ backgroundImage: `url(${WhatManga.PictureLink})`,backgroundSize: 'cover',backgroundRepeat:'no-repeat'}}>
                              <div className="comment"><i className="fa fa-comments"></i>{LengthofComments}</div>
                              <div className="view"><i className="fa fa-eye"></i> {WhatManga.views}</div>
                          </div>
                      </div>
                      <div className="col-lg-9">
                          <div className="anime__details__text">
                              <div className="anime__details__title">
                                  <h3>{WhatManga.Name.slice(0, 45)+'...'}</h3>
                              </div>
                              <div className="anime__details__rating">
                                  {data.User ? 
                                  <StarsRating title={title} UserIdShow={data.User._id} AdminExists={AdminExists }id ={WhatManga._id}></StarsRating>
                                  :<StarsRating title={title} AdminExists={AdminExists } id ={WhatManga._id}></StarsRating>}
                              </div>
                              <label>Description : </label>
                              <br/>
                              <p>{WhatManga.Description}</p>
                              <div className="anime__details__widget">
                                  <div className="row">
                                      <div className="col-lg-6 col-md-6">
                                          <ul>
                                              <li><span>Alternate Names:</span> {WhatManga.AlternativeNames}</li>
                                              <li><span>Author:</span>{WhatManga.Author}</li>
                                              <li><span>Status:</span>{WhatManga.Status} </li>         
                                              <li><span>Genre:</span>{Genre}</li>
                                          </ul>
                                      </div>
                                      <div className="col-lg-6 col-md-6">
                                          <ul>
                                              <li><span>Reading Direction:</span>{WhatManga.ReadingDirection}</li>
                                              <li><span>Views:</span>{WhatManga.views}</li>
                                          </ul>
                                      </div>
                                  </div>
                              </div>
                              <div className="anime__details__btn">
                                  <a className="follow-btn" onClick={(e)=>FollowThisManga(e)} style={{cursor: 'pointer'}}>
                                  {
                                      data.User && data.User.MangaLiked.includes(title) && !FollowingManga ? 
                                          <i className="fa fa-heart"></i> : <i className="fa fa-heart-o"></i>
                                      }
                                      Follow</a>
                                  <Link to="pages/1" onClick={(e)=>AddViewUp(e)} className="watch-btn"> <span>Read Page 1</span> <i
                                      className="fa fa-angle-right"></i></Link>
                                  <a onClick={(e)=>GoToDownload(e)} className="watch-btn"> <span>Download</span></a>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ):
                  <div className="row">
                  <div className="col-lg-3">
                  <Skeleton variant="rectangular" animation="wave" width={300} height={420}  sx={{ bgcolor: '#a1a1a1' }}/>
                  </div>
                  <div className="col-lg-9"> 
                  <Skeleton variant="text" animation="wave" height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                  <p>
                  <Skeleton variant="text" animation="wave" height={300}  sx={{ bgcolor: '#a1a1a1' }}></Skeleton>
                  </p>
                  </div>
                  </div>
              }
              </div>
              {
                   StartShowing?(
                      <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                      <div className="section-title">
                          <h5>Chapters</h5>
                      </div>
                      {
                          WhatManga ? 
                              WhatManga.data.map((value,index)=>{
                                  if(index > 0 && index < 10){
                                      return(
                                          <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+index}>{value.chaptersName}</Link>
                                      )
                                  }
                                  else if(index >= 10 ){
                                      restofmangastoshowmore.push(value)
                                  }
                              })
                              :null
                      }
                      {
                          ShowMore ? 
                              restofmangastoshowmore.map((value,index)=>{
                                      return(
                                          <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+value.counter}>{value.chaptersName}</Link>
                                      )
                              })
                              :null
                      }
                  </div>
                   ): <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                   <div className="section-title">
                       <h5>Chapters</h5>
                   </div>
                   <Skeleton variant="rectangular" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                   </div>
              }
                           <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
              {
                  StartShowing ?
              <div className="row">
                  <div className="col-lg-8">
                      <div className="anime__details__review" > 
                          <div className="section-title">
                              {
                                  IsThereComments && Comments ?
                                  <h5>Comments ({Comments.length})</h5>
                                  : <h5>Comments (0)</h5>
                              }
                          </div>
                          {
                               IsThereComments? Comments.map((com,postion)=>{
                                  if(!com.Replyto){
                                      return(
                                      <div key={com._id} className="anime__review__item"> 
                                          <div className="anime__review__item__pic">
                                              <img src={com.PictureLink} alt="justsomeimages" style={{cursor: 'pointer'}} onClick={(e)=>GoToProfile(e,com.username)}/>
                                              
                                          </div>
                                          <div className="anime__review__item__text">
  
                                              {
                                                  data.User && (LocationCheckLike.includes(com._id)) ? 
                                                  <i onClick={(e)=>RemoveLikeForComment(e,com._id)} className="fas fa-thumbs-up" style={{position: 'absolute',right:'40px',cursor: 'pointer'}}> {Liked.length > 0 ? Liked.map((like,index3)=>{
                                                      if(like.id === com._id){
                                                          return (like.count)
                                                      }
                                                     
                                                  }) : 0 } </i>
                                                  :
                                                  <i onClick={(e)=>AddLikeForComment(e,com._id)} className="far fa-thumbs-up" style={{position: 'absolute',right:'40px',cursor: 'pointer'}}>{Liked.length > 0 ?  Liked.map((like,index3)=>{
                                                      if(like.id === com._id){
                                                      return (like.count)
                                                      }
                                                  
                                              }): 0} </i>
                                              }
  
                                              {
                                                  data.User &&( LocationCheckDislike.includes(com._id))?
                                                  <i  onClick={(e)=>RemoveDisLikeForComment(e,com._id)} className="fas fa-thumbs-down" style={{position: 'absolute',right:'80px',cursor: 'pointer'}}> {Disliked.length > 0 ? Disliked.map((dislike,index3)=>{ if(dislike.id === com._id){
                                                      return (dislike.count)
                                                  }
                                                  
                                              }) : 0} </i>
                                                  :
                                                  <i  onClick={(e)=>AddDisLikeForComment(e,com._id)} className="far fa-thumbs-down" style={{position: 'absolute',right:'80px',cursor: 'pointer'}}> {Disliked.length > 0 ? Disliked.map((dislike,index3)=>{ if(dislike.id === com._id){
                                                      return (dislike.count)
                                                  }
                                                  
                                              }) : 0}</i>
                                              }
  
  
                                              <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                              <p>{com.commentdata}</p>
  
                                              {
                                                  (!ShowReplyTextArea && !(WhoIsItReplying == postion)) && !(com.username == commentuser) && data.User ?
                                                  <a onClick={(e)=>ReplytoWho(e,com.username,postion)} style={{color: '#000000',marginBottom:'50px',cursor: 'pointer'}}>Reply</a>
                                                  :null
                                              }
                                              {
                                                  ShowReplyTextArea && (WhoIsItReplying == postion) ? 
                                                  <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                      <form action="#">
                                                          <textarea placeholder="Your Reply" value={AddReply} onChange={(e)=>setAddReply(e.target.value)}></textarea>
                                                          <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddReplytosomeome(e,com.username)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                          <button type="button" disabled={!data.isloggedin.isloggedin} onClick={(e)=>CancelReplytoWho(e)} style={{marginLeft:"20px"}}><i  className="fas fa-times"></i>cancel</button>
                                                      </form>
                                              </div>
                                                  :null
                                              }
                                              
                                              {
                                                  (ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                  ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) ?
                                                  <div className='oksooooo'>
                                                  <i onClick={(e)=>EditCommentorReply(e)} className="far fa-edit" style={{ cursor: 'pointer'}}></i>
                                                  <i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                      ,com.HowMany,com._id)} className="far fa-trash-alt" style={{marginLeft:'30px', cursor: 'pointer'}}></i>
                                                  </div> :<i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                      ,com.HowMany,com._id)} className="far fa-trash-alt" style={{cursor: 'pointer',marginLeft:'5px'}}></i>
                                              }
                                              
                                              {
                                                  ( ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                  ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) && ShowEditedSide ?
                                                  <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                      <form action="#">
                                                          <textarea placeholder="Your Edited Text" value={EditActive} onChange={(e)=>setEditActive(e.target.value)}></textarea>
                                                          <button type="submit" onClick={(e)=>EditCommentNow(e,com.username,com.commentdata,com.pictureLink
                                                      ,com.HowMany,com._id)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                      </form>
                                                  </div> : null
                                              }
  
                                          </div>
                                          
                                      </div>
                                      );
                                  }
                                  else{
                                      return(
                                          <div key={com._id} className="anime__review__item" style={{marginLeft:'50px'}}>
                                              <div className="anime__review__item__pic" >
                                                  <img src={com.PictureLink} alt="justsomeimages"/>
                                              </div>
                                              <div className="anime__review__item__text">
                                                  <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                                  <p>{com.commentdata}</p>
  
                                                  
                                                  
                                              </div>
                                          </div>
                                          );
                                  }
                              }):<h4>There No Comments</h4>
                          }
                      </div>
                      <div className="anime__details__form">
                          <div className="section-title">
                              <h5>Your Comment</h5>
                          </div>
                          <form action="#">
                              <textarea placeholder="Your Comment" value={AddComment} onChange={(e)=>setAddComment(e.target.value)}></textarea>
                              <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddComment2(e)}><i className="fa fa-location-arrow"></i>Submit</button>
                          </form>
                      </div>
                  </div>
              </div>  
              :<div className="row">
                   <div className="anime__details__review" > 
                          <div className="section-title">
                          <h5>Comments</h5>
                      </div>
                      <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <br/>
                      <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }}style={{marginLeft:'20px'}} />
                      <br/>
                      <Skeleton variant="circular" width={40} height={40}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      <Skeleton variant="text" animation="wave" width={700} height={100}  sx={{ bgcolor: '#a1a1a1' }} style={{marginLeft:'20px'}} />
                      </div>
                  </div>  
              }
              </div>
          </section>
        :null}

        <Footer/>
        </ThemeProvider>
		</>
	)
}

export default Manga_details