import "./SpecialCard.css"
import deliveryCycle from "../Assets/Cycling.svg";

export default function SpecialCard({photoPath, photoAlt, name, price, description}) {
    return <article className="Special Card">
        <img src={photoPath} alt={photoAlt}/>
        <header>
            <h4 className="CardTitle">{name}</h4>
            <span className="HighlightText">{`$${price}`}</span>
        </header>
        <main>
            <p className="ParagraphText">{description}</p>
        </main>
        <footer className="SectionCategory">
            Order for delivery
            <img src={deliveryCycle} alt=""/>
            {/* I got the icon by exporting it from the Figma design as I had no idea where it came from. */}
        </footer>
    </article>
}