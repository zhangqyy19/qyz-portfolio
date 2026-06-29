import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import profilePic from "../images/circprof.png";
import '../styles/AboutPage.scss';

const AboutPage: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="page-content about-page fade-in-up">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-text">
            <h1>Qian Yun Zhang</h1>
            <p className="subtitle">Software Engineer · Web Developer · Tech Explorer</p>
            <p className="short-bio">
              I'm a passionate Full Stack Engineer who loves building intuitive, 
              performant web applications and exploring new technologies. My work 
              focuses on clean design, scalable architecture, and meaningful user experiences.
            </p>
            <div className="social-links">
              <a href="https://github.com/zhangqyy19" target="_blank" rel="noreferrer">
                <GitHubIcon />
              </a>
              <a href="https://www.linkedin.com/in/qian-yun-zhang-555291346/" target="_blank" rel="noreferrer">
                <LinkedInIcon />
              </a>
              <a href="https://drive.google.com/file/d/1grmQJLXA37KOdUTQz5KeVPOnuXPWcxIW/view?usp=drive_link" target="_blank" rel="noreferrer">
                <DescriptionIcon />
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src={profilePic} alt="Qian Yun Zhang" className="profile-pic" />
          </div>
        </div>

        {/* Longer Bio */}
        <div className="bio-section">
          <h2>A Little More About Me</h2>
          <p>
            Outside of coding, I enjoy creative projects, problem-solving, and 
            learning how emerging tools like AI can shape the future of software 
            development. I'm currently pursuing a B.S. in Computer Science at the 
            University of Michigan, where I've maintained a 4.0 GPA and been awarded 
            the Regents Merit Scholarship.
          </p>
          <p>
            I've had the opportunity to work on diverse projects ranging from 
            full-stack web applications to GenAI-powered solutions. I thrive in 
            collaborative environments and love tackling complex challenges that 
            push the boundaries of what's possible with technology.
          </p>
          <p>
            When I'm not at my computer, you can find me exploring new places, 
            trying different cuisines, or working on creative side projects that 
            blend art and technology.
          </p>
        </div>

        {/* Casual Photos */}
        <div className="photos-section">
          <h2>Life Snapshots</h2>
          <div className="photos-grid">
            <div className="photo-item">
              {/* Add your casual photo here */}
              Add Photo
            </div>
            <div className="photo-item">
              {/* Add your casual photo here */}
              Add Photo
            </div>
            <div className="photo-item">
              {/* Add your casual photo here */}
              Add Photo
            </div>
         <div className="photo-item">
              {/* Add your casual photo here */}
              Add Photo
            </div>
            <div className="photo-item">
              {/* Add your casual photo here */}
              Add Photo
            </div>
            <div className="photo-item">
         {/* Add your casual photo here */}
              Add Photo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;