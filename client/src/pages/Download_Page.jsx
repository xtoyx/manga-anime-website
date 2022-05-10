import { useEffect, useState } from 'react'
import { Link , useParams ,useNavigate, Navigate} from 'react-router-dom';
import '../pages-css/geners.css';

import Footer from "./footer";
import Header from "./header";
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';
function Download_Page({data}) {
	
/*conditions for header 
    profile page is logoutava:true,firsttime:false,profile:false
    logout page is profileava:true,firsttime:true ,logoutava:false
    anything else will be everything true 
    */
    const nav=useNavigate();
    const [StartShowing,setStartShowing]=useState(false);
    const {title}=useParams();
    const [FollowingManga,setFollowingManga]=useState(false);
    const [Url,setUrl] = useState();


     /* Download Files */
     const [FirstTime1,setFirstTime1]=useState(true);
    const [FirstTime2,setFirstTime2]=useState(false);
     const [LinkForManga,setLinkForManga] =useState('Not Ready');
     const [WhatThe,setWhatThe] = useState('');
     const [checked, setChecked] = useState([]);
     const [HowManyisChecked,setHowManyisChecked] = useState(0);
    /*********************************/
    var WhatManga;
    var Genre;
    const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true};
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
    var t=setTimeout(() =>{
        setStartShowing(true);
    },5000)
    if(StartShowing){
            data.Mangas.map((value,index)=>{
                if(value.Name == title){
                    WhatManga = value;
                    Genre=value.Genre.join(",  ")
                }
            })
            if(FirstTime1 && WhatManga){
                var helppppp=[];
                WhatManga.data.map((value,index)=>{
                    helppppp.push({id:index,checked:false,chapterName:value.chaptersName})
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
        /********************************
        Download Files
        ********************************/
        const handleOnChange = (e,position) => {  
            if(position === 0){
                var helpmenow=[];
                if (e.target.checked) {
                    setHowManyisChecked(WhatManga.data.length)
                    WhatManga.data.map((value,index)=>{
                        helpmenow.push({id:index,checked:true,chapterName:value.chaptersName})
                    })
                } else {
                    setHowManyisChecked(0)
                    WhatManga.data.map((value,index)=>{
                        helpmenow.push({id:index,checked:false,chapterName:value.chaptersName})
                    }) 
                }
                setChecked(helpmenow)
               return ; 
            }      
                if (e.target.checked) {
                    var fuckme=HowManyisChecked;
                    fuckme++;
                    setHowManyisChecked(fuckme)
                    setChecked(
                        checked.map((check)=>
                        check.id === position ?{...check,checked:!check.checked} :{...check})
                    ) 
                } else {
                    // remove from list
                    var fuckme=HowManyisChecked;
                    fuckme--;
                    setHowManyisChecked(fuckme)
                    setChecked(
                        checked.map((check)=>
                        check.id === position ?{...check,checked:!check.checked} :{...check})
                    )
                }     
        };
        const BeforeDownloadNow=(e)=>{
            e.preventDefault();
             var WhatChaptersToDownload=[];           
            checked.map((value4543,index4543)=>{
                if(value4543.checked === true){
                    WhatChaptersToDownload.push(value4543.chapterName)

                }
            })
            DownloadNow(e,WhatChaptersToDownload);
        }
        const DownloadNow=(e,WhatChaptersToDownload)=>{
            e.preventDefault();
            try{
                const openInNewTab = (url) => {
                    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
                    if (newWindow) newWindow.opener = null
                  }
                fetch("http://localhost:5001/m/StartDownloadChapters", {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    "Access-Control-Allow-Credentials": true,
                                },body:JSON.stringify({
                                    NameofManga:title,
                                   WhatChapter:WhatChaptersToDownload
                                }),
                            })
                            .then((response) => {
                                if (response.status === 200) return response.json();
                            })
                            .then((resObject) => {
                                console.log('waiting')
                                alert('Please Wait 2 - 5 Minutes Or Until Download Now Change Links'
                                +',If There Was Missing files Please Click Again But You Get A 10 minutes until it delete.'
                                +'Thanks For Using This Website')
                                setFirstTime2(true);   
                             if(WhatChaptersToDownload.length<=10){
                                    setTimeout(() =>{
                                        setLinkForManga("http://localhost:5001/m/GetDownloadChapters/"+resObject)
                                    },15*1000)
                                }
                                if(WhatChaptersToDownload.length>10&&WhatChaptersToDownload.length<=20){
                                    setTimeout(() =>{
                                        setLinkForManga("http://localhost:5001/m/GetDownloadChapters/"+resObject)
                                    },2*60*1000)
                                }
                                if(WhatChaptersToDownload.length>20&&WhatChaptersToDownload.length<=40){
                                    setTimeout(() =>{
                                        setLinkForManga("http://localhost:5001/m/GetDownloadChapters/"+resObject)
                                    },3*60*1000)
                                }
                                if(WhatChaptersToDownload.length>40&&WhatChaptersToDownload.length<=50){
                                    setTimeout(() =>{
                                        setLinkForManga("http://localhost:5001/m/GetDownloadChapters/"+resObject)
                                    },5*60*1000)
                                }
                                if(WhatChaptersToDownload.length>50){
                                    setTimeout(() =>{
                                        setLinkForManga("http://localhost:5001/m/GetDownloadChapters/"+resObject)
                                    },6*60*1000)
                                }
                                setWhatThe(resObject)
                                return;
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
            }catch(err){
                console.log(err)
            }            
        }
        
        /*********************************/

       if(!data.Mangas || !WhatManga){
           return(
            <div id="preloder">
			<div className="loader">Loading...</div>
            <center>
                <h2 style={{color: 'white'}}>Wait Please 5 seconds</h2>
                <br/>
                <h2>Or</h2>
                <br/>
                <h2>Not Correct Url</h2>
                </center>
		    </div>
           )
       }
       
    return (
    <>
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>
                    <h2 className="text-center">Select Which Chapter</h2>
                    <table className="pure-table striped collections">
                     <tbody>
        {
            WhatManga && checked.length > 0 ?
            WhatManga.data.map((value,index)=>{
                if(index ===0){
                    return(
                        <>
                        <tr>
                                 <td>
                        <input type="checkbox" 
                        name="topping"  
                        value={checked}
                        onChange={(e) => handleOnChange(e,index)}
                        id={`custom-checkbox-${value._id}`}/>
                        <label>Select All</label>
                                 </td>
                        </tr>
                        </>
                    )
                }
                if(index > 0){
                       return(
                            <>
                             <tr>
                                 <td>
                                <input type="checkbox" 
                                    name="topping"  
                                    checked={checked[index].checked}
                                    onChange={(e) => handleOnChange(e,index)}
                                    id={`custom-checkbox-${value._id}`}/>
                                     <label>{value.chaptersName}</label></td>
                             </tr>
                           
                           </>
                       )     
                }     
                    }): null
        }
                     </tbody>
                    </table>
        <a onClick={(e)=>BeforeDownloadNow(e)} className="watch-btn" style={{marginBottom:'120px'}}><span>Download ({HowManyisChecked})</span></a>
        {
            FirstTime2 ? 
            <a href={LinkForManga}  className="watch-btn" target="_blank" style={{marginLeft:'30px'}}>Download Now</a>
            :null
        }
        
        <Footer/>
        </ThemeProvider>
		</>
	)
}
export default Download_Page;