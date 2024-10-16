import "./AboutUs.css";

import marioAndAdrianA from "../Assets/Mario and Adrian A.jpg";
import marioAndAdrianB from "../Assets/Mario and Adrian b.jpg";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function AboutUs() {
    let location = useLocation();
    const aboutSection = useRef(null);

    useEffect(() => {
        if (location.hash.match(/#about-us$/)) {
            aboutSection.current.focus();
        }
    }, [location]);

    return <section className="AboutUs" id="about-us">
        <div className="AboutWords">
            <h3 className="DisplayTitle" ref={aboutSection} tabIndex="-1">About Us</h3>
            <h4 className="Subtitle">Our Story</h4>
            <p className="ParagraphText">
                Based in Chicago, Illinois, Little Lemon is a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist. The chefs draw inspiration from Italian, Greek, and Turkish culture and have a menu of 12-15 items that they rotate seasonally. The restaurant has a rustic and relaxed atmosphere with moderate prices, making it a popular place for a meal any time of the day.
            </p>
            <p className="ParagraphText">
                Little Lemon is owned by two Italian brothers, Mario and Adrian, who moved to the United States to pursue their shared dream of owning a restaurant. To craft the menu, Mario relies on family recipes and his experience as a chef in Italy. Adrian does all the marketing for the restaurant and led the effort to expand the menu beyond classic Italian to incorporate additional cuisines from the Mediterranean region.
            </p>
        </div>
        <div className="AboutImages">
            <img className="Img1" src={marioAndAdrianA} aria-hidden/>
            <img className="Img2" src={marioAndAdrianB} aria-hidden/>
        </div>
    </section>
}