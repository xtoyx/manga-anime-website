import { useEffect, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import '../pages-css/geners.css';

import Footer from "./footer";
import Header from "./header";
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';

function Categories({ data }) {

    /*conditions for header 
    profile page is logoutava:false,firsttime:false 
    logout page is profileava:true,firsttime:true 
    anything else will be everything true 
    */
    const navigate = useNavigate();
    const [StartShowing,setStartShowing]=useState(false);
    const [checked, setChecked] = useState(
        []
    );    
    const all = [
        {
            name:'all'
        }
    ];
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
    const infoforheader = { isloggedin: data.isloggedin.isloggedin, logoutava: true, profileava: true, firsttime: true };
        function sleep(ms) {
            return new Promise((resolve) => {
              setTimeout(resolve, ms);
            });
          }
          const [url,setUrl]=useState();
        const toComponentB=()=>{
            async function init() {
                if(checked.length >0){
                    CheckAllGeners();
                    await sleep(2000)
                }
                else{
                    setUrl(`/all_mangas/${(all[0].name)}`);
                }
            }
            init()
        }


    const handleOnChange = (e,position) => {
        if (e.target.checked) {
            setChecked([
              ...checked,
              {
                id: position,
                checked: true,
              },
            ]);
          } else {
            // remove from list
            setChecked(
              checked.filter((people) => people.id !== position),
            );
          }
    };
   var t=setTimeout(() =>{
       setStartShowing(true)
   },3000)


    if(StartShowing){
        clearTimeout(t)
        t=null;
    }


    const CheckAllGeners=()=>{
        var test12=[];
        checked.map((position,y)=>{
            data.Geners.map((value,index)=>{
                if(index == position.id){
                    console.log('looking')
                    test12.push(value.name)
                }
            })
        })
        setUrl(`/all_mangas/${test12}`);
    }

    if(!data.Geners){
        return (
            <div id="preloder">
            <div className="loader" ></div>
            </div>
        )
    }
    return (
        <>
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
            <Header Infoforheader={infoforheader} />
            <div className="breadcrumb-option" >
                <div className="container" >
                <a href={url} onClick={()=>{toComponentB()}} className="primary-btn" style={{right:'0',position:'absolute',cursor:'pointer'}}>Select Then Go Next Page<span className="arrow_right"></span></a>
                <table className="pure-table striped collections">
                        <tbody> 
                                {
                                    StartShowing ?
                                    data.Geners.map((value,index) => {  
                                       return(
                                           <>
                                            <tr>
                                            <input 
                                            type="checkbox" 
                                            name="topping"  
                                            value={checked}
                                            onChange={(e) => handleOnChange(e,index)}
                                            id={`custom-checkbox-${index}`}/>
                                   <td className="volsChRating"  itemProp="itemListElement" itemScope="" itemType="https://schema.org/ListItem">
                                        <span itemProp="position" style={{display:'none'}}>1</span>
                                        <h2 itemProp="name" className="collectionName theme-font"><a href="/manga/tags/15th-century" itemProp="url">{value.name}</a></h2>
                                        <div itemProp="description" key={index} ><p>{value.description}</p></div></td><td className="aligncenter">
                                        <p className="metadata">876<span className="heartOn"></span>160 <span className="heartOff">
                                            </span></p><span className="heartSwitch  tags919">
                                                <a rel="nofollow" className="heartOn tooltip" data-className="fav" title="I love this tag" href="javascript:toggle_favorite(&quot;tags&quot;,919,1,&quot;love&quot;)">
                                                    </a><a rel="nofollow" className="heartOff tooltip" data-className="fav" title="I hate this tag" href="javascript:toggle_favorite(&quot;tags&quot;,919,1,&quot;hate&quot;)">
                                                        </a></span></td>
                                        </tr>
                               <tr></tr>
                                                    </> )
                                    }) : null
                               
                                }
                        </tbody>
                </table>
                </div>
            </div>
            <Footer />
            </ThemeProvider>
        </>
    )
}

export default Categories