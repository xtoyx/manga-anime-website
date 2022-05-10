import React,{useEffect, useState} from 'react';
import '../../pages-css/stars.css'

const StarsRating=({title , UserIdShow , AdminExists , id})=>{
    const [Rating,setRating]=useState(null);
    const [HoverEffects,setHoverEffects]=useState(null);
    const [ListOfRating,setListOfRating]=useState([]);
    useEffect(()=>{
        try{
            fetch("http://localhost:5001/m/RatingStars", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Credentials": true,
                            },body:JSON.stringify({
                                title
                            }),
                        })
                        .then((response) => {
                            if (response.status === 200) return response.json();
                        })
                        .then((resObject) => {
                            setListOfRating(resObject)
                            var collectAllRating=0;
                            if(resObject.length > 0){
                                for(let isx=0;isx<resObject.length;isx++) {
                                    collectAllRating+=resObject[isx].Rating;
                                }
                                setRating(collectAllRating / resObject.length)
                                return;
                            }
                            setRating(collectAllRating)
                            return;
                            })
                            .catch((err) => {
                                console.log(err);
                            });
        }catch(err){
            console.log(err)
        }
    },[])
    const AddingorReducing=(e,ratingValue)=>{
        e.preventDefault();
        if(UserIdShow && !AdminExists){
            var help = ListOfRating;
            var IsThereAUser=false;
            var collectAllRating=0;
            if(ListOfRating.length !== 0){
                for(var i=0; i<ListOfRating.length; i++){
                    if(ListOfRating[i].UserId===UserIdShow){
                        IsThereAUser=true;
                        help[i].Rating=ratingValue;
                        collectAllRating+=ratingValue;
                    }
                    else {
                        collectAllRating +=ListOfRating[i].Rating;
                    }
                }
                if(!IsThereAUser){
                    help.push({
                        UserId:UserIdShow,
                        Rating:ratingValue
                    })      
                    setListOfRating(help)   
                    collectAllRating +=ratingValue;
                }
                setRating(collectAllRating / ListOfRating.length)
            }
            else {
                help.push({
                    UserId:UserIdShow,
                    Rating:ratingValue
                })      
                setListOfRating(help)
                setRating(ratingValue)        
            }
            try{
                fetch("http://localhost:5001/m/RatingStarsChange", {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    "Access-Control-Allow-Credentials": true,
                                },body:JSON.stringify({
                                    title,
                                    EditedRatingStars:help
                                }),
                            })
                            .then((response) => {
                                if (response.status === 200) return response.json();
                            })
                            .then((resObject) => {
                                return;
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
            }catch(err){
                console.log(err)
            }
        }
        else if(AdminExists){
            AddtoLikedListByAdmin()
        } else {
            alert("Please Log In To Rate")
        }
    }
    const AddtoLikedListByAdmin=()=>{
        try{
            fetch("http://localhost:5001/MangaLikedByAdmin/add", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Credentials": true,
                            },body:JSON.stringify({
                                likedid:id
                            }),
                        })
                        .then((response) => {
                            if (response.status === 200) return response.json();
                        })
                        .then((resObject) => {
                            if(resObject.status.message === "Added to the list"){
                                console.log('Added')
                            }
                            return;
                            })
                            .catch((err) => {
                                console.log(err);
                            });
        }catch(err){
            console.log(err)
        }
    }
    return (
        <div>
            {[...Array(5)].map((star,i)=>{
                const ratingValue=i+1;
            return (
            <label key={i *10}>
                <input type="radio" 
                 name="rating" value={ratingValue}
                 onClick={(e)=>AddingorReducing(e,ratingValue)}/>
                <i 
                className="fa fa-star fa-2x star" 
                onMouseEnter={()=>setHoverEffects(ratingValue)}
                onMouseLeave={()=>setHoverEffects(null)}
                style={{color:ratingValue <=(HoverEffects || Rating) ? '#ffc107' : '#e4e5e9'}}></i>
                </label>
            )
            })}
                <br/>
            <label>Did Get Rated {Rating === null ?0 : Rating} , From {ListOfRating.length} Users</label>
        </div>
    )
}
export default StarsRating