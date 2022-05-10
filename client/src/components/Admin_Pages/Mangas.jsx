
import Popup from "../Popup";

import {useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom';


const Mangas = ({Info}) => {
  const nav = useNavigate();
   const [Mangas,setMangas]=useState([]);
   const [PageIndexStart,setPageIndexStart]=useState();
   const [PageIndexEnd,setPageIndexEnd]=useState();
   const [checked, setChecked] = useState([]);
   const [HowManyisChecked,setHowManyisChecked] = useState(0);
   /*Search Bar*/
   const [searchQuery, setSearchQuery] = useState("");
   const [IsThereSearchre, setIsThereSearchre] = useState(false);
   const [SearchResult,setSearchResult] = useState([]);
   const [isLoading,setLoading] = useState(true);
   /************/

   // Edit //
   const [ButtonPopup,setButtonPopup] =useState(false);
   const [ShowingNow,setShowingNow] = useState([]);
   const [NewPhoto,setNewPhoto] = useState();
   const [WhatIsTheName,setWhatIsTheName] = useState();
    ////////////////////////////////
   useEffect(() => {
      setMangas(Info.Mangas)
      setPageIndexStart(0)
      setPageIndexEnd(10)
      var helppppp=[];
      Info.Mangas.map((value,index)=>{
        helppppp.push({id:index,checked:false})
      })
      setChecked(helppppp)
    },[])
      const get_allmangas=()=>{
        fetch("http://localhost:5001/m", {
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
                  setMangas(resObject)
                  var helppppp=[];
                  resObject.map((value,index)=>{
                    helppppp.push({id:index,checked:false})
                  })
                  setHowManyisChecked(0)
                  setChecked(helppppp)
                  return;
                  })
                  .catch((err) => {
                    console.log(err);
                  });
      }
    const pageStartAll=(e)=>{
      e.preventDefault();
      setPageIndexEnd(10)
      setPageIndexStart(0)
    }
    const pageEndAll=(e)=>{
      e.preventDefault();
      setPageIndexEnd(Mangas.length)
      setPageIndexStart(Mangas.length-10)
    }

    const AddPage=(e)=>{
      e.preventDefault();
      if(PageIndexEnd !== Mangas.length){
        setPageIndexEnd(PageIndexEnd+10)
        setPageIndexStart(PageIndexStart+10)
      }
    }
    const reducePage=(e)=>{
      e.preventDefault();
      if(PageIndexStart!==0){
        setPageIndexEnd(PageIndexEnd-10)
        setPageIndexStart(PageIndexStart-10)
      }
    }

    const handleOnChange = (e,position) => {  
      if(position === 0){
          var helpmenow=[];
          if (e.target.checked) {
              setHowManyisChecked(Mangas.length)
              Mangas.map((value,index)=>{
                  helpmenow.push({id:index,checked:true})
              })
          } else {
              setHowManyisChecked(0)
              Mangas.map((value,index)=>{
                  helpmenow.push({id:index,checked:false})
              }) 
          }
          setChecked(helpmenow)
        return ; 
      }
      if (e.target.checked) {
              var fuckme=HowManyisChecked;
              fuckme++;
              setHowManyisChecked(fuckme)
              setChecked(
                  checked.map((check)=>
                  check.id === position ?{...check,checked:!check.checked} :{...check})
              ) 
        } else {
              // remove from list
              var fuckme=HowManyisChecked;
              fuckme--;
              setHowManyisChecked(fuckme)
              setChecked(
                  checked.map((check)=>
                  check.id === position ?{...check,checked:!check.checked} :{...check})
                    )
        }     
    };
    const Deletenow =(arr)=>{
      arr.map((value,index)=>{
        try{
          fetch("http://localhost:5001/m/del/manga", {
                          method: "DELETE",
                          credentials: "include",
                          headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                              "Access-Control-Allow-Credentials": true,
                          },body:JSON.stringify({
                              name:value.Name
                          }),
                      })
                      .then((response) => {
                          if (response.status === 200) return response.json();
                      })
                      .then((resObject) => {
                          console.log('deleted')
                          return;
                          })
                          .catch((err) => {
                              console.log(err);
                          });
      }catch(err){
          console.log(err)
      }
      })
    }
    const WaitSomeTime = (e)=>{
      e.preventDefault();
      var whichison=[];
      var deleteitlater=[];
      checked.map((value,index)=>{
        if(value.checked === true && index !== 0){
          whichison.push(value)
        }
      })

      Mangas.map((value,index)=>{
        whichison.map((value2,index3)=>{
          if(value2.id === index){
           deleteitlater.push(value)
          }
        })
      })
      Deletenow(deleteitlater)
      get_allmangas()

    }

    /*******
    Search Bar
    */
    const onChangeSearch=async (e)=>{
      e.preventDefault();
      setLoading(true)
      if (e.target.value.trim() === ""){
        setIsThereSearchre(false);
        setMangas(Info.Mangas)
        setPageIndexStart(0)
        setPageIndexEnd(10)
        var helppppp=[];
        Info.Mangas.map((value,index)=>{
          helppppp.push({id:index,checked:false})
        })
        setChecked(helppppp)
        setSearchResult([]);
      }
      else{
        setIsThereSearchre(true);
        setPageIndexEnd(10);
        setPageIndexStart(0);
        var helppppp=[];
        var listme=[];
        listme=(Mangas.filter(post => {
          if (e.target.value === '') {
            return post;
          } else if (post.Name.toLowerCase().includes(e.target.value.toLowerCase())) {
            return post;
          }
        }))
        setSearchResult(listme)
        listme.map((value,index)=>{
          helppppp.push({id:index,checked:false})
        })
        setChecked(helppppp)
        setHowManyisChecked(0)
        setLoading(false)
      }
      setSearchQuery(e.target.value);
    }
    const handleOnChangeSearch = (e,position) => {  
      if(position === -1){
          var helpmenow=[];
          if (e.target.checked) {
              setHowManyisChecked(SearchResult.length)
              SearchResult.map((value,index)=>{
                  helpmenow.push({id:index,checked:true})
              })
          } else {
              setHowManyisChecked(0)
              SearchResult.map((value,index)=>{
                  helpmenow.push({id:index,checked:false})
              }) 
          }
          setChecked(helpmenow)
        return ; 
      }
      if (e.target.checked) {
              var fuckme=HowManyisChecked;
              fuckme++;
              setHowManyisChecked(fuckme)
              setChecked(
                  checked.map((check)=>
                  check.id === position ?{...check,checked:!check.checked} :{...check})
              ) 
      } else {
              // remove from list
              var fuckme=HowManyisChecked;
              fuckme--;
              setHowManyisChecked(fuckme)
              setChecked(
                  checked.map((check)=>
                  check.id === position ?{...check,checked:!check.checked} :{...check})
                    )
      }     
    };
    /**********/

    // Edit //
    const EditStartFor = (e,whattt)=>{
      e.preventDefault();
      setShowingNow(whattt)
      setButtonPopup(true)
      setWhatIsTheName(whattt.Name)
    }
    const OnChangeEdit = (e)=>{
      e.preventDefault();
      let updatedValue = {};
      updatedValue = {Name:e.target.value};
      setShowingNow(shopCart => ({
           ...shopCart,
           ...updatedValue
         }));
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
  const UpdateEverything =async (e)=>{
    e.preventDefault();
    var response;
    if(NewPhoto !== ' ' && NewPhoto){
      try {
        response = await fetch('http://localhost:5001/m/upload/photo', {
              method: 'POST',
              credentials: "include",
              body: JSON.stringify({ data: NewPhoto , id:ShowingNow._id}),
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
    if(WhatIsTheName !== ShowingNow.Name){
      try {
        response = await fetch('http://localhost:5001/m/edit', {
              method: 'POST',
              credentials: "include",
              body: JSON.stringify(
                { data: ShowingNow , 
                  id:ShowingNow._id}
                ),
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
  }
    /*******************/
  return (
    <main>
      <center>
     <div>
        <input type="search" className="search-input" 
        value={searchQuery}
        onChange={(e)=>onChangeSearch(e)}
        placeholder="Type Something"/>
        <button className="search-button">
        <i className="fas fa-search"></i>
      </button>  
      </div> 
      </center>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>
              <div className="form-check">
                {
                SearchResult.length > 0  && IsThereSearchre && !isLoading ? 
                <input type="checkbox" 
                className="form-check-input"
                value={checked}
                onChange={(e) => handleOnChangeSearch(e,-1)} 
                id="tableMaterialCheck1"/>
                :
                <input type="checkbox" 
                className="form-check-input"
                value={checked}
                onChange={(e) => handleOnChange(e,0)} 
                id="tableMaterialCheck1"/>
                }
                <label className="form-check-label" htmlFor="tableMaterialCheck1" style={{width:'30px'}}>Select All</label>
              </div>
            </th>
            <th style={{width:'100px'}}>Image</th>
            <th style={{width:'30%'}}>Name</th>
            <th >Geners</th>
            <th>Id</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
      { 
      Mangas.length>0 && !IsThereSearchre ?
      Mangas.map((value,index) => {
        if(index < PageIndexEnd && index > PageIndexStart) {
          return(
            <tr>
              <th scope="row" key={value._id}>
                <div className="form-check">
                  <input type="checkbox" 
                  className="form-check-input"
                  checked={checked[index].checked}
                  onChange={(e) => handleOnChange(e,index)}
                   id="tableMaterialCheck2"/>
                  <label className="form-check-label" htmlFor="tableMaterialCheck2"></label>
                </div>
              </th>
              <td><img src={value.PictureLink} style={{ width: 'auto',
          height: '100px'
          }}></img></td>
              <td >{value.Name}</td>
              <td>{(value.Genre.join(",  "))}</td>
              <td>{index}</td>
              <td><i className="fas fa-edit" style={{cursor:'pointer'}} onClick={(e)=>EditStartFor(e,value)}></i></td>
            </tr> 
          )
        }
      })     
         : null
    }

      {/* Search results */}
      { 
      SearchResult.length > 0  && IsThereSearchre && !isLoading ?
      SearchResult.map(
        (value,index) => {
        if(index < 10 ) {
          return(
            <tr>
              <th scope="row" key={value._id+index}>
                <div className="form-check">
                  <input type="checkbox" 
                  className="form-check-input"
                  checked={checked[index].checked}
                  onChange={(e) => handleOnChangeSearch(e,index)}
                   id="tableMaterialCheck2"/>
                  <label className="form-check-label" htmlFor="tableMaterialCheck2"></label>
                </div> 
              </th>
              <td><img src={value.PictureLink} style={{ width: 'auto',
          height: '100px'
          }}></img></td>
              <td>{value.Name}</td>
              <td>{(value.Genre.join(",  "))}</td>
              <td>{index+1}</td>
              <td><i className="fas fa-edit" style={{cursor:'pointer'}}  onClick={(e)=>EditStartFor(e,value)}></i></td>
            </tr> 
          )
        }
      })     
         : null
      }
      {/*                */}

          </tbody>  
    </table>
    <center>
    {IsThereSearchre ? 
    <div>
      <label>Rows Selected :  {HowManyisChecked} from {SearchResult.length}</label>
      {/* {UndoIsOn ? 
        <i className="fas fa-undo" style={{cursor:'pointer',marginLeft:'30px'}}></i>
        :null} */}
        {HowManyisChecked > 0 ? 
          <i className="fas fa-trash" onClick={(e)=>WaitSomeTime(e)}style={{cursor:'pointer',marginLeft:'30px'}}></i>
          :null}
    </div>
     :  
     <label>Rows Selected :  {HowManyisChecked} from {Mangas.length}</label>
     }
     
    </center>
    {!IsThereSearchre ? 
    <center>
    <i className="fas fa-angle-double-left" onClick={(e)=>pageStartAll(e)} style={{marginRight:'10px',cursor:'pointer'}}></i>
    <i className="fas fa-angle-left" onClick={(e)=>reducePage(e)} style={{marginRight:'10px',cursor:'pointer'}}></i>
    <label>{PageIndexStart}</label>
    <label>-</label>
    <label>{PageIndexEnd}</label>
    <i className="fas fa-angle-right" onClick={(e)=>AddPage(e)} style={{marginRight:'10px',marginLeft:'10px',cursor:'pointer'}}></i>
    <i className="fas fa-angle-double-right" onClick={(e)=>pageEndAll(e)} style={{marginRight:'10px',cursor:'pointer'}}></i>
    {/* {UndoIsOn ? 
      <i className="fas fa-undo" style={{cursor:'pointer',marginLeft:'30px'}}></i>
      :null} */}
      {HowManyisChecked > 0 ? 
      <i className="fas fa-trash" onClick={(e)=>WaitSomeTime(e)}style={{cursor:'pointer',marginLeft:'30px'}}></i>
      :null} 
    </center>
      : null
      }
      <Popup trigger={ButtonPopup} setTrigger={setButtonPopup}>
        <center>
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
        src={ShowingNow.PictureLink}
        style={{ width: '200px',
          height: '200px'
          }} />
          <br/>
          <input type="file" accept="image/*" name="image-upload" id="input" onChange={imageHandler} style={{marginTop:'20px',marginLeft:'20px'}}/>
          </>
          }
        
        <br/>
        <label>Name : </label>
        <input type="text" id="user_name" className="text-camp"
        style={{marginTop:'30px'}} 
        onChange={(e)=>OnChangeEdit(e)}
        value={ShowingNow.Name} />
        </center>
        <button onClick={(e)=>UpdateEverything(e)} className='oksowhat'>Submit</button>
        <button onClick={(e)=>nav(`${ShowingNow.Name}`)} className='oksowhat' style={{marginLeft:'70%'}}>Show More Info</button>
      </Popup>
    </main>
    
  );
};

export default Mangas;
