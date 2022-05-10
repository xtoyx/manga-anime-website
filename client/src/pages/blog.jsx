import { useEffect, useState } from "react";
import '../pages-css/Home.css'
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import Footer from "./footer";
import Header from "./header";

function Blog({data}) {
    

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
                        <h2>Our Blog</h2>
                        <p>Welcome to the official ManAni blog.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
      {/* Add Blog Data from the admin side  */}
    <section className="blog spad">
        <div className="container">
            <div className="row">
            <div className="col-lg-6">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="blog__item set-bg" data-setbg="img/yaya.png">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 10 April 2022</p>
                                    <h4><a href="blog/First_Blog">Manga | Anime Geting To Ready To Launch</a></h4>
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

export default Blog





{/* <div className="col-lg-6">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="blog__item set-bg" data-setbg="img/blog/blog-1.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Yuri Kuma Arashi Viverra Tortor Pharetra</a></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="blog__item small__item set-bg" data-setbg="img/blog/blog-4.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Bok no Hero Academia Season 4 – 18</a></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="blog__item small__item set-bg" data-setbg="img/blog/blog-5.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Fate/Stay Night: Untimated Blade World</a></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="blog__item set-bg" data-setbg="img/blog/blog-7.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Housekishou Richard shi no Nazo Kantei Season 08 - 20</a></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="blog__item small__item set-bg" data-setbg="img/blog/blog-10.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Fate/Stay Night: Untimated Blade World</a></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="blog__item small__item set-bg" data-setbg="img/blog/blog-11.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Building a Better LiA Drilling Down</a></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="blog__item small__item set-bg" data-setbg="img/blog/blog-2.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Fate/Stay Night: Untimated Blade World</a></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="blog__item small__item set-bg" data-setbg="img/blog/blog-3.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Building a Better LiA Drilling Down</a></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="blog__item set-bg" data-setbg="img/blog/blog-6.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Yuri Kuma Arashi Viverra Tortor Pharetra</a></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="blog__item small__item set-bg" data-setbg="img/blog/blog-8.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Bok no Hero Academia Season 4 – 18</a></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="blog__item small__item set-bg" data-setbg="img/blog/blog-9.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Fate/Stay Night: Untimated Blade World</a></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="blog__item set-bg" data-setbg="img/blog/blog-12.jpg">
                                <div className="blog__item__text">
                                    <p><span className="icon_calendar"></span> 01 March 2020</p>
                                    <h4><a href="#">Yuri Kuma Arashi Viverra Tortor Pharetra</a></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}