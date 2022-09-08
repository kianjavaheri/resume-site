import React from 'react'
import pythonlogo from '../../svgs/pythonlogo.svg'
import javalogo from '../../svgs/javalogo.svg'
import javascriptlogo from '../../svgs/javascriptlogo.svg'
import reactlogo from '../../svgs/reactlogo.svg'
import cplogo from '../../svgs/cplogo.svg'
import gologo from '../../svgs/gologo.svg'
import cslogo from '../../svgs/cslogo.svg'
import sqllogo from '../../svgs/sqllogo.svg'


function Proficiency() {
  return (
    <div>
        <h1 className="proficiency-header">Language Proficiency</h1>
        <section className="proficiency-container">

            <div className="proficiency-card">
              <div className="card-title">
                  {/* <h3>Python 3</h3> */}
                  <img src={pythonlogo} className="lang-logo" alt="python-logo"></img>
              </div>
              <div className="lang-container">
                  <div className="skills python"></div>
              </div>
              <p>Python is by far my favorite language. I love the simplicity of the language as it allows me to focus on other things. I also find Python's expansive library to be very useful and convenient.</p>
            </div>

            <div className="proficiency-card">
              <div className="card-title">
                  {/* <h3>Java</h3> */}
                  <img src={javalogo} className="lang-logo" alt="java-logo"></img>
              </div>
              <div className="lang-container">
                  <div className="skills java"></div>
              </div>
              <p>Java would definitely be my second most proficient language. I have gotten really used to it over the years. Java is my go-to for performance-based programming.</p>
            </div>

            <div className="proficiency-card">
              <div className="card-title">
                  {/* <h3>Javascript</h3> */}
                  <img src={javascriptlogo} className="lang-logo" alt="javascript-logo"></img>
              </div>
              <div className="lang-container">
                  <div className="skills javascript"></div>
              </div>
              <p>Javascript is definitely a language that I both enjoy using and want to learn more about. As of now, I only use Javascript for front-end.</p>
            </div>

            <div className="proficiency-card">
              <div className="card-title">
                  {/* <h3>React</h3> */}
                  <img src={reactlogo} className="lang-logo" alt="react-logo"></img>
              </div>
              <div className="lang-container">
                  <div className="skills react"></div>
              </div>
              <p>My overall react skills are fairly proficient. I would say I know how to get around the interface and implement certain features.</p>
            </div>
        </section>
    </div>
  )
}

export default Proficiency;
