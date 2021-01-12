import React from "react";
import styled from "styled-components";

export const Slider = styled.input.attrs(() => ({
  type: "range"
}))`
   width: 100%;
   margin: 0.825rem 0;
   background-color: transparent;
   -webkit-appearance: none;
   outline: none;
  
  &::-webkit-slider-runnable-track {
    background: ${({theme}) => theme.palette.primary.main};
    border-radius: 25px;
    width: 100%;
    height: 0.85rem;
    box-shadow: 0 0 3px 1px #000000;
    cursor: pointer;
  }
  
  &::-webkit-slider-thumb {
    margin-top: -0.865rem;
    width: 1rem;
    height: 2.5rem;
    background: #476eef;
    border: 0;
    border-radius: 5px;
    cursor: pointer;
    -webkit-appearance: none;
  }
  
  &::-moz-range-track {
    width: 100%;
    background-color: ${({theme}) => theme.palette.primary.main};
    border-radius: 25px;
    height: 0.85rem;
    box-shadow: 0 0 3px 1px #000000;
    cursor: pointer;
  }
  
   &::-moz-range-thumb {
     width: 1rem;
     height: 2rem;
     background-color: ${({theme}) => theme.palette.secondary.main};
     border: none;
     border-radius: 5px;
     cursor: pointer;
   }
   
  &::-ms-track {
    background: transparent;
    border-color: transparent;
    color: transparent;
    width: 100%;
    height: 0.85rem;
    box-shadow: 0 0 3px 1px #000000;
    cursor: pointer;
  }
  
  &::-ms-fill-lower {
    background-color: ${({theme}) => theme.palette.primary.main};
    border-radius: 50px;
  }
  
  &::-ms-fill-upper {
    background-color: ${({theme}) => theme.palette.primary.main};
    border-radius: 50px;
  }
  
  &::-ms-thumb {
    width: 1rem;
    height: 2.5rem;
    background-color: ${({theme}) => theme.palette.secondary.main};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 0;
  }
`;