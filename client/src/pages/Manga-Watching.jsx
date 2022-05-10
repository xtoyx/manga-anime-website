import { useEffect, useState } from 'react'
import { Link , useParams } from 'react-router-dom';
import '../pages-css/Home.css';
import Footer from "./footer";
import Header from "./header";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Switch from "../components/Switch";
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';


function Manga_Watching({data}) {
	/*conditions for header 
    profile page is logoutava:true,firsttime:false,profile:false
    logout page is profileava:true,firsttime:true ,logoutava:false
    anything else will be everything true 
    */

    /*Later 
    maybe for localstorage the id sent
    Do Skeletons for Comments
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
    const {title,idk}=useParams();
    const [Changed,setChanged]=useState('Show More');

    const [Comments,setComments]=useState();
    const [AddComment,setAddComment]=useState();
    const [AddReply,setAddReply]=useState();
    const [WhoIsItReplying,setWhoIsItReplying]=useState();
    const [ShowReplyTextArea,setShowReplyTextArea]=useState(false);
    const [commentuser,setCommentUser]=useState();
    const [LoadAllImageLazyWay, setLoadAllImageLazyWay] = useState(true);

    const [Waitcoolodwn,setWaitcooldown]= useState(false);
    const [TimerWaitcoolodwn,setTimerWaitcooldown]= useState(false);
    
    const [EditActive,setEditActive]=useState();
    const [IsThereComments,setIsThereComments]=useState(true);
    const [ShowEditedSide,setShowEditedSide]= useState(false);
    const [ChangeMargin,setChangeMargin]= useState(0);
    var Today=new Date();


    var WhatManga;
    var Genre;
    const [ActiveCommentorReply,setActiveCommentorReply]=useState(JSON.parse(localStorage.getItem('Active')));    
    let restofmangastoshowmore=[];
    const [Url,setUrl]=useState();
    const [ShowMore, setShowMore] = useState(false);
    const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true};
   
   
    var t=setTimeout(() =>{
        setStartShowing(true);
        setActiveCommentorReply(JSON.parse(localStorage.getItem('Active')))
        
        if(data.User){
            setCommentUser(data.User.name);
        }
    },5000)
    if(StartShowing){
            data.Mangas.map((value,index)=>{
                if(value.Name == title){
                    WhatManga = value;
                    Genre=value.Genre.join(",  ")
                }
            })
            clearTimeout(t);
            t=null;
       }	
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
                                idk
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
                    const HowMany = idk; //change it to the pagesnumber 
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
                const HowMany = idk; //change it to the pagesnumber 
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


    const LoadAllImages=(value2)=>{
        setLoadAllImageLazyWay(value2)
    }
    


        /* When the user clicks on the button,
        toggle between hiding and showing the dropdown content */
        function myFunction() {
            console.log('is there anything ')
            document.getElementById("myDropdown").classList.toggle("show");
        }
        
        // Close the dropdown menu if the user clicks outside of it
        window.onclick = function(event) {
            if (!event.target.matches('.dropbtn')) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }



      if(!data.Mangas && !StartShowing ){
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
        <div className="breadcrumb-option">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="breadcrumb__links">
                        <a href="/"><i className="fa fa-home"></i> Home</a>
                        <a href="/categories">Mangas</a>
                        {
                            StartShowing ? 
                            <span>{title}</span> :null
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>

    <section className="anime-details spad">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">

                <center>
                    <h3 >{title} Chapter {idk}</h3>
                <div className="dropdown">
                <button onClick={myFunction} className="dropbtn">Images Margin : {ChangeMargin} </button>
                    <div id="myDropdown" className="dropdown-content">
                        <a onClick={()=>setChangeMargin('0')}>0</a>
                        <a onClick={()=>setChangeMargin('1')}>1</a>
                        <a onClick={()=>setChangeMargin('2')}>2</a>
                        <a onClick={()=>setChangeMargin('3')}>3</a>
                        <a onClick={()=>setChangeMargin('4')}>4</a>
                        <a onClick={()=>setChangeMargin('5')}>5</a>
                        <a onClick={()=>setChangeMargin('6')}>6</a>
                        <a onClick={()=>setChangeMargin('7')}>7</a>
                        <a onClick={()=>setChangeMargin('8')}>8</a>
                        <a onClick={()=>setChangeMargin('9')}>9</a>
                        <a onClick={()=>setChangeMargin('10')}>10</a>

                    </div>
                </div>    
                    <Switch
                    isOn={LoadAllImageLazyWay}
                    onColor="#EF476F"
                    handleToggle={() => LoadAllImages(!LoadAllImageLazyWay)}
                    TexttoType="Load All Images At Once"
                    />
                        {
                            (StartShowing && LoadAllImageLazyWay)?
                                    WhatManga.data[idk].pagesLink.map((value2,index2)=>{
                                            return(
                                                
                                                <img key={index2} src={(value2)} width='70%' style={{maxHeight:'70%',maxWidth:'80%',paddingTop:'10px',paddingBottom:(ChangeMargin)+'px'}}/>
                                                )
                                        
                                    })
                                
                            :null
                        }
                        {
                            (StartShowing && !LoadAllImageLazyWay )?
                                    WhatManga.data[idk].pagesLink.map((value4,index4)=>{
                                        // slow loading
                                        return(
                                           
                                            <LazyLoadImage
                                             key={index4} 
                                             alt='Loading...'
                                             src={(value4)} 
                                             width='70%'
                                             effect="blur"
                                             style={{maxHeight:'70%',paddingTop:'10px',paddingBottom:(ChangeMargin)+'px'}}/>
                                            
                                            )
                                    })
                                
                            :null
                        }
                </center>

                    <div className="anime__details__episodes" style={{marginTop:'2%'}}>
                        <div className="section-title">
                            <h5>Chapters</h5>
                        </div>
                        {
                            StartShowing ? 
                                WhatManga.data.map((value,index)=>{
                                    if(index > 0 && index < 10){
                                        return(
                                            <Link key={index + value.chaptersName} to={'/manga/'+title+'/pages/'+index}>{value.chaptersName}</Link>
                                        )
                                    }
                                    else if(index > 0 ){
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
                </div>
                <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
            </div>
            <div className="row">
                <div className="col-lg-8">
                    <div className="anime__details__review" >
                        <div className="section-title">
                            <h5>Comments ({Comments ? Comments.length : '0'})</h5>
                        </div>
                        {
                            StartShowing && IsThereComments? Comments.map((com,postion)=>{
                                if(!com.Replyto){
                                    return(
                                    <div key={com._id} className="anime__review__item"> 
                                        <div className="anime__review__item__pic">
                                            <img src={com.PictureLink} alt="justsomeimages"/>
                                        </div>
                                        <div className="anime__review__item__text">
                                            <h6>{com.username} - <span>{com.updatedAt}</span></h6>
                                            <p>{com.commentdata}</p>

                                            {
                                                (!ShowReplyTextArea && !(WhoIsItReplying == postion)) && !(com.username == commentuser) && data.User ?
                                                <a onClick={(e)=>ReplytoWho(e,com.username,postion)} style={{color: '#000355',marginBottom:'50px',cursor: 'pointer'}}>Reply</a>

                                                :null
                                            }
                                            {
                                                ShowReplyTextArea && (WhoIsItReplying == postion) ? 
                                                <div className="anime__details__form" style={{marginTop:'20px'}}> 
                                                    <form action="#">
                                                        <textarea placeholder="Your Reply" value={AddReply} onChange={(e)=>setAddReply(e.target.value)}></textarea>
                                                        <button type="submit" disabled={!data.isloggedin.isloggedin} onClick={(e)=>AddReplytosomeome(e,com.username)}><i className="fa fa-location-arrow"></i>Submit</button>
                                                    </form>
                                            </div>
                                                :null
                                            }
                                            
                                            {
                                                (ActiveCommentorReply && (ActiveCommentorReply.name == com.username &&
                                                ActiveCommentorReply.commentdata == com.commentdata) && (com.username == commentuser)) ?
                                                <div className='oksooooo'>
                                                <i onClick={(e)=>EditCommentorReply(e)} className="far fa-edit" style={{color:'#000355' , cursor: 'pointer'}}></i>
                                                <i onClick={(e)=>RemoveCommentorReply(e,com.username,com.commentdata,com.pictureLink
                                                    ,com.HowMany,com._id)} className="far fa-trash-alt" style={{marginLeft:'30px',color:'#000355' , cursor: 'pointer'}}></i>
                                                </div> :null
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
                                            <div className="anime__review__item__pic">
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
            
        </div>
    </section>
        <Footer/>
        </ThemeProvider>
		</>
	)
}

export default Manga_Watching