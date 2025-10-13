import React from "react";
import "../assets/styles/About.scss"; 

const About: React.FC = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2>About Me</h2>
        <p>
          I’m a passionate <strong>Full Stack Engineer</strong> who loves building
          intuitive, performant web applications and exploring new technologies.
          My work focuses on clean design, scalable architecture, and meaningful
          user experiences.
        </p>
        <p>
          Outside of coding, I enjoy creative projects, problem-solving, and
          learning how emerging tools like AI can shape the future of software
          development.
        </p>
      </div>
    </section>
  );
};

export default About;
