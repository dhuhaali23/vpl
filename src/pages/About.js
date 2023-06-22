import React from "react"
import logo from "../assets/dark-logo.png";
import { useNavigate } from "react-router-dom";

function About() {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen select-none ">
                <div className=" lg:block hidden absolute left-0 right-0 h-40 " style={{ background: 'rgba(241, 241, 242,0.5)' }} ></div>
                <div className="absolute top-0 bottom-0 lg:top-auto lg:bottom-auto left-0 right-0 flex lg:flex-row flex-col justify-center lg:justify-start items-center lg:px-5 gap-5" >
                    <img onClick={() => navigate("/home")} className=" cursor-pointer rounded-full w-60 h-60 md:h-72 md:w-72 " src={logo} alt="" />
                    <span className="font-bold text-3xl md:text-7xl lg:text-7xl text-[#398ab9]" >Virtual Physics Lab</span>
                </div>
                <div className="h-1/2 w-full bg-[#BFD7ED]" ></div>
                <div className="h-1/2 w-full bg-[#BFD7ED]" ></div>
            </div>
        </>
    )
}

export default About