import './Footer.css';

import logo from "../Assets/Logo.svg";

import { Link } from 'react-router-dom';

export default function Footer() {
    return <footer className='PageFooter'>
        <Link to="/" aria-label='Little Lemon homepage'><img src={logo} aria-hidden/></Link>
        <section>
            <h3 className='SectionTitle'>NAVIGATION</h3>
            <menu>
                <li><a href="#" className='ParagraphText'>Home</a></li>
                <li><a href="#" className='ParagraphText'>About</a></li>
                <li><a href="#" className='ParagraphText'>Menu</a></li>
                <li><a href="#" className='ParagraphText'>Reservations</a></li>
                <li><a href="#" className='ParagraphText'>Order Online</a></li>
                <li><a href="#" className='ParagraphText'>Login</a></li>
            </menu>
        </section>
        <section>
            <h3 className='SectionTitle'>CONTACT</h3>
            <menu>
                <li className='ParagraphText'>456 Market St.<br/>Chicago, IL 60613</li>
                <li><a href="#" className='ParagraphText'>(872) 555-0100</a></li>
                <li><a href="#" className='ParagraphText'>littlelemon@example.com</a></li>
            </menu>
        </section>
        <section>
            <h3 className='SectionTitle'>SOCIALS</h3>
            <menu>
                <li><a href="#" className='ParagraphText'>Facebook</a></li>
                <li><a href="#" className='ParagraphText'>Twitter</a></li>
                <li><a href="#" className='ParagraphText'>Instagram</a></li>
            </menu>
        </section>
    </footer>
}