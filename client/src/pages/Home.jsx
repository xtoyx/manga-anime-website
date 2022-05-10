import { useEffect, useState } from 'react';

import {Link,useNavigate} from 'react-router-dom';
import '../pages-css/Home.css';

// import ScrollButton from '../components/ScrollButton/ScrollButton.jsx';
import Footer from "./footer";
import Header from "./header";
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';

function Home({data}) {
var hooe=[];
var trending__list=[]
const nav=useNavigate();

const [recentupdated,setRecentUpdated]=useState([]);
const [Liked_by_TheCreator,setLikedBy_TheCreator]=useState([]);
const [What_SizeIsIt,setWhat_SizeIsIt]=useState('Normal');
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
    const [Mangas,setMangas]=useState('');
   var t=setTimeout(() =>{
    setStartShowing(true);
},5000)
if(StartShowing && data.Mangas){
    clearTimeout(t);
    hooe=data.Mangas.sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
    if(recentupdated.length < 6){
        fetch("http://localhost:5001/m/Lastest", {
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
                                        setRecentUpdated(resObject)
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
    }
    trending__list=data.Mangas.sort((a,b)=> parseFloat(b.Rating.length)-parseFloat(a.Rating.length));
    
    t=null;
   }
    
   const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true };
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
        if(Liked_by_TheCreator.length<4){
            var IneedHelp=[]
            try{
                fetch("http://localhost:5001/MangaLikedByAdmin/", {
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
                                            // setLikedBy_TheCreator(resObject)
                                            resObject[0].Liked.map((value,index)=>{
                                                fetch("http://localhost:5001/m/findbyid", {
                                                    method: "POST",
                                                    credentials: "include",
                                                    headers: {
                                                        Accept: "application/json",
                                                        "Content-Type": "application/json",
                                                        "Access-Control-Allow-Credentials": true,
                                                    },
                                                    body:JSON.stringify({
                                                        id:value
                                                     })
                                                })
                                                .then((response) => {
                                                    if (response.status === 200) return response.json();
                                                })
                                                .then((resObject2) => {
                                                    IneedHelp.push(resObject2)
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                    });
                                                    if(IneedHelp){
                                                        setLikedBy_TheCreator(IneedHelp)
                                                    }
                                                    })
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                    });
            }catch(e){
                console.log(e)
            }
        }
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
    

    return (
    <>
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>

		<section className="product spad">
        <div className="container" >
            <div className="row">
                <div className="col-lg-8">
                   
                        {
                            What_SizeIsIt ==='Normal' ? 
                            <>
                                    <div className="trending__product">
                                    <div className="row">
                                            <div className="col-lg-8 col-md-8 col-sm-8">
                                                <div className="section-title">
                                                    <h4>Trending Now</h4>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-sm-4">
                                                <div className="btn__all">
                                                    <a href="manga_trending/1" className="primary-btn">View All <span className="arrow_right"></span></a>
                                                </div>
                                            </div>
                                        </div>
                                <div className="row">
                                    {
                                        StartShowing && trending__list ? 
                                        trending__list.map((value,index)=>{
                                            if(index < 6){
                                        return(
                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="product__item">
                                        <div onClick={()=>{nav('/manga/'+value.Name)}} className="product__item__pic" key={value._id + index} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                                <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                            </div>
                                            <div className="product__item__text">
                                                <ul>
                                                {value.Genre.map((value3,index3)=>{
                                                        if(value3 !== null){
                                                            return(
                                                                <li>{value3}</li>
                                                            )
                                                        }
                                                    })}
                                                </ul>
                                                <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                            </div>
                                        </div>
                                    </div>);
                                            }
                                        }):
                                        <div className="col-lg-4 col-md-6 col-sm-6"> 
                                            <Skeleton variant="rectangular" animation="wave" width={750} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                            <br/>
                                            <Skeleton variant="rectangular" animation="wave" width={750} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                        </div>
                                    }
                                    </div>
                                    </div>
                                    <div className="popular__product">       
                                    <div className="row">
                                        <div className="col-lg-8 col-md-8 col-sm-8">
                                            <div className="section-title">
                                                <h4>Popular Mangas</h4>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                            <div className="btn__all">
                                            <Link to="/popular_mangas/" className="primary-btn">View All <span className="arrow_right"></span></Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                    {
                                        StartShowing && hooe ? 
                                        hooe.map((value,index)=>{
                                            if(index < 6){
                                        return(
                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="product__item">
                                        <div onClick={()=>{nav('/manga/'+value.Name)}} className="product__item__pic" key={value._id + index} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                                <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                            </div>
                                            <div className="product__item__text">
                                                <ul>
                                                    {value.Genre.map((value3,index3)=>{
                                                        if(value3 !== null){
                                                            return(
                                                                <li>{value3}</li>
                                                            )
                                                        }
                                                    })}
                                                </ul>
                                                <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                            </div>
                                        </div>
                                    </div>);
                                            }
                                        }):
                                        <div className="col-lg-4 col-md-6 col-sm-6"> 
                                            <Skeleton variant="rectangular" animation="wave" width={750} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                            <br/>
                                            <Skeleton variant="rectangular" animation="wave" width={750} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                        </div>
                                    }
                                    </div>
                                    </div>
                                    <div className="recent__product">
                                    <div className="row">
                                        <div className="col-lg-8 col-md-8 col-sm-8">
                                            <div className="section-title">
                                                <h4>Recently Added Mangas</h4>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                            <div className="btn__all">
                                                <Link to="/manga_list/1" className="primary-btn">View All <span className="arrow_right"></span></Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {
                                            StartShowing && recentupdated ? 
                                            recentupdated.map((value,index)=>{
                                                if(index <6 ){
                                                    return(
                                                    <div  className="col-lg-4 col-md-6 col-sm-6">
                                                                                <div  className="product__item">
                                                                                    <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name + value._id} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                                                                        <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                                                        <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                                                                    </div>
                                                                                    <div  className="product__item__text">
                                                                                        <ul>
                                                                                        {value.Genre.map((value3,index3)=>{
                                                                                            if(value3 !== null){
                                                                                                return(
                                                                                                    <li>{value3}</li>
                                                                                                )
                                                                                            }
                                                                                        })}
                                                                                        </ul>
                                                                                        <h5><a onClick={()=>nav('/manga/'+value.Name)} style={{cursor: 'pointer'}}>{value.Name}</a></h5>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                    );
                                                }
                                                    }): 
                                                <div className="col-lg-4 col-md-6 col-sm-6"> 
                                                    <Skeleton variant="rectangular" animation="wave" width={750} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                                    <br/>
                                                    <Skeleton variant="rectangular" animation="wave" width={750} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                                </div>
                                        }
                                        
                                    </div>
                                    </div>
                            </>
                            :
                            null
                        }
                        {
                            What_SizeIsIt ==='Meduim' ? 
                            <>
                                    <div className="trending__product">
                                    <div className="row">
                                            <div className="col-lg-8 col-md-8 col-sm-8">
                                                <div className="section-title">
                                                    <h4>Trending Now</h4>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-sm-4">
                                                <div className="btn__all">
                                                    <a href="manga_trending/1" className="primary-btn">View All <span className="arrow_right"></span></a>
                                                </div>
                                            </div>
                                        </div>
                                <div className="row">
                                    {
                                        StartShowing && trending__list ? 
                                        trending__list.map((value,index)=>{
                                            if(index < 6){
                                        return(
                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="product__item">
                                        <div onClick={()=>{nav('/manga/'+value.Name)}} className="product__item__pic" key={value._id + index} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                                <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                            </div>
                                            <div className="product__item__text">
                                                <ul>
                                                {value.Genre.map((value3,index3)=>{
                                                        if(value3 !== null){
                                                            return(
                                                                <li>{value3}</li>
                                                            )
                                                        }
                                                    })}
                                                </ul>
                                                <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                            </div>
                                        </div>
                                    </div>);
                                            }
                                        }):
                                        <div className="col-lg-4 col-md-6 col-sm-6"> 
                                            <Skeleton variant="rectangular" animation="wave" width={(60 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                            <br/>
                                            <Skeleton variant="rectangular" animation="wave" width={(60 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                        </div>
                                    }
                                    </div>
                                    </div>
                                    <div className="popular__product">       
                                    <div className="row">
                                        <div className="col-lg-8 col-md-8 col-sm-8">
                                            <div className="section-title">
                                                <h4>Popular Mangas</h4>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                            <div className="btn__all">
                                            <Link to="/popular_mangas/" className="primary-btn">View All <span className="arrow_right"></span></Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                    {
                                        StartShowing && hooe ? 
                                        hooe.map((value,index)=>{
                                            if(index < 6){
                                        return(
                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="product__item">
                                        <div onClick={()=>{nav('/manga/'+value.Name)}} className="product__item__pic" key={value._id + index} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                                <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                            </div>
                                            <div className="product__item__text">
                                                <ul>
                                                    {value.Genre.map((value3,index3)=>{
                                                        if(value3 !== null){
                                                            return(
                                                                <li>{value3}</li>
                                                            )
                                                        }
                                                    })}
                                                </ul>
                                                <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                            </div>
                                        </div>
                                    </div>);
                                            }
                                        }):
                                        <div className="col-lg-4 col-md-6 col-sm-6"> 
                                            <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                            <br/>
                                            <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                        </div>
                                    }
                                    </div>
                                    </div>
                                    <div className="recent__product">
                                    <div className="row">
                                        <div className="col-lg-8 col-md-8 col-sm-8">
                                            <div className="section-title">
                                                <h4>Recently Added Mangas</h4>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4">
                                            <div className="btn__all">
                                                <Link to="/manga_list/1" className="primary-btn">View All <span className="arrow_right"></span></Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {
                                            StartShowing && recentupdated ? 
                                            recentupdated.map((value,index)=>{
                                                if(index <6 ){
                                                    return(
                                                    <div  className="col-lg-4 col-md-6 col-sm-6">
                                                                                <div  className="product__item">
                                                                                    <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name + value._id} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                                                                        <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                                                        <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                                                                    </div>
                                                                                    <div  className="product__item__text">
                                                                                        <ul>
                                                                                        {value.Genre.map((value3,index3)=>{
                                                                                            if(value3 !== null){
                                                                                                return(
                                                                                                    <li>{value3}</li>
                                                                                                )
                                                                                            }
                                                                                        })}
                                                                                        </ul>
                                                                                        <h5><a onClick={()=>nav('/manga/'+value.Name)} style={{cursor: 'pointer'}}>{value.Name}</a></h5>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                    );
                                                }
                                                    }): 
                                                <div className="col-lg-4 col-md-6 col-sm-6"> 
                                                    <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                                    <br/>
                                                    <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                                </div>
                                        }
                                        
                                    </div>
                                    </div>
                            </>
                            :null
                        }
                        {
                            What_SizeIsIt === 'Tablet' ? 
                            <>
                            <div className="trending__product">
                            <div className="row">
                                    <div className="col-lg-8 col-md-8 col-sm-8">
                                        <div className="section-title">
                                            <h4>Trending Now</h4>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4">
                                        <div className="btn__all">
                                            <a href="manga_trending/1" className="primary-btn">View All <span className="arrow_right"></span></a>
                                        </div>
                                    </div>
                                </div>
                            <div className="row">
                            {
                                StartShowing && trending__list ? 
                                trending__list.map((value,index)=>{
                                    if(index < 6){
                                return(
                                <div className="col-lg-4 col-md-6 col-sm-6">
                                <div className="product__item">
                                <div onClick={()=>{nav('/manga/'+value.Name)}} className="product__item__pic" key={value._id + index} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                        <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                        <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                    </div>
                                    <div className="product__item__text">
                                        <ul>
                                        {value.Genre.map((value3,index3)=>{
                                                if(value3 !== null){
                                                    return(
                                                        <li>{value3}</li>
                                                    )
                                                }
                                            })}
                                        </ul>
                                        <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                    </div>
                                </div>
                            </div>
                            );
                                    }
                                }):
                                <div className="col-lg-4 col-md-6 col-sm-6"> 
                                    <Skeleton variant="rectangular" animation="wave" width={(70 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                    <br/>
                                    <Skeleton variant="rectangular" animation="wave" width={(70 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                </div>
                            }
                            </div>
                            </div>
                             <div className="popular__product">   
                             <div className="row">
                                 <div className="col-lg-8 col-md-8 col-sm-8">
                                     <div className="section-title">
                                         <h4>Popular Mangas</h4>
                                     </div>
                                 </div>
                                 <div className="col-lg-4 col-md-4 col-sm-4">
                                     <div className="btn__all">
                                     <Link to="/popular_mangas/" className="primary-btn">View All <span className="arrow_right"></span></Link>
                                     </div>
                                 </div>
                             </div>
                             <div className="row">
                             {
                                 StartShowing && hooe ? 
                                 hooe.map((value,index)=>{
                                     if(index < 6){
                                 return(
                                 <div className="col-lg-4 col-md-6 col-sm-6">
                                 <div className="product__item">
                                 <div onClick={()=>{nav('/manga/'+value.Name)}} className="product__item__pic" key={value._id + index} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                         <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                         <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                     </div>
                                     <div className="product__item__text">
                                         <ul>
                                             {value.Genre.map((value3,index3)=>{
                                                 if(value3 !== null){
                                                     return(
                                                         <li>{value3}</li>
                                                     )
                                                 }
                                             })}
                                         </ul>
                                         <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                     </div>
                                 </div>
                             </div>);
                                     }
                                 }):
                                 <div className="col-lg-4 col-md-6 col-sm-6"> 
                                    <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                    <br/>
                                    <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                </div>
                             }
                             </div>
                         </div>
                          <div className="recent__product">
                              <div className="row">
                                  <div className="col-lg-8 col-md-8 col-sm-8">
                                      <div className="section-title">
                                          <h4>Recently Added Mangas</h4>
                                      </div>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-4">
                                      <div className="btn__all">
                                          <Link to="/manga_list/1" className="primary-btn">View All <span className="arrow_right"></span></Link>
                                      </div>
                                  </div>
                              </div>
                              <div className="row">
                                  {
                                      StartShowing && recentupdated ? 
                                      recentupdated.map((value,index)=>{
                                          if(index <6 ){
                                              return(
                                              <div  className="col-lg-4 col-md-6 col-sm-6">
                                                                          <div  className="product__item">
                                                                              <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name + value._id} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                                                                  <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                                                  <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                                                              </div>
                                                                              <div  className="product__item__text">
                                                                                  <ul>
                                                                                  {value.Genre.map((value3,index3)=>{
                                                                                      if(value3 !== null){
                                                                                          return(
                                                                                              <li>{value3}</li>
                                                                                          )
                                                                                      }
                                                                                  })}
                                                                                  </ul>
                                                                                  <h5><a onClick={()=>nav('/manga/'+value.Name)} style={{cursor: 'pointer'}}>{value.Name}</a></h5>
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                              );
                                          }
                                             }): 
                                             <div className="col-lg-4 col-md-6 col-sm-6"> 
                                             <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                             <br/>
                                             <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                         </div>
                                  }
                                 
                              </div>
                          </div>
                            </>
                            :null
                        }
                        {What_SizeIsIt ==='Wide Mobile' ? 
                        <>
                           <div className="trending__product">
                           <div className="row">
                                   <div className="col-lg-8 col-md-8 col-sm-8">
                                       <div className="section-title">
                                           <h4>Trending Now</h4>
                                       </div>
                                   </div>
                                   <div className="col-lg-4 col-md-4 col-sm-4">
                                       <div className="btn__all">
                                           <a href="manga_trending/1" className="primary-btn">View All <span className="arrow_right"></span></a>
                                       </div>
                                   </div>
                               </div>
                         <div className="row">
                         {
                             StartShowing && trending__list ? 
                             trending__list.map((value,index)=>{
                                 if(index < 6){
                             return(
                             <div className="col-lg-4 col-md-6 col-sm-6">
                             <div className="product__item">
                             <div onClick={()=>{nav('/manga/'+value.Name)}} className="product__item__pic" key={value._id + index} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                     <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                     <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                 </div>
                                 <div className="product__item__text">
                                     <ul>
                                     {value.Genre.map((value3,index3)=>{
                                             if(value3 !== null){
                                                 return(
                                                     <li>{value3}</li>
                                                 )
                                             }
                                         })}
                                     </ul>
                                     <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                 </div>
                             </div>
                         </div>);
                                 }
                             }):
                             <div className="col-lg-4 col-md-6 col-sm-6"> 
                                 <Skeleton variant="rectangular" animation="wave" width={(75 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                 <br/>
                                 <Skeleton variant="rectangular" animation="wave" width={(75 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                             </div>
                         }
                         </div>
                         </div>
                          <div className="popular__product">
                       
                          <div className="row">
                              <div className="col-lg-8 col-md-8 col-sm-8">
                                  <div className="section-title">
                                      <h4>Popular Mangas</h4>
                                  </div>
                              </div>
                              <div className="col-lg-4 col-md-4 col-sm-4">
                                  <div className="btn__all">
                                  <Link to="/popular_mangas/" className="primary-btn">View All <span className="arrow_right"></span></Link>
                                  </div>
                              </div>
                          </div>
                          <div className="row">
                          {
                              StartShowing && hooe ? 
                              hooe.map((value,index)=>{
                                  if(index < 6){
                              return(
                              <div className="col-lg-4 col-md-6 col-sm-6">
                              <div className="product__item">
                              <div onClick={()=>{nav('/manga/'+value.Name)}} className="product__item__pic" key={value._id + index} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                      <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                      <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                  </div>
                                  <div className="product__item__text">
                                      <ul>
                                          {value.Genre.map((value3,index3)=>{
                                              if(value3 !== null){
                                                  return(
                                                      <li>{value3}</li>
                                                  )
                                              }
                                          })}
                                      </ul>
                                      <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                  </div>
                              </div>
                          </div>);
                                  }
                              }):
                              <div className="col-lg-4 col-md-6 col-sm-6"> 
                                 <Skeleton variant="rectangular" animation="wave" width={(75 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                 <br/>
                                 <Skeleton variant="rectangular" animation="wave" width={(75 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                             </div>
                          }
                          </div>
                      </div>
                       <div className="recent__product">
                           <div className="row">
                               <div className="col-lg-8 col-md-8 col-sm-8">
                                   <div className="section-title">
                                       <h4>Recently Added Mangas</h4>
                                   </div>
                               </div>
                               <div className="col-lg-4 col-md-4 col-sm-4">
                                   <div className="btn__all">
                                       <Link to="/manga_list/1" className="primary-btn">View All <span className="arrow_right"></span></Link>
                                   </div>
                               </div>
                           </div>
                           <div className="row">
                               {
                                   StartShowing && recentupdated ? 
                                   recentupdated.map((value,index)=>{
                                       if(index <6 ){
                                           return(
                                           <div  className="col-lg-4 col-md-6 col-sm-6">
                                                                       <div  className="product__item">
                                                                           <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name + value._id} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                                                               <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                                               <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                                                           </div>
                                                                           <div  className="product__item__text">
                                                                               <ul>
                                                                               {value.Genre.map((value3,index3)=>{
                                                                                   if(value3 !== null){
                                                                                       return(
                                                                                           <li>{value3}</li>
                                                                                       )
                                                                                   }
                                                                               })}
                                                                               </ul>
                                                                               <h5><a onClick={()=>nav('/manga/'+value.Name)} style={{cursor: 'pointer'}}>{value.Name}</a></h5>
                                                                           </div>
                                                                       </div>
                                                                   </div>
                                           );
                                       }
                                          }): 
                                        <div className="col-lg-4 col-md-6 col-sm-6"> 
                                          <Skeleton variant="rectangular" animation="wave" width={(75 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                          <br/>
                                          <Skeleton variant="rectangular" animation="wave" width={(75 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                      </div>
                               }
                              
                           </div>
                       </div>
                        </>
                        :null}
                        {What_SizeIsIt === 'Small Mobile' ? 
                        <>
                          <div className="trending__product">
                          <div className="row">
                                  <div className="col-lg-8 col-md-8 col-sm-8">
                                      <div className="section-title">
                                          <h4>Trending Now</h4>
                                      </div>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-4">
                                      <div className="btn__all">
                                          <a href="manga_trending/1" className="primary-btn">View All <span className="arrow_right"></span></a>
                                      </div>
                                  </div>
                              </div>
                        <div className="row">
                        {
                            StartShowing && trending__list ? 
                            trending__list.map((value,index)=>{
                                if(index < 6){
                            return(
                            <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="product__item">
                            <div onClick={()=>{nav('/manga/'+value.Name)}} className="product__item__pic" key={value._id + index} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                    <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                    <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                </div>
                                <div className="product__item__text">
                                    <ul>
                                    {value.Genre.map((value3,index3)=>{
                                            if(value3 !== null){
                                                return(
                                                    <li>{value3}</li>
                                                )
                                            }
                                        })}
                                    </ul>
                                    <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                </div>
                            </div>
                        </div>);
                                }
                            }):
                            <div className="col-lg-4 col-md-6 col-sm-6"> 
                                <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                <br/>
                                <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                            </div>
                        }
                        </div>
                        </div>
                         <div className="popular__product">
                       
                         <div className="row">
                             <div className="col-lg-8 col-md-8 col-sm-8">
                                 <div className="section-title">
                                     <h4>Popular Mangas</h4>
                                 </div>
                             </div>
                             <div className="col-lg-4 col-md-4 col-sm-4">
                                 <div className="btn__all">
                                 <Link to="/popular_mangas/" className="primary-btn">View All <span className="arrow_right"></span></Link>
                                 </div>
                             </div>
                         </div>
                         <div className="row">
                         {
                             StartShowing && hooe ? 
                             hooe.map((value,index)=>{
                                 if(index < 6){
                             return(
                             <div className="col-lg-4 col-md-6 col-sm-6">
                             <div className="product__item">
                             <div onClick={()=>{nav('/manga/'+value.Name)}} className="product__item__pic" key={value._id + index} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                     <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                     <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                 </div>
                                 <div className="product__item__text">
                                     <ul>
                                         {value.Genre.map((value3,index3)=>{
                                             if(value3 !== null){
                                                 return(
                                                     <li>{value3}</li>
                                                 )
                                             }
                                         })}
                                     </ul>
                                     <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                 </div>
                             </div>
                         </div>);
                                 }
                             }):
                             <div className="col-lg-4 col-md-6 col-sm-6"> 
                             <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                             <br/>
                             <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                         </div>
                         }
                         </div>
                     </div>
                      <div className="recent__product">
                          <div className="row">
                              <div className="col-lg-8 col-md-8 col-sm-8">
                                  <div className="section-title">
                                      <h4>Recently Added Mangas</h4>
                                  </div>
                              </div>
                              <div className="col-lg-4 col-md-4 col-sm-4">
                                  <div className="btn__all">
                                      <Link to="/manga_list/1" className="primary-btn">View All <span className="arrow_right"></span></Link>
                                  </div>
                              </div>
                          </div>
                          <div className="row">
                              {
                                  StartShowing && recentupdated ? 
                                  recentupdated.map((value,index)=>{
                                      if(index <6 ){
                                          return(
                                          <div  className="col-lg-4 col-md-6 col-sm-6">
                                                                      <div  className="product__item">
                                                                          <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name + value._id} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundSize:'100% 100%',backgroundRepeat: 'no-repeat',cursor: 'pointer' }}>
                                                                              <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                                              <div className="view"><i className="fa fa-eye"></i> {value.views}</div>
                                                                          </div>
                                                                          <div  className="product__item__text">
                                                                              <ul>
                                                                              {value.Genre.map((value3,index3)=>{
                                                                                  if(value3 !== null){
                                                                                      return(
                                                                                          <li>{value3}</li>
                                                                                      )
                                                                                  }
                                                                              })}
                                                                              </ul>
                                                                              <h5><a onClick={()=>nav('/manga/'+value.Name)} style={{cursor: 'pointer'}}>{value.Name}</a></h5>
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                          );
                                      }
                                         }): 
                                    <div className="col-lg-4 col-md-6 col-sm-6"> 
                                         <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                         <br/>
                                         <Skeleton variant="rectangular" animation="wave" width={(90 * width)/100} height={(30 * height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                     </div>
                              }
                             
                          </div>
                      </div>
                        </>
                        :null}

                    
                </div>
                {What_SizeIsIt === 'Normal' ? 
                <div className="col-lg-4 col-md-6 col-sm-8">
                    <div className="product__sidebar">
                        <div className="product__sidebar__view">
                            <div className="section-title">
                                <h5>Liked By The Creator</h5>
                            </div>
                            <div className="filter__gallery">
                            {StartShowing &&Liked_by_TheCreator.length >0 ?
                                Liked_by_TheCreator.map((value,index)=>{
                                    if(index < 4){
                                        return(
                                            <div key={value[0]._id} className="product__sidebar__view__item mix day years"
                                            style={{ backgroundImage: `url(${value[0].PictureLink})`,backgroundSize:'100% ',backgroundRepeat:'no-repeat',cursor: 'pointer' }}>
                                            
                                            <div  className="ep">{value[0].data[value[0].data.length -1].counter}</div>
                                            <div className="view"><i className="fa fa-eye"></i> {value[0].views}</div>
                                            <h5><a onClick={()=>nav('/manga/'+value[0].Name)}>{value[0].Name}</a></h5>
                                        </div>
                                            );
                                    }
                                })
                            :null}
                        </div>
                    </div>
                </div>
            </div>
                :null}
                {What_SizeIsIt === 'Meduim' ? 
                <div className="col-lg-4 col-md-6 col-sm-8">
                <div className="product__sidebar">
                    <div className="product__sidebar__view">
                        <div className="section-title">
                            <h5>Liked By The Creator</h5>
                        </div>
                        <div className="filter__gallery">
                        {StartShowing &&Liked_by_TheCreator.length >0 ?
                            Liked_by_TheCreator.map((value,index)=>{
                                if(index < 4){
                                    return(
                                        <div key={value[0]._id} className="product__sidebar__view__item mix day years"
                                        style={{ backgroundImage: `url(${value[0].PictureLink})`,backgroundSize:'100% ',backgroundRepeat:'no-repeat',cursor: 'pointer' }}>
                                        
                                        <div  className="ep">{value[0].data[value[0].data.length -1].counter}</div>
                                        <div className="view"><i className="fa fa-eye"></i> {value[0].views}</div>
                                        <h5><a onClick={()=>nav('/manga/'+value[0].Name)}>{value[0].Name}</a></h5>
                                    </div>
                                        );
                                }
                            })
                        :null}
                    </div>
                </div>
            </div>
                </div>
                :null}
                {What_SizeIsIt === 'Tablet' ? 
                <div className="col-lg-4 col-md-6 col-sm-8">
                <div className="product__sidebar">
                    <div className="product__sidebar__view">
                        <div className="section-title">
                            <h5>Liked By The Creator</h5>
                        </div>
                        <div className="filter__gallery">
                        {StartShowing &&Liked_by_TheCreator.length >0 ?
                            Liked_by_TheCreator.map((value,index)=>{
                                if(index < 4){
                                    return(
                                        <div key={value[0]._id} className="product__sidebar__view__item mix day years"
                                        style={{ backgroundImage: `url(${value[0].PictureLink})`,width:'700px',backgroundSize:'100% ',backgroundRepeat:'no-repeat',cursor: 'pointer' }}>
                                        
                                        <div  className="ep">{value[0].data[value[0].data.length -1].counter}</div>
                                        <div className="view"><i className="fa fa-eye"></i> {value[0].views}</div>
                                        <h5><a onClick={()=>nav('/manga/'+value[0].Name)}>{value[0].Name}</a></h5>
                                    </div>
                                        );
                                }
                            })
                        :null}
                    </div>
                </div>
            </div>
            </div>
                :null}
                {What_SizeIsIt === 'Wide Mobile' ? 
                <div className="col-lg-4 col-md-6 col-sm-8">
                <div className="product__sidebar">
                    <div className="product__sidebar__view">
                        <div className="section-title">
                            <h5>Liked By The Creator</h5>
                        </div>
                        <div className="filter__gallery">
                        {StartShowing &&Liked_by_TheCreator.length >0 ?
                            Liked_by_TheCreator.map((value,index)=>{
                                if(index < 4){
                                    return(
                                        <div key={value[0]._id} className="product__sidebar__view__item mix day years"
                                        style={{ backgroundImage: `url(${value[0].PictureLink})`,width:`500px`,backgroundSize:'100%',backgroundRepeat:'no-repeat',cursor: 'pointer' }}>
                                        
                                        <div  className="ep">{value[0].data[value[0].data.length -1].counter}</div>
                                        <div className="view"><i className="fa fa-eye"></i> {value[0].views}</div>
                                        <h5><a onClick={()=>nav('/manga/'+value[0].Name)}>{value[0].Name}</a></h5>
                                    </div>
                                        );
                                }
                            })
                        :null}
                    </div>
                </div>
            </div>
            </div>
                :null}
                {What_SizeIsIt === 'Small Mobile' ? 
                <div className="col-lg-4 col-md-6 col-sm-8">
                <div className="product__sidebar">
                    <div className="product__sidebar__view">
                        <div className="section-title">
                            <h5>Liked By The Creator</h5>
                        </div>
                        <div className="filter__gallery">
                        {StartShowing &&Liked_by_TheCreator.length >0 ?
                            Liked_by_TheCreator.map((value,index)=>{
                                if(index < 4){
                                    return(
                                        <div key={value[0]._id} className="product__sidebar__view__item mix day years"
                                        style={{ backgroundImage: `url(${value[0].PictureLink})`,backgroundSize:'100% ',backgroundRepeat:'no-repeat',cursor: 'pointer' }}>
                                        
                                        <div  className="ep">{value[0].data[value[0].data.length -1].counter}</div>
                                        <div className="view"><i className="fa fa-eye"></i> {value[0].views}</div>
                                        <h5><a onClick={()=>nav('/manga/'+value[0].Name)}>{value[0].Name}</a></h5>
                                    </div>
                                        );
                                }
                            })
                        :null}
                    </div>
                </div>
            </div>
            </div>
                :null}

        </div>
    </div>
		</section>
		<Footer/>
        {/* <ScrollButton/> */}
        </ThemeProvider>
	</>
	)
}

export default Home