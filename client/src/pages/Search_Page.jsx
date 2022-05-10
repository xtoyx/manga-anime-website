import styled from "styled-components";
import "../pages-css/Searchw.css";
import { SearchBar } from "../components/searchBar";
import Footer from "./footer";
import Header from "./header";
import {useState} from 'react'
import { lightTheme, darkTheme, GlobalStyles } from '../components/theme';
import { ThemeProvider } from 'styled-components';
const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10em;
`;

function Test3({data}) {	
    const infoforheader = {isloggedin:data.isloggedin.isloggedin,logoutava:true,profileava:true,firsttime:true };
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
  return (
      <>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
    <GlobalStyles />
		<Header Infoforheader={infoforheader}/>
    <AppContainer>
        {
           data.Mangas ? 
           <SearchBar props={data.Mangas}/>
           :null 
        }
    </AppContainer>
    </ThemeProvider>
    </>
  );
}

export default Test3;