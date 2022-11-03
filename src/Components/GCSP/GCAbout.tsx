import React from 'react'
import './css/GCAbout.css'

function GCAbout() {

  return (
    <div>
        <h1 className="gcabout-header">About Me</h1>
        <section className="gcabout-container">
            <p>
                Hello everyone! I'm Kian Javaheri and I'm a first-year computer science major at Arizona State University. Growing up near Silicon Valley in California, I have been heavily influenced to take an interest in software and computers. Combined with the fact that I already love computers (and video games), the choice to pursue computer science was easy.  This portfolio is intended to showcase my projects and efforts throughout my time with the GCSP. Throughout high school, I have taken a keen interest in coding and have developed proficiency in languages such as Python, Java, Javascript, and web frameworks such as ReactJS and a little bit of Angular. I love solving problems, especially relating to coding, so it is no wonder why I'm such a fan of Leetcode (a website to practice coding skills). Anyways, throughout GCSP, I intend to focus on the Joy of Living aspect, as I quite often find life a little boring and want to make the most of my time here. I look forward to my next few years at ASU and GCSP!
            </p>
            <img src={require("../../images/headshot.png")} alt="headshot"></img>
        </section>
        <hr className="divider"/>
    </div>
  )
}

export default GCAbout