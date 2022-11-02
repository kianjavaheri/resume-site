import React from 'react'
import pythonlogo from '../../svgs/pythonlogo.svg'
import javalogo from '../../svgs/javalogo.svg'
import javascriptlogo from '../../svgs/javascriptlogo.svg'
import reactlogo from '../../svgs/reactlogo.svg'
import './css/Proficiency.css'


function Proficiency() {
  return (
    <div>
        <h1 className="proficiency-header">Language Proficiency</h1>
        <section className="proficiency-container">

          <ProficiencyCard icon={pythonlogo} lang="python" desc="Python is by far my favorite language. I love the simplicity of the language as it allows me to focus on other things. I also find Python's expansive library to be very useful and convenient."/>

          <ProficiencyCard icon={javalogo} lang="java" desc="Java would definitely be my second most proficient language. I have gotten really used to it over the years. Java is my go-to for performance-based programming."/>

          <ProficiencyCard icon={javascriptlogo} lang="javascript" desc="Javascript is definitely a language that I both enjoy using and want to learn more about. As of now, I only use Javascript for front-end."/>

          <ProficiencyCard icon={reactlogo} lang="react" desc="My overall react skills are fairly proficient. I would say I know how to get around the interface and implement certain features."/>

        </section>
    </div>
  )
}

function ProficiencyCard(props:any) {

  return (
      <div className="proficiency-card">
          <div className="card-title">
              <img src={props.icon} className="lang-logo" alt={props.lang + " logo"}></img>
          </div>
          <div className="lang-container">
              <div className={"skills " + props.lang}></div>
          </div>
          <p>{props.desc}</p>
      </div>
)
}

export default Proficiency;
