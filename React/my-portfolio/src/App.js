import React from "react";
import "./App.css";

function App() {

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      <header className="header">
        <h1>My Portfolio</h1>
        <nav>
          <ul className="menu">
            <li><a href="#about">About Me</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className="content">
        <section id="about" className="section">
          <h2>ABOUT ME</h2>
          <p>
            안녕하세요, 저는 JAVA 개발자 [이름]입니다.  
            대학교 1학년 때 "Hello World!"를 출력하며 개발자의 꿈을 꾸게 되었습니다.  
            주어진 문제를 논리적으로 해결하고 효율적으로 구현하는 것에 보람을 느낍니다.  
            "Clean Code"와 같은 코드를 지향하며 개발에 임하고 있습니다.
          </p>
        </section>

        <section id="education" className="section">
          <h2>EDUCATION</h2>
          <ul>
            <li>
              <h3>2020.03 - 2024.02</h3>
              <p>컴퓨터공학과</p>
              <p>학부에서 소프트웨어 공학 전공</p>
            </li>
            <li>
              <h3>2024.02</h3>
              <p>JAVA 개발자 과정</p>
              <p>교육 과정에서 데이터베이스와 Spring Boot 학습</p>
            </li>
          </ul>
        </section>

        <section id="skills" className="section">
          <h2>SKILLS</h2>          
          <div className="skills-container">
            <div>
              <h3>Backend</h3>
              <ul>
                <li>Java, Spring Boot</li>
                <li>MyBatis, MySQL, Redis</li>
                <li>Postman</li>
              </ul>
            </div>
            <div>
              <h3>DevOps</h3>
              <ul>
                <li>AWS EC2, RDS</li>
                <li>Tomcat</li>
              </ul>
            </div>
            <div>
              <h3>Frontend</h3>
              <ul>
                <li>HTML, CSS, JavaScript</li>
                <li>React</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <h2>PROJECTS</h2>
          <ul>
            <li>
              <h3>프로젝트 1</h3>
              <p>프로젝트 설명 요약</p>
            </li>
            <li>
              <h3>프로젝트 2</h3>
              <p>프로젝트 설명 요약</p>
            </li>
          </ul>
        </section>

        <section id="contact" className="section">
          <h2>CONTACT</h2>
          <p>Email: <a href="mailto:example@example.com">example@example.com</a></p>
          <p>GitHub: <a href="https://github.com/yourgithub" target="_blank" rel="noopener noreferrer">yourgithub</a></p>
        </section>
      </main>
      {/* Scroll-to-top button */}
      <button className="scroll-to-top" onClick={scrollToTop}>
        ↑
      </button>
    </div>
  );
}

export default App;
