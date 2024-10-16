import './Homepage.css';

import HomepageHero from '../Components/HomepageHero';
import Specials from '../Components/Specials';
import Testimonials from '../Components/Testimonials';
import AboutUs from '../Components/AboutUs';

export default function Homepage() {
    return (
        <>
          <HomepageHero/>
          <main className='HomepageMain'>
            <Specials/>
            <Testimonials/>
            <AboutUs/>
          </main>
        </>
    );
}