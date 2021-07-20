import styled from "styled-components";

export const Slider = styled.input.attrs(() => ({
  type: "range"
}))`
   width: 100%;
   background: transparent;
   -webkit-appearance: none;
   outline: none;
   margin: 0.825rem 0;
  
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 0.85rem;
    background: ${({theme}) => theme.palette.primary.dark};
    border-radius: 2.5rem;
    cursor: pointer;
  }
  
  &::-webkit-slider-thumb {
    width: 1rem;
    height: 2.5rem;
    background-color: ${({theme}) => theme.palette.secondary.light};
    border: 0;
    border-radius: 0.5rem;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -0.865rem;
  }
  
  &::-moz-range-track {
    width: 100%;
    height: 0.85rem;
    background-color: ${({theme}) => theme.palette.primary.dark};
    border-radius: 2.5rem;
    cursor: pointer;
  }
  
   &::-moz-range-thumb {
     width: 1rem;
     height: 2rem;
     background-color: ${({theme}) => theme.palette.secondary.dark};
     border: none;
     border-radius: 0.5rem;
     cursor: pointer;
   }
   
  &::-ms-track {
    width: 100%;
    height: 0.85rem;
    background: transparent;
    border-color: transparent;
    color: transparent;
    cursor: pointer;
  }
  
  &::-ms-fill-lower {
    background-color: ${({theme}) => theme.palette.primary.dark};
    border-radius: 5rem;
  }
  
  &::-ms-fill-upper {
    background-color: ${({theme}) => theme.palette.primary.dark};
    border-radius: 5rem;
  }
  
  &::-ms-thumb {
    width: 1rem;
    height: 2.5rem;
    background-color: ${({theme}) => theme.palette.secondary.dark};
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-top: 0;
  }
`;