import { useEffect, useState } from "react";
import '../pages-css/Home.css'
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import Footer from "./footer";
import Header from "./header";

function FirstBlog({data}) {
    

	/*conditions for header 
    profile page is logoutava:false,firsttime:false 
    logout page is profileava:true,firsttime:true 
    anything else will be everything true 
    */
    const [theme, setTheme] = useState("dark");
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

    const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true};
	return (
    		<ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>
        <section className="normal-breadcrumb set-bg" data-setbg="img/normal-breadcrumb.jpg">
        <div className="container">
            <div className="row">
                <div className="col-lg-12 text-center">
                    <div className="normal__breadcrumb__text">
                        <h2>First Day to get launched</h2>
                    </div>
                </div>
            </div>
        </div>
    </section>
      {/* Add Blog Data from the admin side  */}
    <section className="blog spad">
        <div className="container">
            <div className="row">
        <h4 style={{position:'relative',marginLeft:'60%'}}>
            This is My Second Website , 
            <br/> I did have fun building it And it did take a while and Still Havent finished <br/>
            So If there anything you like me to add Sent it through My discord </h4>
            <div className="col-lg-6">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="blog__item set-bg" data-setbg="img/okStart.jpg">
                                <div className="blog__item__text">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
        <Footer/>
		</>
        </ThemeProvider>
	)
}

export default FirstBlog