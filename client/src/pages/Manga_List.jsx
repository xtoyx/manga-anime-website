import { useEffect, useState } from 'react'
import {Link,useParams,useNavigate} from 'react-router-dom';
import '../pages-css/Home.css'
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Header from "./header";
import Footer from "./footer";
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';

function Manga_List({data}) {
	
    const nav=useNavigate();
	/*conditions for header 
    profile page is logoutava:false,firsttime:false 
    logout page is profileava:true,firsttime:true 
    anything else will be everything true 
    */
    const [theme, setTheme] = useState('dark');
    const [What_SizeIsIt,setWhat_SizeIsIt]=useState('Normal');
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
    const [Howmanypages,setHowmanyPages] = useState('');
    const [Liked_by_TheCreator,setLikedBy_TheCreator]=useState(null);
    const [recentupdated,setRecentUpdated]=useState(null);

    let {id}=useParams()
    id=parseInt(id)
    const [toggleState, setToggleState] = useState();
    const toggleTab = (index) => {
        setToggleState(index)
        console.log(index)
        Document.getElementById('page123').className='current-page'
        // setToggleState(index);
    };
    
    var t=setTimeout(() =>{
    setStartShowing(true);
},3000)
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
if(StartShowing){
    clearTimeout(t);
    if(recentupdated===null){
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
    t=null;
   }
   useEffect(() => {
    if(Liked_by_TheCreator===null){
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
            <div className="row">
                        {What_SizeIsIt ==='Normal'?   
                <div className="col-lg-8">
                    <div className="product__page__content">
                        <div className="product__page__title">
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-sm-6">
                                    <div className="section-title">
                                        <h4>Recent Mangas</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">      
                                {
                                    StartShowing && recentupdated ? 
                                    recentupdated.map((value,index)=>{
                                        if(id==1){
                                            if(index < (21) ){
                                                return(
                                                    <div className="col-lg-4 col-md-6 col-sm-6">
                                                            <div  className="product__item">
                                                                                {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                                <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})`,cursor: 'pointer' }}>
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
                                        }
                                        if(id > 1){
                                            if(index < (21 * id +1) && index > (21 * (id-1))){
                                                    return(
                                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                                                <div  className="product__item">
                                                                                    {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                                    <div  onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})` }}>
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
                                                                                        <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                                                                    </div>
                                                                </div>
                                                            </div>        
                                                    );
                                                }  
                                        }
                                }): <div className="col-lg-4 col-md-6 col-sm-6"> 
                                <Skeleton variant="rectangular" animation="wave" width={750} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                <br/>
                                <Skeleton variant="rectangular" animation="wave" width={750} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                </div>
                            }
                            </div>
                        </div>
                        {
                            StartShowing && data.Mangas ?
                    <div className="product__pagination">
                        {/* important
                            after someone click the page button make a preload animation for 2 sec then go next page
                         */}
                    <Link 
                     className={toggleState === {id} ? "current-page" : null}

                     onClick={()=>toggleTab(id)}
                     to={`/manga_list/`+(id)}>{id}</Link>

                    <Link className={(toggleState ==({id}+1)) ? "current-page" : null}
                     onClick={()=>toggleTab(id + 1)} to={`/manga_list/`+(id+1)}
                     id='page123'
                     >{id+1}</Link>

                    <Link className={toggleState === ({id}+2) ? "current-page" : null}
                     onClick={() => toggleTab({id}+2)} to={`/manga_list/`+(id+2)}>{id+2}</Link>

                    <Link className={toggleState === {id}+3 ? "current-page" : null}
                     onClick={() => toggleTab({id}+3)} to={`/manga_list/`+(id+3)}>{id+3}</Link>

                    <Link className={toggleState === {id}+4 ? "current-page" : null}
                     onClick={() => toggleTab({id}+4)} to={`/manga_list/`+(id+4)}>{id+4}</Link> 

                        <a href="#"><i className="fa fa-angle-double-right"></i></a>
                    </div> 
                    :<Skeleton variant="text" animation="wave" height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                        }
                </div>
                        : null}
                        {What_SizeIsIt ==='Normal' ?  
                        
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
                        :null}

                        {What_SizeIsIt ==='Meduim'?   
                <div className="col-lg-8">
                    <div className="product__page__content">
                        <div className="product__page__title">
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-sm-6">
                                    <div className="section-title">
                                        <h4>Recent Mangas</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">      
                                {
                                    StartShowing && recentupdated ? 
                                    recentupdated.map((value,index)=>{
                                        if(id==1){
                                            if(index < (21) ){
                                                return(
                                                    <div className="col-lg-4 col-md-6 col-sm-6">
                                                            <div  className="product__item">
                                                                                {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                                <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})`,cursor: 'pointer' }}>
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
                                        }
                                        if(id > 1){
                                            if(index < (21 * id +1) && index > (21 * (id-1))){
                                                    return(
                                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                                                <div  className="product__item">
                                                                                    {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                                    <div  onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})` }}>
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
                                                                                        <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                                                                    </div>
                                                                </div>
                                                            </div>        
                                                    );
                                                }  
                                        }
                                }): <div className="col-lg-4 col-md-6 col-sm-6"> 
                                <Skeleton variant="rectangular" animation="wave" width={600} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                <br/>
                                <Skeleton variant="rectangular" animation="wave" width={600} height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                </div>
                            }
                            </div>
                        </div>
                        {
                            StartShowing && data.Mangas ?
                    <div className="product__pagination">
                        {/* important
                            after someone click the page button make a preload animation for 2 sec then go next page
                         */}
                    <Link 
                     className={toggleState === {id} ? "current-page" : null}

                     onClick={()=>toggleTab(id)}
                     to={`/manga_list/`+(id)}>{id}</Link>

                    <Link className={(toggleState ==({id}+1)) ? "current-page" : null}
                     onClick={()=>toggleTab(id + 1)} to={`/manga_list/`+(id+1)}
                     id='page123'
                     >{id+1}</Link>

                    <Link className={toggleState === ({id}+2) ? "current-page" : null}
                     onClick={() => toggleTab({id}+2)} to={`/manga_list/`+(id+2)}>{id+2}</Link>

                    <Link className={toggleState === {id}+3 ? "current-page" : null}
                     onClick={() => toggleTab({id}+3)} to={`/manga_list/`+(id+3)}>{id+3}</Link>

                    <Link className={toggleState === {id}+4 ? "current-page" : null}
                     onClick={() => toggleTab({id}+4)} to={`/manga_list/`+(id+4)}>{id+4}</Link> 

                        <a href="#"><i className="fa fa-angle-double-right"></i></a>
                    </div> 
                    :<Skeleton variant="text" animation="wave" height={100} width={600}  sx={{ bgcolor: '#a1a1a1' }}/>
                        }
                </div>
                        : null}
                        {What_SizeIsIt ==='Meduim' ?  
                        
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
                        :null}

                        {What_SizeIsIt ==='Tablet'?   
                <div className="col-lg-8">
                    <div className="product__page__content">
                        <div className="product__page__title">
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-sm-6">
                                    <div className="section-title">
                                        <h4>Recent Mangas</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">      
                                {
                                    StartShowing && recentupdated ? 
                                    recentupdated.map((value,index)=>{
                                        if(id==1){
                                            if(index < (20) ){
                                                return(
                                                    <div className="col-lg-4 col-md-6 col-sm-6">
                                                            <div  className="product__item">
                                                                                {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                                <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover',cursor: 'pointer' }}>
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
                                        }
                                        if(id > 1){
                                            if(index < (20 * id +1) && index > (20 * (id-1))){
                                                    return(
                                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                                                <div  className="product__item">
                                                                                    {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                                    <div  onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value.PictureLink})` }}>
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
                                                                                        <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                                                                    </div>
                                                                </div>
                                                            </div>        
                                                    );
                                                }  
                                        }
                                }): <div className="col-lg-4 col-md-6 col-sm-6"> 
                                <Skeleton variant="rectangular" animation="wave" width={600} height={(40*height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                <br/>
                                <Skeleton variant="rectangular" animation="wave" width={600} height={(40*height)/100}  sx={{ bgcolor: '#a1a1a1' }}/>
                                </div>
                            }
                            </div>
                        </div>
                        {
                            StartShowing && data.Mangas ?
                    <div className="product__pagination">
                        {/* important
                            after someone click the page button make a preload animation for 2 sec then go next page
                         */}
                    <Link 
                     className={toggleState === {id} ? "current-page" : null}

                     onClick={()=>toggleTab(id)}
                     to={`/manga_list/`+(id)}>{id}</Link>

                    <Link className={(toggleState ==({id}+1)) ? "current-page" : null}
                     onClick={()=>toggleTab(id + 1)} to={`/manga_list/`+(id+1)}
                     id='page123'
                     >{id+1}</Link>

                    <Link className={toggleState === ({id}+2) ? "current-page" : null}
                     onClick={() => toggleTab({id}+2)} to={`/manga_list/`+(id+2)}>{id+2}</Link>

                    <Link className={toggleState === {id}+3 ? "current-page" : null}
                     onClick={() => toggleTab({id}+3)} to={`/manga_list/`+(id+3)}>{id+3}</Link>

                    <Link className={toggleState === {id}+4 ? "current-page" : null}
                     onClick={() => toggleTab({id}+4)} to={`/manga_list/`+(id+4)}>{id+4}</Link> 

                        <a href="#"><i className="fa fa-angle-double-right"></i></a>
                    </div> 
                    :<Skeleton variant="text" animation="wave" height={100} width={600} sx={{ bgcolor: '#a1a1a1' }}/>
                        }
                </div>
                        : null}
                        {What_SizeIsIt ==='Tablet' ?  
                        
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
                                            style={{ backgroundImage: `url(${value[0].PictureLink})`,width:'600px',backgroundRepeat:'no-repeat',backgroundSize:'cover',cursor: 'pointer' }}>
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

                        {What_SizeIsIt ==='Wide Mobile'?   
                <div className="col-lg-8">
                    <div className="product__page__content">
                        <div className="product__page__title">
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-sm-6">
                                    <div className="section-title">
                                        <h4>Recent Mangas</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">      
                                {
                                    StartShowing && recentupdated ? 
                                    recentupdated.map((value,index)=>{
                                        if(id==1){
                                            if(index < (20) ){
                                                return(
                                                    <div className="col-lg-4 col-md-6 col-sm-6">
                                                            <div  className="product__item">
                                                                                {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                                <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{backgroundRepeat: 'no-repeat',backgroundSize: 'cover', backgroundImage: `url(${value.PictureLink})`,cursor: 'pointer' }}>
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
                                        }
                                        if(id > 1){
                                            if(index < (20 * id +1) && index > (20 * (id-1))){
                                                    return(
                                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                                                <div  className="product__item">
                                                                                    {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                                    <div  onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover',cursor: 'pointer'}}>
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
                                                                                        <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                                                                    </div>
                                                                </div>
                                                            </div>        
                                                    );
                                                }  
                                        }
                                }): <div className="col-lg-4 col-md-6 col-sm-6"> 
                                <Skeleton variant="rectangular" animation="wave"  height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                <br/>
                                <Skeleton variant="rectangular" animation="wave" height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                </div>
                            }
                            </div>
                        </div>
                        {
                            StartShowing && data.Mangas ?
                    <div className="product__pagination">
                        {/* important
                            after someone click the page button make a preload animation for 2 sec then go next page
                         */}
                    <Link 
                     className={toggleState === {id} ? "current-page" : null}

                     onClick={()=>toggleTab(id)}
                     to={`/manga_list/`+(id)}>{id}</Link>

                    <Link className={(toggleState ==({id}+1)) ? "current-page" : null}
                     onClick={()=>toggleTab(id + 1)} to={`/manga_list/`+(id+1)}
                     id='page123'
                     >{id+1}</Link>

                    <Link className={toggleState === ({id}+2) ? "current-page" : null}
                     onClick={() => toggleTab({id}+2)} to={`/manga_list/`+(id+2)}>{id+2}</Link>

                    <Link className={toggleState === {id}+3 ? "current-page" : null}
                     onClick={() => toggleTab({id}+3)} to={`/manga_list/`+(id+3)}>{id+3}</Link>

                    <Link className={toggleState === {id}+4 ? "current-page" : null}
                     onClick={() => toggleTab({id}+4)} to={`/manga_list/`+(id+4)}>{id+4}</Link> 

                        <a href="#"><i className="fa fa-angle-double-right"></i></a>
                    </div> 
                    :<Skeleton variant="text" animation="wave" height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                        }
                </div>
                        : null}
                        {What_SizeIsIt ==='Wide Mobile' ?                   
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
                                            style={{ width:'500px',backgroundImage: `url(${value[0].PictureLink})`,cursor: 'pointer',backgroundRepeat: 'no-repeat',backgroundSize: 'cover' }}>
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

                        {What_SizeIsIt ==='Small Mobile'?   
                <div className="col-lg-8">
                    <div className="product__page__content">
                        <div className="product__page__title">
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-sm-6">
                                    <div className="section-title">
                                        <h4>Recent Mangas</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">      
                                {
                                    StartShowing && recentupdated ? 
                                    recentupdated.map((value,index)=>{
                                        if(id==1){
                                            if(index < (21) ){
                                                return(
                                                    <div className="col-lg-4 col-md-6 col-sm-6">
                                                            <div  className="product__item">
                                                                                {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                                <div onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover',cursor: 'pointer' }}>
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
                                        }
                                        if(id > 1){
                                            if(index < (21 * id +1) && index > (21 * (id-1))){
                                                    return(
                                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                                                <div  className="product__item">
                                                                                    {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                                    <div  onClick={()=>nav('/manga/'+value.Name)} className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover' }}>
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
                                                                                        <h5><Link to={'/manga/'+value.Name}>{value.Name}</Link></h5>
                                                                                    </div>
                                                                </div>
                                                            </div>        
                                                    );
                                                }  
                                        }
                                }): <div className="col-lg-4 col-md-6 col-sm-6"> 
                                <Skeleton variant="rectangular" animation="wave"  height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                <br/>
                                <Skeleton variant="rectangular" animation="wave" height={325}  sx={{ bgcolor: '#a1a1a1' }}/>
                                </div>
                            }
                            </div>
                        </div>
                        {
                            StartShowing && data.Mangas ?
                    <div className="product__pagination">
                        {/* important
                            after someone click the page button make a preload animation for 2 sec then go next page
                         */}
                    <Link 
                     className={toggleState === {id} ? "current-page" : null}

                     onClick={()=>toggleTab(id)}
                     to={`/manga_list/`+(id)}>{id}</Link>

                    <Link className={(toggleState ==({id}+1)) ? "current-page" : null}
                     onClick={()=>toggleTab(id + 1)} to={`/manga_list/`+(id+1)}
                     id='page123'
                     >{id+1}</Link>

                    <Link className={toggleState === ({id}+2) ? "current-page" : null}
                     onClick={() => toggleTab({id}+2)} to={`/manga_list/`+(id+2)}>{id+2}</Link>

                    <Link className={toggleState === {id}+3 ? "current-page" : null}
                     onClick={() => toggleTab({id}+3)} to={`/manga_list/`+(id+3)}>{id+3}</Link>

                    <Link className={toggleState === {id}+4 ? "current-page" : null}
                     onClick={() => toggleTab({id}+4)} to={`/manga_list/`+(id+4)}>{id+4}</Link> 

                        <a href="#"><i className="fa fa-angle-double-right"></i></a>
                    </div> 
                    :<Skeleton variant="text" animation="wave" height={100}  sx={{ bgcolor: '#a1a1a1' }}/>
                        }
                </div>
                        : null}
                        {What_SizeIsIt ==='Small Mobile' ?  
                        
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
                        :null}
</div>
</div>
</section>
        <Footer/>
        </ThemeProvider>
		</>
	)
}

export default Manga_List