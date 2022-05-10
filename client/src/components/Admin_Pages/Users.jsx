import Popup from "../Popup";

import {useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom';


const Users = ({Info}) => {
  const nav = useNavigate();
   const [Users,setUsers]=useState([]);
   const [PageIndexStart,setPageIndexStart]=useState();
   const [PageIndexEnd,setPageIndexEnd]=useState();
   const [checked, setChecked] = useState([]);
   const [HowManyisChecked,setHowManyisChecked] = useState(0);
   // Edit //
   const [ButtonPopup,setButtonPopup] =useState(false);
   const [ShowingNow,setShowingNow] = useState([]);
   const [NewPhoto,setNewPhoto] = useState();
   const [Username,setUserName] = useState();
   const [Email,setEmail] = useState();
   const [Source,setSource] = useState();
   const [NewPassword,setNewPassword]=useState();
    ////////////////////////////////
   useEffect(() => {
    fetch("http://localhost:5000/api/getallUsers", {
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
      setUsers(resObject)
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
      const get_allUsers=()=>{
        fetch("http://localhost:5000/api/getallUsers", {
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
                  setUsers(resObject)
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
      setPageIndexEnd(Users.length)
      setPageIndexStart(Users.length-10)
    }

    const AddPage=(e)=>{
      e.preventDefault();
      if(PageIndexEnd + 10 <= Users.length){
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
              setHowManyisChecked(Users.length)
              Users.map((value,index)=>{
                  helpmenow.push({id:index,checked:true})
              })
          } else {
              setHowManyisChecked(0)
              Users.map((value,index)=>{
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
          fetch("http://localhost:5000/api/admin/deleteUser", {
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

      Users.map((value,index)=>{
        whichison.map((value2,index3)=>{
          if(value2.id === index){
           deleteitlater.push(value)
          }
        })
      })
      Deletenow(deleteitlater)
      get_allUsers()
    }

    // Edit //
    const EditStartFor = (e,whattt)=>{
      e.preventDefault();
      setShowingNow(whattt)
      setButtonPopup(true)
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
        response = await fetch('http://localhost:5000/api/admin/upload/photo', {
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
    if(Username !== ShowingNow.Name || Source !== ShowingNow.source || Email !== ShowingNow.email
      || NewPassword !== ShowingNow.password){
      try {
        response = await fetch('http://localhost:5000/api/admin/update', {
              method: 'POST',
              credentials: "include",
              body: JSON.stringify(
                { 
                  source: Source ? Source :ShowingNow.source,
                  name: Username ? Username :ShowingNow.name,
                  email: Email ? Email :ShowingNow.email,
                  password: NewPassword ? NewPassword :ShowingNow.password,
                  id:ShowingNow._id,
                photo: NewPhoto ? NewPhoto : ShowingNow.photo }
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
          <th style={{width:'100px'}}>Image</th>
          <th style={{width:'100px'}}>Username</th>
          <th>Email</th>
          <th>source</th>
          <th style={{width:'50px'}}>Password</th>
          <th>Id</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
    { 
    Users.length>0 && checked.length > 0 ?
    Users.map((value,index) => {
      if(index < PageIndexEnd && index > PageIndexStart -1) {
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
            <td><img src={value.photo} style={{ width: 'auto',
        height: '100px'
        }}></img></td>
            <td >{value.name}</td>
            <td>{value.email}</td>
            <td>{value.source}</td>
            <td>{value.password}</td>
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
   <label>Rows Selected :  {HowManyisChecked} from {Users.length}</label> 
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
    {HowManyisChecked > 0 ? 
    <i className="fas fa-trash" onClick={(e)=>WaitSomeTime(e)}style={{cursor:'pointer',marginLeft:'30px'}}></i>
    :null} 
  </center>
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
      src={ShowingNow.photo}
      style={{ width: '200px',
        height: '200px'
        }} />
        <br/>
        <input type="file" accept="image/*" name="image-upload" id="input" onChange={imageHandler} style={{marginTop:'20px',marginLeft:'20px'}}/>
        </>
        }
      
      <br/>
      <label>Username : </label>
      <input type="text" id="user_name" className="text-camp"
      style={{marginTop:'30px'}} 
      onChange={(e)=>setUserName(e.target.value)}
      value={Username ? Username :ShowingNow.name} />

      <label>Source : </label>
      <input type="text" id="user_name" className="text-camp"
      style={{marginTop:'30px'}} 
      onChange={(e)=>setSource(e.target.value)}
      value={Source ? Source :ShowingNow.source} />
       <br/>
      <label>Email : </label>
      <input type="text" id="user_name" className="text-camp"
      style={{marginTop:'30px'}} 
      onChange={(e)=>setEmail(e.target.value)}
      value={Email ? Email :ShowingNow.email} />

      

        <br/>
      <label>New Password : </label>
      <input type="text" id="user_name" className="text-camp"
      style={{marginTop:'30px'}} 
      onChange={(e)=>setNewPassword(e.target.value)}
      value={NewPassword ? NewPassword :ShowingNow.password} />
      <br/>
      <button onClick={(e)=>UpdateEverything(e)} className='oksowhat' style={{marginTop:'30px'}}>Submit</button>
      </center>
    </Popup>
  </main>
  );
};

export default Users;