import React from "react";
import styled from "styled-components";
import {useNavigate} from 'react-router-dom';


const TvShowContainer = styled.div`
  width: 100%;
  min-height: 6em;
  display: flex;
  border-bottom: 2px solid #d8d8d852;
  padding: 6px 8px;
  align-items: center;
`;

const Thumbnail = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  flex: 0.4;
  cursor:pointer;

  img {
    width: auto;
    height: 100%;
  }
`;

const Name = styled.h3`
  font-size: 15px;
  color: #000;
  margin-left: 10px;
  flex: 2;
  display: flex;
  cursor:pointer;

`;

const Rating = styled.span`
  color: #a1a1a1;
  font-size: 16px;
  display: flex;
  flex: 0.2;
`;

export function TvShow(props) {
  const nav=useNavigate();

  const { thumbanilSrc, name, rating } = props;
  const hitmeupnow =(e,NAMEOFMANGA)=>{
    e.preventDefault();
    nav('/manga/'+NAMEOFMANGA);
    window.location.reload('false');
  }
  return (
    <TvShowContainer>
      <Thumbnail>
        <img src={thumbanilSrc} onClick={(e)=>hitmeupnow(e,name)}/>
      </Thumbnail>
      <Name onClick={(e)=>hitmeupnow(e,name)}>{name}</Name>
      <Rating>{rating || "N/A"}</Rating>
    </TvShowContainer>
  );
}
