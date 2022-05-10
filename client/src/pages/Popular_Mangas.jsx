import { useState ,useEffect} from 'react'
import '../pages-css/Home.css'
import {useLocation,Link,useNavigate} from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Footer from "./footer";
import Header from "./header";
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';

function Popular_Mangas({data}) {
    const nav=useNavigate();
    var hooe=[];
    let restofmangastoshowmore=[];
    const [theme, setTheme] = useState('dark');
	const isDarkTheme = theme === "dark";
    const [Liked_by_TheCreator,setLikedBy_TheCreator]=useState([]);
    const [What_SizeIsIt,setWhat_SizeIsIt]=useState('Normal');

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
    const [Changed,setChanged]=useState('Show More');
    const [StartShowing,setStartShowing]=useState(false);
    const [ShowMore, setShowMore] = useState(false);
    const testinganimation=false;

    const ShowMoreNow=()=>{
        if(ShowMore){
            setShowMore(false);
            setChanged('Show More')
        }
        else{
            setShowMore(true);
            setChanged('Show Less')
        }
        console.log('id changed')
    }
    var t=setTimeout(() =>{
        setStartShowing(true);
    },5000)
    if(StartShowing){
        clearTimeout(t);
        hooe=data.Mangas.sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
        console.log(hooe);
        t=null;
       }

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
     
 
    const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true};
    
    return (
    <>
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>
        

        <section className="product-page spad">
        <div className="container">
        {What_SizeIsIt==='Normal' ? 
            <div className="row">
                <div className="col-lg-8">
                    <div className="product__page__content">
                        <div className="product__page__title">
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-sm-6">
                                    <div className="section-title" style={{marginBottom:'20px'}}>
                                        <h4>Popular</h4>
                                    </div>
                                </div>
                                <div className="row">
                        {
                            StartShowing ? 
                            hooe.map((value,index)=>{
                                if(index < 21){
                                    return(
                            <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="product__item">
                            <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})`,cursor: 'pointer' }}>
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
                                    <h5><a onClick={()=>nav('/manga/'+value.Name)} style={{cursor: 'pointer'}}>{value.Name}</a></h5>
                                </div>
                            </div>
                        </div>);
                                }
                                else{
                                    restofmangastoshowmore.push(value); 
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
                        </div>          
                    </div>
                    <div className="row">
                            {
                                ShowMore ?
                                restofmangastoshowmore.map((value,index) => {
                                        return(
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                            <div  className="product__item">
                                                                {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                <div  className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})` }}>
                                                                    <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                                    <div className="view"><i className="fa fa-eye"></i>  {value.views}</div>
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
                                                                    <h5><a href="#">{value.Name}</a></h5>
                                                                </div>
                                            </div>
                                        </div>        
                                        );
                                }) : null
                                }

                        </div>
                        {
                            StartShowing ? 
                            <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
                            :null
                        }
                </div>
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
                                            style={{ backgroundImage: `url(${value[0].PictureLink})`,cursor: 'pointer' }}>
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
        </div>
        :null}

    {What_SizeIsIt==='Meduim' ? 
        
        <div className="row">
            <div className="col-lg-8">
                <div className="product__page__content">
                    <div className="product__page__title">
                        <div className="row">
                            <div className="col-lg-8 col-md-8 col-sm-6">
                                <div className="section-title" style={{marginBottom:'20px'}}>
                                    <h4>Popular</h4>
                                </div>
                            </div>
                            <div className="row">
                    {
                        StartShowing ? 
                        hooe.map((value,index)=>{
                            if(index < 21){
                                return(
                        <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="product__item">
                        <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value.PictureLink})`,cursor: 'pointer' }}>
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
                                <h5><a onClick={()=>nav('/manga/'+value.Name)} style={{cursor: 'pointer'}}>{value.Name}</a></h5>
                            </div>
                        </div>
                    </div>);
                            }
                            else{
                                restofmangastoshowmore.push(value); 
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
                    </div>          
                </div>
                <div className="row">
                        {
                            ShowMore ?
                            restofmangastoshowmore.map((value,index) => {
                                    return(
                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div  className="product__item">
                                                            {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                            <div  className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})` }}>
                                                                <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                                <div className="view"><i className="fa fa-eye"></i>  {value.views}</div>
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
                                                                <h5><a href="#">{value.Name}</a></h5>
                                                            </div>
                                        </div>
                                    </div>        
                                    );
                            }) : null
                            }

                    </div>
                    {
                        StartShowing ? 
                        <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
                        :null
                    }
            </div>
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
                                        style={{ backgroundImage: `url(${value[0].PictureLink})`,cursor: 'pointer' }}>
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
    </div>
    :null}

    {What_SizeIsIt==='Tablet' ? 
        
        <div className="row">
            <div className="col-lg-8">
                <div className="product__page__content">
                    <div className="product__page__title">
                        <div className="row">
                            <div className="col-lg-8 col-md-8 col-sm-6">
                                <div className="section-title" style={{marginBottom:'20px'}}>
                                    <h4>Popular</h4>
                                </div>
                            </div>
                            <div className="row">
                    {
                        StartShowing ? 
                        hooe.map((value,index)=>{
                            if(index < 20){
                                return(
                        <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="product__item">
                        <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value.PictureLink})`,cursor: 'pointer' }}>
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
                                <h5><a onClick={()=>nav('/manga/'+value.Name)} style={{cursor: 'pointer'}}>{value.Name}</a></h5>
                            </div>
                        </div>
                    </div>);
                            }
                            else{
                                restofmangastoshowmore.push(value); 
                            }
                        }): 
                        <div className="col-lg-4 col-md-6 col-sm-6"> 
                        <Skeleton variant="rectangular" animation="wave" width={700} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                        <br/>
                        <Skeleton variant="rectangular" animation="wave" width={700} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                        </div>
                    }
                    </div>
                        </div>
                    </div>          
                </div>
                <div className="row">
                        {
                            ShowMore ?
                            restofmangastoshowmore.map((value,index) => {
                                    return(
                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div  className="product__item">
                                                            {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                            <div  className="product__item__pic" key={value.Name} style={{ backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value.PictureLink})` }}>
                                                                <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                                <div className="view"><i className="fa fa-eye"></i>  {value.views}</div>
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
                                                                <h5><a href="#">{value.Name}</a></h5>
                                                            </div>
                                        </div>
                                    </div>        
                                    );
                            }) : null
                            }

                    </div>
                    {
                        StartShowing ? 
                        <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
                        :null
                    }
            </div>
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
                                        style={{ backgroundImage: `url(${value[0].PictureLink})`,cursor: 'pointer' }}>
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
    </div>
        :null}

    {What_SizeIsIt==='Wide Mobile' ?     
        <div className="row">
            <div className="col-lg-8">
                <div className="product__page__content">
                    <div className="product__page__title">
                        <div className="row">
                            <div className="col-lg-8 col-md-8 col-sm-6">
                                <div className="section-title" style={{marginBottom:'20px'}}>
                                    <h4>Popular</h4>
                                </div>
                            </div>
                            <div className="row">
                    {
                        StartShowing ? 
                        hooe.map((value,index)=>{
                            if(index < 20){
                                return(
                        <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="product__item">
                        <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value.PictureLink})`,cursor: 'pointer' }}>
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
                                <h5><a onClick={()=>nav('/manga/'+value.Name)} style={{cursor: 'pointer'}}>{value.Name}</a></h5>
                            </div>
                        </div>
                    </div>);
                            }
                            else{
                                restofmangastoshowmore.push(value); 
                            }
                        }): 
                        <div className="col-lg-4 col-md-6 col-sm-6"> 
                        <Skeleton variant="rectangular" animation="wave" width={400} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                        <br/>
                        <Skeleton variant="rectangular" animation="wave" width={400} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                        </div>
                    }
                    </div>
                        </div>
                    </div>          
                </div>
                <div className="row">
                        {
                            ShowMore ?
                            restofmangastoshowmore.map((value,index) => {
                                    return(
                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div  className="product__item">
                                                            {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                            <div  className="product__item__pic" key={value.Name} style={{ backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value.PictureLink})` }}>
                                                                <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                                <div className="view"><i className="fa fa-eye"></i>  {value.views}</div>
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
                                                                <h5><a href="#">{value.Name}</a></h5>
                                                            </div>
                                        </div>
                                    </div>        
                                    );
                            }) : null
                            }

                    </div>
                    {
                        StartShowing ? 
                        <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
                        :null
                    }
            </div>
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
                                        style={{ width:'500px',backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value[0].PictureLink})`,cursor: 'pointer' }}>
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
    </div>
    :null}

    {What_SizeIsIt==='Small Mobile' ? 
        
        <div className="row">
            <div className="col-lg-8">
                <div className="product__page__content">
                    <div className="product__page__title">
                        <div className="row">
                            <div className="col-lg-8 col-md-8 col-sm-6">
                                <div className="section-title" style={{marginBottom:'20px'}}>
                                    <h4>Popular</h4>
                                </div>
                            </div>
                            <div className="row">
                    {
                        StartShowing ? 
                        hooe.map((value,index)=>{
                            if(index < 21){
                                return(
                        <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="product__item">
                        <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value.PictureLink})`,cursor: 'pointer' }}>
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
                                <h5><a onClick={()=>nav('/manga/'+value.Name)} style={{cursor: 'pointer'}}>{value.Name}</a></h5>
                            </div>
                        </div>
                    </div>);
                            }
                            else{
                                restofmangastoshowmore.push(value); 
                            }
                        }): 
                        <div className="col-lg-4 col-md-6 col-sm-6"> 
                        <Skeleton variant="rectangular" animation="wave" width={300} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                        <br/>
                        <Skeleton variant="rectangular" animation="wave" width={300} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                        </div>
                    }
                    </div>
                        </div>
                    </div>          
                </div>
                <div className="row">
                        {
                            ShowMore ?
                            restofmangastoshowmore.map((value,index) => {
                                    return(
                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div  className="product__item">
                                                            {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                            <div  className="product__item__pic" key={value.Name} style={{backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value.PictureLink})` }}>
                                                                <div  className="ep">{value.data[value.data.length -1].counter}</div>
                                                                <div className="view"><i className="fa fa-eye"></i>  {value.views}</div>
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
                                                                <h5><a href="#">{value.Name}</a></h5>
                                                            </div>
                                        </div>
                                    </div>        
                                    );
                            }) : null
                            }

                    </div>
                    {
                        StartShowing ? 
                        <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
                        :null
                    }
            </div>
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
                                        style={{ backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value[0].PictureLink})`,cursor: 'pointer' }}>
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
    </div>
    :null}

</div>
</section>
        <Footer/>
        </ThemeProvider>
		</>
	)
}

export default Popular_Mangas