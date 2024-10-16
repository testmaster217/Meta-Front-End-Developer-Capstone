import "./Specials.css";

import greekSalad from "../Assets/greek salad.jpg";
import bruschetta from "../Assets/bruchetta.svg";
import lemonDessert from "../Assets/lemon dessert.jpg";

import SpecialCard from "./SpecialCard";

export default function Specials() {
    return <section className="Specials">
        <h3 className="DisplayTitle">This Week's Specials!</h3>
        <button type="button" className="MainButton LeadText">Online menu</button>
        {/* All data and images will (in the real world) have to come from an API. */}
        <SpecialCard
            photoPath={greekSalad}
            photoAlt="Little Lemon's Greek salad."
            name="Greek Salad"
            price="12.99"
            description="The famous Greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons."
        />
        <SpecialCard
            photoPath={bruschetta}
            photoAlt="Little Lemon's bruschetta"
            name="Bruschetta"
            price="5.99"
            description="Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil."
        />
        <SpecialCard
            photoPath={lemonDessert}
            photoAlt="Little Lemon's lemon dessert"
            name="Lemon Dessert"
            price="5.00"
            description="This comes straight from grandma's recipe book, every last ingredient has been sourced and is as authentic as can be imagined."
        />
    </section>
}