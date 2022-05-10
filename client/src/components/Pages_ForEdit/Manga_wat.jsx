import { useEffect, useState } from 'react'
import { Link , useParams , useNavigate} from 'react-router-dom';
import Popup from "../Popup";

const Manga_wat = ({Info}) => {
	const nav = useNavigate();
    const {hmn}=useParams();
    var WhatManga,Genre;
    const [Name,setName]=useState();
	const [Views,setViews]=useState();
	const [LinkTomanga,setLinkTomanga]=useState()
	//Genre and Chapters
	const [ButtonPopup,setButtonPopup] =useState(false);
	const [StartShowing,setStartShowing]=useState(false);
	const [GenreChanging,setGenreChanging]=useState(false);
	const [ChapterChanging,setChapterChanging]=useState(false);
	const [AddingGenre,setAddingGenre]=useState();
	const [NewMangaChapters,setNewMangaChapters]=useState();
	const [FinishedEveryG,setFinishedEveryG]=useState(false);
	//popup Chapters
	const [NameOfThat,setNameOfThat]=useState();
	const [WhatLocation,setWhatLocation]=useState();
	const [HowManyPages,setHowManyPages]=useState(0);
	const [LinkToMangaChapter,setLinkToMangaChapter]=useState();
	const [Chaptersis,setChaptersis]=useState([]);
	const [NextPage,setNextPage]=useState(false);
	const [PageIndexStart,setPageIndexStart]=useState(0);
	const [PageIndexEnd,setPageIndexEnd]=useState(7);
	const [FinishedEveryC,setFinishedEveryC]=useState(false);
	const [ChangedSomething,setChangedSomething]=useState(false);
	/*******/
	// Buttons hide and show
	const [ExpendGenres,setExpendGenres]=useState(false);
	const [ExpendChapters,setExpendChapters]=useState(false);
	const [NewPhoto,setNewPhoto] = useState();
	/*******************************/

	var t1=setTimeout(()=>{setStartShowing(true)},2000)
    if(StartShowing){
        Info.Mangas.map((value,index)=>{
            if(value.Name == hmn){
                WhatManga = value;
                Genre=value.Genre.join(",  ")
            }
        })
		clearTimeout(t1);
		t1=null;
    }
	// Buttons hide and show
	const SwitchExpeneded=(e,Whichisit)=>{
		e.preventDefault();
		if(Whichisit==='G'){
			setExpendGenres(!ExpendGenres);
			setExpendChapters(false)
		}
		if(Whichisit==='C'){
			setExpendChapters(!ExpendChapters)
			setExpendGenres(false);
		}
	}

	function imageHandler(e){
		const reader = new FileReader();
		reader.onload = () =>{
			if(reader.readyState === 2){
			setNewPhoto(reader.result)
		  }
		}
		reader.readAsDataURL(e.target.files[0])
	}
	/*******************************/

	//Genres and chapters
	const AddGenre=(e,value)=>{
		e.preventDefault();
		setButtonPopup(true)
		setGenreChanging(true);
	}
	const AddChapters=(e)=>{
		e.preventDefault();
		setButtonPopup(true)
		setGenreChanging(false);
		setChapterChanging(true);
	}
	const WaitSomeTime=(e,value)=>{
		e.preventDefault();
		var helpmenow=[];
		WhatManga.Genre.map((value2,index)=>{
			if(value !== value2){
				helpmenow.push(value2)
			}
		})
		WhatManga.Genre=helpmenow;
		setChangedSomething(true);
	}
	const SumbitForGenre=(e)=>{
		e.preventDefault();
		var helpmenow=[]
		if(AddingGenre !== ''){
			WhatManga.Genre.map((value2,index)=>{
				helpmenow.push(value2)
			})
			helpmenow.push(AddingGenre)
			WhatManga.Genre=helpmenow;
		}
		setButtonPopup(false);
		setChapterChanging(false);
		setFinishedEveryG(true)

	}
	const AddPageforChapter=(e,pos)=>{
		e.preventDefault();
		var helpmenow21=Chaptersis;
		helpmenow21.splice(pos,1,e.target.value);
		setChaptersis(helpmenow21)
	}
	/******************************/

	// Views and Link To Manga 
	const ChangeView=(e)=>{
		e.preventDefault();
		WhatManga.views=(e.target.value)
		setViews(e.target.value)
	}
	const ChangeMangaLink=(e)=>{
		e.preventDefault();
		WhatManga.links=(e.target.value)
		setLinkTomanga(e.target.value)
	}
	const nowwhat=(e)=>{
		var helpmekrkr=[]
		for(let i=0; i < HowManyPages; i++){
			helpmekrkr.push('Put A Link')
		}
		setChaptersis(helpmekrkr)
		setNextPage(true)
	}

	const IncreasePageCount=(e)=>{
		e.preventDefault();
		setPageIndexStart(PageIndexStart + 7)
		setPageIndexEnd(PageIndexEnd + 7)
	}
	const DecreasePageCount=(e)=>{
		e.preventDefault();
		if(PageIndexStart > -1 && !(PageIndexStart-7 < -1)){
			setPageIndexStart(PageIndexStart - 7)
			setPageIndexEnd(PageIndexEnd - 7)
		}
	}

	const FinishWhatC=(e)=>{
		e.preventDefault();
		var ok1234=Chaptersis;
		var thereisntlink=false;
		function isValidURL(string) {
			var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
			return (res !== null)
		};
		ok1234.map((value54,index31)=>{
			if(isValidURL(value54))thereisntlink = true;
		})
		if(!thereisntlink && 
			WhatLocation.match(/^[0-9]+$/) !== null && (NameOfThat !== ''|| !NameOfThat)
			&& HowManyPages.match(/^[0-9]+$/) !== null && (LinkToMangaChapter !== '')){
			setFinishedEveryC(true);
			setButtonPopup(false)
			setChapterChanging(false);
			var arr=[];
			var arr2=WhatManga.data;
			arr2.map((value1234,index1234)=>{
				if(index1234===Number(WhatLocation)){
					console.log('handle')
					arr.push({'chaptersName':NameOfThat,
				'pagesLink':ok1234,
				'counter':WhatLocation,
				'chapterslink':LinkToMangaChapter
					});
				}
				else {
					arr.push(value1234);
				}
			})
			setNewMangaChapters(arr)
		}
	}
	/***********************************************/

	//sumbit BackEnd 
	const SumbitToBackend=async (e)=>{
		e.preventDefault();
		var response;
    if(NewPhoto !== ' ' && NewPhoto){
      try {
        response = await fetch('http://localhost:5001/m/upload/photo', {
              method: 'POST',
              credentials: "include",
              body: JSON.stringify({ data: NewPhoto , id:WhatManga._id}),
              headers: {  Accept: "application/json",
              'Content-Type': 'application/json',
              "Access-Control-Allow-Credentials": true, },
          });
          const data = await response.json()
          if (data.status === 'ok') {
            window.location.reload('false');
          }
        } catch (err) {
            console.error(err);
        }
    }
    if(FinishedEveryC || FinishedEveryG || ChangedSomething){
      try {
        response = await fetch('http://localhost:5001/m/edit', {
              method: 'POST',
              credentials: "include",
              body: JSON.stringify(
                { data: WhatManga , 
                  id:WhatManga._id}
                ),
              headers: {  Accept: "application/json",
              'Content-Type': 'application/json',
              "Access-Control-Allow-Credentials": true, },
          });
          const data = await response.json()
          if (data.status === 'ok') {
			nav('/admin/DashBoard/manga')
            window.location.reload('false');
          }
        } catch (err) {
            console.error(err);
        }
    }
	}
	/***/
  return (
  <main>
	  {StartShowing ? <center>
		{NewPhoto ? 
        <>
        <img
        src={NewPhoto}
        style={{ width: '200px',
          height: '200px'
          }} 
          />
          <i className="fas fa-undo" style={{cursor:'pointer',marginLeft:'30px'}} onClick={(e)=>setNewPhoto()}></i>
        </> 
          :
          <>
          <img
        src={WhatManga.PictureLink}
        style={{ width: '200px',
          height: '200px'
          }} />
          
          <input type="file" accept="image/*" name="image-upload" id="input" onChange={imageHandler} style={{marginTop:'20px',marginLeft:'20px'}}/>
          </>
          }
		<br/>
      	<label>
          Name of Manga : 
        </label>
      <input className="text-camp" 
      style={{width:'25%',marginLeft:'1%'}} 
      value={Name ? Name : WhatManga.Name}
      onChange={(e)=>setName(e.target.value)}/>
        <div class="box">	
        <div >
			<label style={{marginLeft:'20px'}}>Geners</label>
			{ExpendGenres 
			? 
			<i class="fa fa-angle-up" onClick={(e)=>SwitchExpeneded(e,'G')} style={{marginTop:'5px',marginLeft: '70%',cursor: 'pointer'}}></i>
			:<i class="fa fa-angle-down" onClick={(e)=>SwitchExpeneded(e,'G')} style={{marginTop:'5px',marginLeft: '70%',cursor: 'pointer'}}></i>}	
		</div>
		{ExpendGenres ? 
	   WhatManga.Genre.map((value3,index) => {
		   return(
			 <div key={index + value3 + '393u19'}>
			  <label>{value3}</label>
				<i className="fas fa-trash" onClick={(e)=>WaitSomeTime(e,value3)}style={{cursor:'pointer',marginLeft:'30px'}}></i>
			 </div>
		   )
	   })     
		:
		null}
		{ExpendGenres ? <i class="fa fa-plus" onClick={(e)=>AddGenre(e)} style={{cursor:'pointer'}}></i>:null}
		<div>
			<label style={{marginLeft:'20px'}}>Chapters</label>
			{ExpendChapters 
			? 
			<i class="fa fa-angle-up" onClick={(e)=>SwitchExpeneded(e,'C')} style={{marginTop:'5px',marginLeft: '70%',cursor: 'pointer'}}></i>
			:<i class="fa fa-angle-down" onClick={(e)=>SwitchExpeneded(e,'C')} style={{marginTop:'5px',marginLeft: '70%',cursor: 'pointer'}}></i>}	
		</div>

		{ExpendChapters && !NewMangaChapters ? 
					WhatManga.data.map((value,index) => {
						if(index > 0 && index < 10)
						return(
							<div key={index}>
							<label>{value.chaptersName}</label>
							<label style={{marginLeft:'20px'}}>{index}</label>
							<i className="fas fa-trash" onClick={(e)=>WaitSomeTime(e,value)}style={{cursor:'pointer',marginLeft:'30px'}}></i>
							</div>
						)
					})     	
		:null
		}
		{ExpendChapters && NewMangaChapters && 
		NewMangaChapters.map((chapter,postion)=>{
			if(postion > 0 && postion < 10)
					return(
						<div key={postion}>
						<label>{chapter.chaptersName}</label>
						<label style={{marginLeft:'20px'}}>{postion}</label>
						<i className="fas fa-trash" onClick={(e)=>WaitSomeTime(e,chapter)}style={{cursor:'pointer',marginLeft:'30px'}}></i>
						</div>
						)
					}) 
		}
		{ExpendChapters ? <i class="fa fa-plus" style={{cursor:'pointer'}} onClick={(e)=>AddChapters(e)}></i>:null}
		</div>
		<label>
        Views : 
        </label>
		<input className="text-camp" 
		style={{width:'25%',marginLeft:'1%'}} 
		value={Views ? Views : WhatManga.views}
		onChange={(e)=>ChangeView(e)}/>
		<br/>
		<label>
        Link To Manga : 
        </label>
		<input className="text-camp" 
		style={{width:'25%',marginLeft:'1%'}} 
		value={LinkTomanga ? LinkTomanga : WhatManga.linktoManga}
		onChange={(e)=>ChangeMangaLink(e)}/>
		<br/>
	<button className="oksowhat" style={{marginTop:'20px'}} onClick={(e)=>SumbitToBackend(e)}>Finish</button>
	  </center> 
	  :null}
	  
	  <Popup trigger={ButtonPopup} setTrigger={setButtonPopup}>
        {GenreChanging ? 
		<>
		<label>Genre</label>
		<input className="text-camp" 
		style={{width:'25%',marginLeft:'1%'}} 
		value={AddingGenre}
		onChange={(e)=>setAddingGenre(e.target.value)}/>
		<br/>
		<button className="oksowhat" style={{marginLeft:'2%'}} onClick={(e)=>SumbitForGenre(e)}>Finish</button>
		</>
		:null}
		{ChapterChanging ? 
		<div>
			{!NextPage ? 
			<div>
			<label>What id you want it to placed</label>
			<input className="text-camp"
			type="number"
			style={{width:'25%',marginLeft:'1%'}} 
			value={WhatLocation}
			onChange={(e)=>setWhatLocation(e.target.value)}/>
			<br/>
			<label>Name of It</label>
			<input className="text-camp"
			style={{width:'25%',marginLeft:'1%'}} 
			value={NameOfThat}
			onChange={(e)=>setNameOfThat(e.target.value)}/>
			<br/>
			<label>How Many Pages Is There</label>
			<input className="text-camp"
			type="number"
			style={{width:'25%',marginLeft:'1%'}} 
			value={HowManyPages}
			onChange={(e)=>setHowManyPages(e.target.value)}/>
			<br/>
			<label>Link For Manga</label>
			<input className="text-camp"
			type="text"
			style={{width:'25%',marginLeft:'1%'}} 
			value={LinkToMangaChapter}
			onChange={(e)=>setLinkToMangaChapter(e.target.value)}/>
			<br/>
			<i className="fas fa-angle-right" onClick={(e)=>nowwhat(e)}></i>
			</div>
			:
			<div>
				<label>Put The Links Here </label>
				{HowManyPages > 0 ?
					Chaptersis.map((value21,index21)=>{
						if(index21 < PageIndexEnd && index21 >= PageIndexStart){
							return(
								<div key={index21 + value21+'asdppadsoer'}>
									<label>Page {index21+1} : </label>
									<input 
									className="text-camp"
									style={{width:'25%',marginLeft:'2%'}} 
									value={value21}
									onChange={(e)=>AddPageforChapter(e,index21)}/>
									<br/>
								</div>
							)
						}
					})
				:null}
				<center>
				<i className="fas fa-angle-left" 
				onClick={(e)=>DecreasePageCount(e)} style={{cursor:'pointer'}}></i>
				<i className="fas fa-angle-right" 
				onClick={(e)=>IncreasePageCount(e)} style={{marginLeft:'20px',cursor:'pointer'}}></i>
				</center>
				<i className="fas fa-angle-left" onClick={(e)=>setNextPage(false)}></i>
				<button className="oksowhat" onClick={(e)=>FinishWhatC(e)} style={{position:'absolute',right:'20px',cursor:'pointer'}}>Finish</button>
			</div>
			}
		</div>
		:null}
      </Popup>
  </main> 
  );
};

export default Manga_wat;