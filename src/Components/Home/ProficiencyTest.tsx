import React from 'react'
import pythonlogo from '../../svgs/pythonlogo.svg'
import javalogo from '../../svgs/javalogo.svg'
import javascriptlogo from '../../svgs/javascriptlogo.svg'
import reactlogo from '../../svgs/reactlogo.svg'
import cplogo from '../../svgs/cplogo.svg'
import gologo from '../../svgs/gologo.svg'
import cslogo from '../../svgs/cslogo.svg'
import sqllogo from '../../svgs/sqllogo.svg'


function ProficiencyTest() {
  return (
    <div>
        <section className="proficiencytest-container">
            <div className="proficiencytest-main">
                <div>
                    
                </div>
                <h3>Python</h3>
                <div className="lang-container">
                  <div className="skills python"></div>
                </div>
                <img src={pythonlogo} className="lang-logo" alt="python-logo"></img>
                <p>I would consider python 3 to be my most proficient language. I use python for pretty much every back-end job (except front-end logic). My strength definitely resides in data structures and algorithms, and python makes that very simple.</p>
            </div>
        </section>
    </div>
  )
}

export default ProficiencyTest