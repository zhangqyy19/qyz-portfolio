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

  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const holdMs = 1500;    // visible time
    const fadeMs = 500;     // must match CSS transition

    const holdTimer = setTimeout(() => {
      setFadeIn(false);                 // start fade out
      const swapTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % titles.length); // swap word
        setFadeIn(true);               // fade in
      }, fadeMs);

      return () => clearTimeout(swapTimer);
    }, holdMs);

    return () => clearTimeout(holdTimer);
  }, [index, titles.length]);


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
            <a href="https://www.linkedin.com/in/qian-yun-zhang-555291346/" target="_blank" rel="noreferrer"><ContactPageIcon/></a>
          </div>
          <h1>Qian Yun Zhang</h1>
          <p className={`fade-text ${fadeIn ? "fade-in" : "fade-out"}`}>{titles[index]}</p>

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