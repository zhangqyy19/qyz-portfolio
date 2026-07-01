import React, { useState, useEffect } from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import profilePic from "../images/circprof.png";
import RandomQuote from '../components/RandomQuote';
import SpotifyPlayer from '../components/SpotifyPlayer';
import '../styles/AboutPage.scss';

const AboutPage: React.FC = () => {
  const titles = [
    "Software Engineer",
    "Web Developer",
    "UI/UX Builder",
    "Tech Explorer",
    "Lifelong Learner"
  ];

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
    <div className="page-wrapper">
      <div className="page-content about-page fade-in-up">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-text">
            <h1>Qian Yun Zhang</h1>
            <p className="subtitle typewriter">
              {text}
              <span className="cursor" />
            </p>
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

        {/* Life Snapshots */}
        <div className="photos-section">
          <h2>Life Snapshots</h2>
          <div className="snapshots-list">
            <div className="snapshot-item">
              <div className="snapshot-image">
                {/* Add photo here */}
                <div className="photo-placeholder">Photo 1</div>
              </div>
              <div className="snapshot-text">
                <h3>Exploring New York</h3>
                <p>Making the most of life in the city that never sleeps — from late-night study sessions to weekend adventures.</p>
              </div>
            </div>

            <div className="snapshot-item reverse">
              <div className="snapshot-image">
                {/* Add photo here */}
                <div className="photo-placeholder">Photo 2</div>
              </div>
              <div className="snapshot-text">
                <h3>Building & Creating</h3>
                <p>Whether it's a hackathon project or a personal side quest, I love bringing ideas to life through code.</p>
              </div>
            </div>

            <div className="snapshot-item">
              <div className="snapshot-image">
                {/* Add photo here */}
                <div className="photo-placeholder">Photo 3</div>
              </div>
              <div className="snapshot-text">
                <h3>Good Food & Good Company</h3>
                <p>Trying new cuisines and sharing meals with friends is one of my favorite ways to unwind.</p>
              </div>
            </div>

            <div className="snapshot-item reverse">
              <div className="snapshot-image">
                <div className="photo-placeholder">Photo 4</div>
              </div>
              <div className="snapshot-text snapshot-spotify">
              <h3>What I've Been Listening To</h3>
              <p>Trying new cuisines and sharing meals with friends is one of my favorite ways to unwind.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="quote-section">
          <RandomQuote />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;