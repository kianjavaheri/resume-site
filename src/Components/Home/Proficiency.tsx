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
              <p>I would consider python 3 to be my most proficient language. I use python for pretty much every back-end job (except front-end logic). My strength definitely resides in data structures and algorithms, and python makes that very simple.</p>
            </div>

            <div className="proficiency-card">
              <div className="card-title">
                  {/* <h3>Java</h3> */}
                  <img src={javalogo} className="lang-logo" alt="java-logo"></img>
              </div>
              <div className="lang-container">
                  <div className="skills java"></div>
              </div>
              <p>Java would definitely be my second most proficient language. Not a big fan of the syntax, but I have gotten used to it over the years. I use java mostly for game and application creation.</p>
            </div>

            <div className="proficiency-card">
              <div className="card-title">
                  {/* <h3>Javascript</h3> */}
                  <img src={javascriptlogo} className="lang-logo" alt="javascript-logo"></img>
              </div>
              <div className="lang-container">
                  <div className="skills javascript"></div>
              </div>
              <p>My javascript knowledge pretty much ends at the required proficiency for react. I would like to know more javascript, but it seems that I'm typically doing back-end work most of the time, and python is my go-to for that.</p>
            </div>

            <div className="proficiency-card">
              <div className="card-title">
                  {/* <h3>React</h3> */}
                  <img src={reactlogo} className="lang-logo" alt="react-logo"></img>
              </div>
              <div className="lang-container">
                  <div className="skills react"></div>
              </div>
              <p>My overall react skills are fairly proficient. I know how to get around the interface and implement components, but my large-scale production needs some work. Although, I can see myself improving in the things I lack in react.</p>
            </div>
        </section>
    </div>
  )
}

export default Proficiency;
