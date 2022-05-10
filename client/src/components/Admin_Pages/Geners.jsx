import Popup from "../Popup";

import {useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom';



const Geners = ({Info}) => {
  const nav = useNavigate();
   const [Geners2,setGeners]=useState([]);
   const [PageIndexStart,setPageIndexStart]=useState();
   const [PageIndexEnd,setPageIndexEnd]=useState();
   const [checked, setChecked] = useState([]);
   const [HowManyisChecked,setHowManyisChecked] = useState(0);
   // Edit //
   const [ButtonPopup,setButtonPopup] =useState(false);
   const [ShowingNow,setShowingNow] = useState([]);
   const [Name,setName] = useState();
   const [Description,setDescription] = useState();
    ////////////////////////////////

    // Add To 
    const [AddFunction,setAddFunction] = useState(false);
    const [NameAdded,setNameAdded] = useState();
    const [DescriptionAdded,setDescriptionAdded] = useState();
    ///////////////////////////////
   useEffect(() => {
    fetch("http://localhost:5001/tags/", {
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
      setGeners(resObject)
      setPageIndexStart(0)
      setPageIndexEnd(10)
      var helppppp=[];
      resObject.map((value,index)=>{
        helppppp.push({id:index,checked:false})
      })
      setChecked(helppppp)
      return;
      })
      .catch((err) => {
        console.log(err);
      });
      
    },[])
      const get_allGeners2=()=>{
        fetch("http://localhost:5001/tags/", {
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
                  setGeners(resObject)
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
      setPageIndexEnd(Geners2.length)
      setPageIndexStart(Geners2.length-10)
    }

    const AddPage=(e)=>{
      e.preventDefault();
      if(PageIndexEnd + 10 <= Geners2.length){
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
      if(position === -1){
          var helpmenow=[];
          if (e.target.checked) {
              setHowManyisChecked(Geners2.length)
              Geners2.map((value,index)=>{
                  helpmenow.push({id:index,checked:true})
              })
          } else {
              setHowManyisChecked(0)
              Geners2.map((value,index)=>{
                  helpmenow.push({id:index,checked:false})
              }) 
          }
          setChecked(helpmenow)
        return ; 
      }
      else{
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
      }
    };
    const Deletenow =(arr)=>{
      arr.map((value,index)=>{
        try{
          fetch("http://localhost:5001/tags/del", {
                          method: "DELETE",
                          credentials: "include",
                          headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                              "Access-Control-Allow-Credentials": true,
                          },body:JSON.stringify({
                              name:value.name
                          }),
                      })
                      .then((response) => {
                          if (response.status === 200) return response.json();
                      })
                      .then((resObject) => {
                          console.log('deleted')
                          window.location.reload('false');
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

      Geners2.map((value,index)=>{
        whichison.map((value2,index3)=>{
          if(value2.id === index){
           deleteitlater.push(value)
          }
        })
      })
      Deletenow(deleteitlater)
      get_allGeners2()
    }

    // Edit //
    const EditStartFor = (e,whattt)=>{
      e.preventDefault();
      setShowingNow(whattt)
      setButtonPopup(true)
    }
  const UpdateEverything =async (e)=>{
    e.preventDefault();
    var response;
    if(Name !=='' &&( Name !== ShowingNow.name || Description !== ShowingNow.description)){
      response = await fetch('http://localhost:5001/tags/edit', {
              method: 'POST',
              credentials: "include",
              body: JSON.stringify(
                { 
                  description: Description ? Description :ShowingNow.description,
                  name: Name ? Name :ShowingNow.name,
                  id:ShowingNow._id,
               }
                ),
              headers: {  Accept: "application/json",
              'Content-Type': 'application/json',
              "Access-Control-Allow-Credentials": true, },
          });
          const data = await response.json()
          if (data.status === 'ok') {
            setButtonPopup(false)
            window.location.reload('false');
          }
    }
  }
  // Add To 

  const AddToGeners=(e)=>{
    e.preventDefault();
    setButtonPopup(true)
    setAddFunction(true)
  }
  const AddSomethingToTheList=async (e)=>{
    e.preventDefault();
    var response;
    if(NameAdded !=='' &&DescriptionAdded !== ''){
      response = await fetch('http://localhost:5001/tags/add', {
              method: 'POST',
              credentials: "include",
              body: JSON.stringify(
                { 
                  description: DescriptionAdded,
                  name: NameAdded,
               }
                ),
              headers: {  Accept: "application/json",
              'Content-Type': 'application/json',
              "Access-Control-Allow-Credentials": true, },
          });
          const data = await response.json()
          if (data.status === 'Added') {
            setButtonPopup(false)
            setAddFunction(false)
            window.location.reload('false');
          }
          if(data.status === 'exists'){
            alert('it does Exists')
          }
    }
  }
    ///////////////////////////////
  return (
    <main>
      <table className="table table-bordered">
      <thead>
        <tr>
          <th>
            <div className="form-check">
              <input type="checkbox" 
              className="form-check-input"
              value={checked}
              onChange={(e) => handleOnChange(e,-1)} 
              id="tableMaterialCheck1"/>
              <label className="form-check-label" htmlFor="tableMaterialCheck1" style={{width:'30px'}}>Select All</label>
            </div>
          </th>
          <th style={{width:'100px'}}>Name</th>
          <th>Description</th>
          <th>Id</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
    { 
    Geners2 && checked.length > 0 ?
    Geners2.map((value,index) => {
      if(index < PageIndexEnd && index > PageIndexStart -1) {
        return(
          <tr>
            <th scope="row" key={value._id} style={{width:'30px'}}>
              <div className="form-check">
                <input type="checkbox" 
                className="form-check-input"
                checked={checked[index].checked}
                onChange={(e) => handleOnChange(e,index)}
                 id="tableMaterialCheck2"/>
                <label className="form-check-label" htmlFor="tableMaterialCheck2"></label>
              </div>
            </th>
            <td >{value.name}</td>
            <td>{value.description}</td>
            <td>{index}</td>
            <td><i className="fas fa-edit" style={{cursor:'pointer'}} onClick={(e)=>EditStartFor(e,value)}></i></td>
          </tr> 
        )
      }
    })     
       : null
  }

    
        </tbody>  
  </table>
  <center>
   <label>Rows Selected :  {HowManyisChecked} from {Geners2.length}</label> 
  </center> 
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
    <i class="fa fa-plus" onClick={(e)=>AddToGeners(e)} style={{cursor:'pointer',marginLeft:'10px'}}></i>
    {HowManyisChecked > 0 ? 
    <i className="fas fa-trash" onClick={(e)=>WaitSomeTime(e)}style={{cursor:'pointer',marginLeft:'30px'}}></i>
    
    :null} 
  </center>
    <Popup trigger={ButtonPopup} setTrigger={setButtonPopup}>
      {AddFunction ? 
      <center>
      <label>Name : </label>
      <input type="text" id="user_name" className="text-camp"
      style={{marginTop:'30px'}} 
      onChange={(e)=>setNameAdded(e.target.value)}
      value={NameAdded} />

       <br/>
      <label>Description : </label>
      <input type="text" id="user_name" className="text-camp"
      style={{marginTop:'30px'}} 
      onChange={(e)=>setDescriptionAdded(e.target.value)}
      value={DescriptionAdded} />

      <br/>
      <button onClick={(e)=>AddSomethingToTheList(e)} className='oksowhat' style={{marginTop:'30px'}}>Submit</button>
      </center>
      : 
      <center>
      <label>Name : </label>
      <input type="text" id="user_name" className="text-camp"
      style={{marginTop:'30px'}} 
      onChange={(e)=>setName(e.target.value)}
      value={Name ? Name :ShowingNow.name} />

       <br/>
      <label>Description : </label>
      <input type="text" id="user_name" className="text-camp"
      style={{marginTop:'30px'}} 
      onChange={(e)=>setDescription(e.target.value)}
      value={Description ? Description :ShowingNow.description} />

      <br/>
      <button onClick={(e)=>UpdateEverything(e)} className='oksowhat' style={{marginTop:'30px'}}>Submit</button>
      </center>
      }
    </Popup>
    </main>
  );
};

export default Geners;