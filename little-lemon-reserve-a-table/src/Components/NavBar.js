import './NavBar.css';

import logo from "../Assets/Logo.svg";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

import { Link } from 'react-router-dom';
import { useState } from 'react';

import { useHeaderContext } from './HeaderProvider';

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const {headerSkipTarget} = useHeaderContext();

    return <nav>
        <button className='MainButton' id='skipBtn' onClick={() => headerSkipTarget.current.focus()}>Skip to banner</button>
        <div className='Icons'>
            <Link to="/" aria-label='Little Lemon homepage'><img src={logo} aria-hidden/></Link>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)}>
                <span className='ParagraphText'>MENU</span>
                <FontAwesomeIcon icon={faBars}/>
            </button>
        </div>
        <menu className='DesktopMenu'>
            <li><Link to="/" className='ParagraphText'>HOME</Link></li>
            <li><Link to="/#about-us" className='ParagraphText'>ABOUT</Link></li>
            <li><Link to="/" className='ParagraphText'>MENU</Link></li>
            <li><Link to="/reserve-a-table" className='ParagraphText'>RESERVATIONS</Link></li>
            <li><Link to="/" className='ParagraphText'>ORDER ONLINE</Link></li>
            <li><Link to="/" className='ParagraphText'>LOGIN</Link></li>
        </menu>
        {menuOpen && <menu>
            <li><Link to="/" className='ParagraphText' onClick={() => setMenuOpen(!menuOpen)}>HOME</Link></li>
            <li><Link to="/#about-us" className='ParagraphText' onClick={() => setMenuOpen(!menuOpen)}>ABOUT</Link></li>
            <li><Link to="/" className='ParagraphText' onClick={() => setMenuOpen(!menuOpen)}>MENU</Link></li>
            <li><Link to="/reserve-a-table" className='ParagraphText' onClick={() => setMenuOpen(!menuOpen)}>RESERVATIONS</Link></li>
            <li><Link to="/" className='ParagraphText' onClick={() => setMenuOpen(!menuOpen)}>ORDER ONLINE</Link></li>
            <li><Link to="/" className='ParagraphText' onClick={() => setMenuOpen(!menuOpen)}>LOGIN</Link></li>
        </menu>}
    </nav>;
}