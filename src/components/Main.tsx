import React, { useState, useEffect } from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import '../assets/styles/Main.scss';
import profilePic from "../images/circprof.png";

function Main() {
  const titles = [
    "Software Engineer",
    "Web Developer",
    "UI/UX Builder",
    "Tech Explorer",
    "Lifelong Learner"
  ];

  //fade in fade out
  /*const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const holdMs = 1500;    
    const fadeMs = 500;     

    const holdTimer = setTimeout(() => {
      setFadeIn(false);                 
      const swapTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % titles.length); 
        setFadeIn(true);               
      }, fadeMs);

      return () => clearTimeout(swapTimer);
    }, holdMs);

    return () => clearTimeout(holdTimer);
  }, [index, titles.length]);*/

  //typewriter
  const [index, setIndex] = useState(0);         
  const [text, setText] = useState("");          
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100); 

  useEffect(() => {
    const current = titles[index % titles.length];

    if (!isDeleting && text === current) {
      const pause = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pause);
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % titles.length);
    }

    const timer = setTimeout(() => {
      const nextText = isDeleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      setText(nextText);
      setTypingSpeed(isDeleting ? 50 : 100); 
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, typingSpeed, titles, index]);


  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img src={profilePic} alt="Avatar" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/zhangqyy19" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/qian-yun-zhang-555291346/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            <a href="https://drive.google.com/file/d/1rqkPdjCW8nHiPhDNyckBRZae7zyE7-an/view?usp=sharing" target="_blank" rel="noreferrer"><ContactPageIcon/></a>
          </div>
          <h1>Qian Yun Zhang</h1>
          <p className="typewriter">
            {text}
            <span className="cursor" />
          </p>

          <div className="mobile_social_icons">
            <a href="https://github.com/zhangqyy19" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/qian-yun-zhang-555291346/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;