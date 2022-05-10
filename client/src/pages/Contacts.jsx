import { useEffect, useState } from "react";
import '../pages-css/Home.css'
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import Footer from "./footer";
import Header from "./header";

function Contacts({data}) {
    

	/*conditions for header 
    profile page is logoutava:false,firsttime:false 
    logout page is profileava:true,firsttime:true 
    anything else will be everything true 
    */
    const [theme, setTheme] = useState("dark");
    const isDarkTheme = theme === "dark";
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


    const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true};
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
  const [height,width]=useWindowSize();
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

    return (
    		<ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>
        
      {/* Add Blog Data from the admin side  */}
    <section className="blog spad">
        <div className="container">
            <div className="row">
              {What_SizeIsIt ==='Normal' ? 
            <center style={{marginLeft:"20%"}}>
                <h1>Contact Me Through Discord <br/>
                <a href="https://discordapp.com/users/364060923410776065" target="_blank"><i class="fab fa-discord" style={{marginRight:"20px",cursor:'pointer'}}></i></a>
                   xtoyx3#1534</h1>
                   </center>
              :null }
              {What_SizeIsIt ==='Meduim' ? 
            <center style={{marginLeft:"10%"}}>
                <h1>Contact Me Through Discord <br/>
                <a href="https://discordapp.com/users/364060923410776065" target="_blank"><i class="fab fa-discord" style={{marginRight:"20px",cursor:'pointer'}}></i></a>
                   xtoyx3#1534</h1>
                   </center>
              :null }
              {What_SizeIsIt ==='Tablet' ? 
            <center style={{marginLeft:"0%"}}>
                <h1>Contact Me Through Discord <br/>
                <a href="https://discordapp.com/users/364060923410776065" target="_blank"><i class="fab fa-discord" style={{marginRight:"20px",cursor:'pointer'}}></i></a>
                   xtoyx3#1534</h1>
                   </center>
              :null }
              {What_SizeIsIt ==='Wide Mobile' ? 
            <center style={{marginLeft:"20%"}}>
                <h1>Contact Me Through Discord <br/>
                <a href="https://discordapp.com/users/364060923410776065" target="_blank"><i class="fab fa-discord" style={{marginRight:"20px",cursor:'pointer'}}></i></a>
                   xtoyx3#1534</h1>
                   </center>
              :null }
              {What_SizeIsIt ==='Small Mobile' ? 
            <center>
                <h1>Contact Me Through Discord <br/>
                <a href="https://discordapp.com/users/364060923410776065" target="_blank"><i class="fab fa-discord" style={{marginRight:"20px",cursor:'pointer'}}></i></a>
                   xtoyx3#1534</h1>
                   </center>
              :null }
            </div>
        </div>
    </section>
        <Footer/>
		</>
        </ThemeProvider>
	)
}

export default Contacts