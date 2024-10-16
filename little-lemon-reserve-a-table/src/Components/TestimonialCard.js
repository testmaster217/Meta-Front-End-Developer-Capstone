import "./TestimonialCard.css";

export default function TestimonialCard({starRating, profilePhoto, profilePhotoAlt, profileName, reviewText}) {
    return <article className="Review Card">
        <span className="SrOnly">{starRating.length + " stars"}</span>
        <h4 className="CardTitle" aria-hidden="true">{starRating}</h4>
        <section>
            <img src={profilePhoto} alt={profilePhotoAlt}/>
            <span className="ParagraphText">{profileName}</span>
        </section>
        <p className="ParagraphText">{reviewText}</p>
    </article>
}