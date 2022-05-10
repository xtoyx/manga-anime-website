import { useState ,useEffect} from 'react'
import '../pages-css/Home.css'
import {useLocation, useParams,useNavigate} from 'react-router-dom';

import Footer from "./footer";
import Header from "./header";
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';

function All_mangas({data}) {
    const nav=useNavigate();
	const [theme, setTheme] = useState('dark');
	const isDarkTheme = theme === "dark";
    const [Liked_by_TheCreator,setLikedBy_TheCreator]=useState(null);
    const [What_SizeIsIt,setWhat_SizeIsIt]=useState('Normal');
    const [height,width]=useWindowSize();

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

    const location = useLocation();
	/*conditions for header 
    profile page is logoutava:false,firsttime:false 
    logout page is profileava:true,firsttime:true 
    anything else will be everything true 
    */
   let {tags}=useParams();
   let test1=[];
   let restofmangastoshowmore=[];
   const Tag1=tags.split(',');
   const [Changed,setChanged]=useState('Show More');
   const [StartShowing,setStartShowing]=useState(false);
   const [ShowMore, setShowMore] = useState(false);
    const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true};
	const waitingforsomething=()=>{
        if(tags =='all' || tags ==''){
            data.Mangas.map((value,index)=>{
                test1.push(value);
            })
        }
        // Function call
        function findCommonElements2(arr1, arr2) {	
                // Create an empty object
                let obj = [];
                    for(let j=0;j<arr2.length;j++){
                        // Loop through the first array
                        for (let i = 0; i < arr1.length; i++) {
                            if(arr1[i] === arr2[j]){
                                obj.push(i);
                            }
                        }
                    }
                    if(obj.length == arr2.length){
                        return true;
                    }
                return false;
        }
			

        data.Mangas.map((value,index)=>{
            if(Tag1.length>0){
                if(findCommonElements2(value.Genre,Tag1)){
                    test1.push(value)
                }
            }
            value.Genre.map((genre,index2)=>{
                if(Tag1.length==0){
                    if(Tag1[0]==genre){
                        test1.push(value)
                    }
                }
            })
        })
    } 
       var t=setTimeout(() =>{
        setStartShowing(true);
    },5000)


    if(StartShowing){
        clearTimeout(t);
        t=null;
        waitingforsomething();
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
        console.log('id changed')
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
    return (
    <>
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>
        

        <section className="product-page spad">
        <div className="container">

                {What_SizeIsIt === 'Normal'?   
            <div className="row">
                <div className="col-lg-8">
                    <div className="product__page__content">
                        <div className="product__page__title">
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-sm-6">
                                    <div className="section-title">
                                        <h4>{tags}</h4>
                                    </div>
                                </div>
                              
                            </div>
                        </div>
                        <div className="row">
                            {
                                StartShowing ?
                                test1.map((value,index) => {
                                    if(index < 21){ 
                                        return(
                                            <div className="col-lg-4 col-md-6 col-sm-6">
                                            <div  className="product__item">
                                                                {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                <div  className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})` }}>
                                                                    <div  className="ep">{value.data[value.data.length -1].counter} / 18</div>
                                                                    <div  className="comment"><i className="fa fa-comments"></i> 11</div>
                                                                    <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                                </div>
                                                                <div  className="product__item__text">
                                                                    <ul>
                                                                        <li>Active</li>
                                                                        <li>Movie</li>
                                                                    </ul>
                                                                    <h5><a href="#">{value.Name}</a></h5>
                                                                </div>
                                            </div>
                                        </div>        
                                        );
                                    }
                                    else{
                                       restofmangastoshowmore.push(value); 
                                    }
                                }) : null
                                }
                            
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
                                                                    <div  className="ep">{value.data[value.data.length -1].counter} / 18</div>
                                                                    <div  className="comment"><i className="fa fa-comments"></i> 11</div>
                                                                    <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                                </div>
                                                                <div  className="product__item__text">
                                                                    <ul>
                                                                        <li>Active</li>
                                                                        <li>Movie</li>
                                                                    </ul>
                                                                    <h5><a href="#">{value.Name}</a></h5>
                                                                </div>
                                            </div>
                                        </div>        
                                        );
                                }) : null
                                }

                        </div>
                    <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
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

                {What_SizeIsIt ==='Meduim' ? 
                 <div className="row">
                 <div className="col-lg-8">
                     <div className="product__page__content">
                         <div className="product__page__title">
                             <div className="row">
                                 <div className="col-lg-8 col-md-8 col-sm-6">
                                     <div className="section-title">
                                         <h4>{tags}</h4>
                                     </div>
                                 </div>
                               
                             </div>
                         </div>
                         <div className="row">
                             {
                                 StartShowing ?
                                 test1.map((value,index) => {
                                     if(index < 21){ 
                                         return(
                                             <div className="col-lg-4 col-md-6 col-sm-6">
                                             <div  className="product__item">
                                                                 {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                 <div  className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})` }}>
                                                                     <div  className="ep">{value.data[value.data.length -1].counter} / 18</div>
                                                                     <div  className="comment"><i className="fa fa-comments"></i> 11</div>
                                                                     <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                                 </div>
                                                                 <div  className="product__item__text">
                                                                     <ul>
                                                                         <li>Active</li>
                                                                         <li>Movie</li>
                                                                     </ul>
                                                                     <h5><a href="#">{value.Name}</a></h5>
                                                                 </div>
                                             </div>
                                         </div>        
                                         );
                                     }
                                     else{
                                        restofmangastoshowmore.push(value); 
                                     }
                                 }) : null
                                 }
                             
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
                                                                     <div  className="ep">{value.data[value.data.length -1].counter} / 18</div>
                                                                     <div  className="comment"><i className="fa fa-comments"></i> 11</div>
                                                                     <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                                 </div>
                                                                 <div  className="product__item__text">
                                                                     <ul>
                                                                         <li>Active</li>
                                                                         <li>Movie</li>
                                                                     </ul>
                                                                     <h5><a href="#">{value.Name}</a></h5>
                                                                 </div>
                                             </div>
                                         </div>        
                                         );
                                 }) : null
                                 }
 
                         </div>
                     <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
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

                {What_SizeIsIt ==='Tablet' ? 
                 <div className="row">
                 <div className="col-lg-8">
                     <div className="product__page__content">
                         <div className="product__page__title">
                             <div className="row">
                                 <div className="col-lg-8 col-md-8 col-sm-6">
                                     <div className="section-title">
                                         <h4>{tags}</h4>
                                     </div>
                                 </div>
                               
                             </div>
                         </div>
                         <div className="row">
                             {
                                 StartShowing ?
                                 test1.map((value,index) => {
                                     if(index < 20){ 
                                         return(
                                             <div className="col-lg-4 col-md-6 col-sm-6">
                                             <div  className="product__item">
                                                                 {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                 <div  className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundSize:'cover',backgroundRepeat:'no-repeat' }}>
                                                                     <div  className="ep">{value.data[value.data.length -1].counter} / 18</div>
                                                                     <div  className="comment"><i className="fa fa-comments"></i> 11</div>
                                                                     <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                                 </div>
                                                                 <div  className="product__item__text">
                                                                     <ul>
                                                                         <li>Active</li>
                                                                         <li>Movie</li>
                                                                     </ul>
                                                                     <h5><a href="#">{value.Name}</a></h5>
                                                                 </div>
                                             </div>
                                         </div>        
                                         );
                                     }
                                     else{
                                        restofmangastoshowmore.push(value); 
                                     }
                                 }) : null
                                 }
                             
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
                                                                     <div  className="ep">{value.data[value.data.length -1].counter} / 18</div>
                                                                     <div  className="comment"><i className="fa fa-comments"></i> 11</div>
                                                                     <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                                 </div>
                                                                 <div  className="product__item__text">
                                                                     <ul>
                                                                         <li>Active</li>
                                                                         <li>Movie</li>
                                                                     </ul>
                                                                     <h5><a href="#">{value.Name}</a></h5>
                                                                 </div>
                                             </div>
                                         </div>        
                                         );
                                 }) : null
                                 }
 
                         </div>
                     <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
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
                                             style={{ width:'700px',backgroundRepeat: 'no-repeat',backgroundSize: 'cover',backgroundImage: `url(${value[0].PictureLink})`,cursor: 'pointer' }}>
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

                 {What_SizeIsIt ==='Wide Mobile' ? 
                 <div className="row">
                 <div className="col-lg-8">
                     <div className="product__page__content">
                         <div className="product__page__title">
                             <div className="row">
                                 <div className="col-lg-8 col-md-8 col-sm-6">
                                     <div className="section-title">
                                         <h4>{tags}</h4>
                                     </div>
                                 </div>
                               
                             </div>
                         </div>
                         <div className="row">
                             {
                                 StartShowing ?
                                 test1.map((value,index) => {
                                     if(index < 20){ 
                                         return(
                                             <div className="col-lg-4 col-md-6 col-sm-6">
                                             <div  className="product__item">
                                                                 {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                 <div  className="product__item__pic" key={value.Name} style={{ backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}}>
                                                                     <div  className="ep">{value.data[value.data.length -1].counter} / 18</div>
                                                                     <div  className="comment"><i className="fa fa-comments"></i> 11</div>
                                                                     <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                                 </div>
                                                                 <div  className="product__item__text">
                                                                     <ul>
                                                                         <li>Active</li>
                                                                         <li>Movie</li>
                                                                     </ul>
                                                                     <h5><a href="#">{value.Name}</a></h5>
                                                                 </div>
                                             </div>
                                         </div>        
                                         );
                                     }
                                     else{
                                        restofmangastoshowmore.push(value); 
                                     }
                                 }) : null
                                 }
                             
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
                                                                     <div  className="ep">{value.data[value.data.length -1].counter} / 18</div>
                                                                     <div  className="comment"><i className="fa fa-comments"></i> 11</div>
                                                                     <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                                 </div>
                                                                 <div  className="product__item__text">
                                                                     <ul>
                                                                         <li>Active</li>
                                                                         <li>Movie</li>
                                                                     </ul>
                                                                     <h5><a href="#">{value.Name}</a></h5>
                                                                 </div>
                                             </div>
                                         </div>        
                                         );
                                 }) : null
                                 }
 
                         </div>
                     <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
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

                {What_SizeIsIt ==='Small Mobile' ? 
                 <div className="row">
                 <div className="col-lg-8">
                     <div className="product__page__content">
                         <div className="product__page__title">
                             <div className="row">
                                 <div className="col-lg-8 col-md-8 col-sm-6">
                                     <div className="section-title">
                                         <h4>{tags}</h4>
                                     </div>
                                 </div>
                               
                             </div>
                         </div>
                         <div className="row">
                             {
                                 StartShowing ?
                                 test1.map((value,index) => {
                                     if(index < 21){ 
                                         return(
                                             <div className="col-lg-4 col-md-6 col-sm-6">
                                             <div  className="product__item">
                                                                 {/* <div  className="product__item__pic set-bg" key={value.Name} data-setbg={value.PictureLink}> */}
                                                                 <div width="100%"  className="product__item__pic" key={value.Name} style={{ width: '100%',backgroundImage: `url(${value.PictureLink})`,backgroundSize: 'cover',backgroundRepeat:'no-repeat'}}>
                                                                     <div  className="ep">{value.data[value.data.length -1].counter} / 18</div>
                                                                     <div  className="comment"><i className="fa fa-comments"></i> 11</div>
                                                                     <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                                 </div>
                                                                 <div  className="product__item__text">
                                                                     <ul>
                                                                         <li>Active</li>
                                                                         <li>Movie</li>
                                                                     </ul>
                                                                     <h5><a href="#">{value.Name}</a></h5>
                                                                 </div>
                                             </div>
                                         </div>        
                                         );
                                     }
                                     else{
                                        restofmangastoshowmore.push(value); 
                                     }
                                 }) : null
                                 }
                             
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
                                                                 <div  className="product__item__pic" key={value.Name} style={{width:'100%', backgroundImage: `url(${value.PictureLink})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover'}}>
                                                                     <div  className="ep">{value.data[value.data.length -1].counter} / 18</div>
                                                                     <div  className="comment"><i className="fa fa-comments"></i> 11</div>
                                                                     <div className="view"><i className="fa fa-eye"></i> 9141</div>
                                                                 </div>
                                                                 <div  className="product__item__text">
                                                                     <ul>
                                                                         <li>Active</li>
                                                                         <li>Movie</li>
                                                                     </ul>
                                                                     <h5><a href="#">{value.Name}</a></h5>
                                                                 </div>
                                             </div>
                                         </div>        
                                         );
                                 }) : null
                                 }
 
                         </div>
                     <button id="show-more" onClick={ShowMoreNow}>{Changed}</button>
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

export default All_mangas