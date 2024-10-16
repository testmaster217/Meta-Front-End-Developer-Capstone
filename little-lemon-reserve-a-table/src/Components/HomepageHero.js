import './HomepageHero.css';

import food from "../Assets/restauranfood.jpg";

import { useNavigate } from 'react-router-dom';

import { useHeaderContext } from './HeaderProvider';

export default function HomepageHero() {
    const {headerSkipTarget} = useHeaderContext();
    const navigate = useNavigate();

    return <header className="HomepageHero" ref={headerSkipTarget} tabIndex="-1">
        <div>
            <h1 className='DisplayTitle'>Little Lemon</h1>
            <h2 className='Subtitle'>Chicago</h2>
            <p className='ParagraphText'>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</p>
            <button type="button" className='MainButton LeadText' onClick={() => navigate("/reserve-a-table")}>Reserve a table</button>
        </div>
        <img src={food} aria-hidden/>
    </header>;
}