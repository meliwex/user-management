import axios from "axios"
import { useState, useEffect, useRef } from 'react'
import { setTokens, getAccessToken, deleteTokens } from "../utils/token"
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { RiChatSmile3Line } from "react-icons/ri";
import { MdOutlineDone, MdOutlineDoneAll } from "react-icons/md";


const MainPage = ({ setLoggedIn }) => {
  return <h1>Hello</h1>
       
};

export default MainPage;