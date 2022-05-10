import { createGlobalStyle } from 'styled-components';
export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
    h1,
    label,
    h2,
    h3,
    h4,
    h5,
    h6,.col-lg-12m{
    color: ${({ theme }) => theme.alltext};
    transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    .row,header.header,footer.footer{
        background: ${({ theme }) => theme.body};
    transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    .footer__nav ul li a{
      color: ${({ theme }) => theme.a};
      transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    .footer__nav ul li a:hover{
      color: ${({ theme }) => theme.hover};
      transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    .header__nav ul li a{
      color: ${({ theme }) => theme.a};
      transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    .header__nav ul li a:hover{
      color: ${({ theme }) => theme.hover};
      transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    section{
        background:${({ theme }) => theme.body};
      transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    .normal__breadcrumb__text h2,.normal__breadcrumb__text p{
      color: ${({ theme }) => theme.alltext};
      transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    .page-up a{
      background: ${({ theme }) => theme.arrowbackground};
      transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    .header__right span{
      color: ${({ theme }) => theme.a};
      transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    .header__right span:hover{
      color: ${({ theme }) => theme.hover};
      transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    .section-title h4{
      color : ${({ theme }) => theme.alltext};
    }
    .btn__all a { 
      color : ${({ theme }) => theme.a};
    }
    .btn__all a:hover{
      color: ${({ theme }) => theme.hover};
      transition: background 0.2s ease-in, color 0.2s ease-in;
    }
    /* home */
    .product__item__text h5 a{
      color : ${({ theme }) => theme.alltext};
    }
    .product__item__text ul li{
      color : ${({ theme }) => theme.alltext};
      background: ${({ theme }) => theme.arrowbackground};
      cursor:pointer;
    }
    .product__sidebar .section-title h5
    ,.product__sidebar__view .filter__controls li,
    .product__sidebar__comment ul li ,
    .product__sidebar__comment__item__text h5 a ,
    .product__sidebar__comment__item__text span {
      color : ${({ theme }) => theme.alltext};
    }

    /* manga Show Page */

    .anime__details__text h3 
    , .anime__details__text span 
    , .anime__details__text p
    ,.anime__details__text ul li
    ,.anime__details__text ul li span {
      color : ${({ theme }) => theme.alltext};
    }
    .anime__details__episodes h5,.anime__details__review h5,.anime__details__form h5
     {
      color : ${({ theme }) => theme.alltext};
    }
    .anime__details__episodes a , .login__form form button {
      color : ${({ theme }) => theme.alltext};
      background : ${({ theme }) => theme.arrowbackground};
    }
    .anime__details__form form textarea{
      color : ${({ theme }) => theme.alltext};
      background : ${({ theme }) => theme.arrowbackground};
    }
    .login__form form button:hover {
      color: ${({ theme }) => theme.hover};
    }
    .login__form h3 , .login__form .forget_pass ,.login__register h3 
    , .login__social__links span ,.login__social__links ul li a{
      color : ${({ theme }) => theme.alltext};
    }
    .signup .login__form h5 ,.signup .login__social__links h3 , .signup .login__social__links ul li a{
      color : ${({ theme }) => theme.alltext};
    }
    .p-3 .py-5 h4 ,.text-center button{
      color : ${({ theme }) => theme.alltext};
    }
    .profile-container .profile-info-list li ,.profile-container .profile-info-list li .field
    ,.m-b-10  {
      color : ${({ theme }) => theme.alltext};
    }
    .product__pagination a ,.product__pagination a i {
      color : ${({ theme }) => theme.alltext};
    }
    .login__form form .input__item input {
      background : ${({ theme }) => theme.alltext};
    }
   .blog__details__title * , .blog__details__title h6 , .blog__details__title h2
   ,.blog__details__content p
   .blog__details__content h4 ,.blog__details__tags a
   {
    color : ${({ theme }) => theme.alltext};
   }
   .watch-btn{
    color : ${({ theme }) => theme.alltext};
   }
`;
export const lightTheme = {
  body: '#fff',
    a: '#121620',
  alltext:"#000000",
    hover:"#bad4c3",
    arrowbackground:'#72827f'
};
export const darkTheme = {
  body: '#0b0c2a',
    a: '#b7b7b7',
  alltext:"#fff",
  hover:"#ffffff",
  arrowbackground:'#e53637'
};