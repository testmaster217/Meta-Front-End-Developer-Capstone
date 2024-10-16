import "./Testimonials.css";

import TestimonialCard from "./TestimonialCard";

export default function Testimonials() {
    return <section className="Testimonials">
        <h3 className="DisplayTitle">Testimonials</h3>
        {/* Replace all profilePhotos with the actual paths to the images. */}
        {/* All data will (in the real world) have to come from an API. */}
        <TestimonialCard
            starRating="⭐⭐⭐⭐⭐"
            profilePhoto=""
            profilePhotoAlt=""
            profileName="Dan"
            reviewText="Best food ever!"
        />
        <TestimonialCard
            starRating="⭐⭐⭐⭐"
            profilePhoto=""
            profilePhotoAlt=""
            profileName="Ally"
            reviewText="Adrian and Mario are so friendly."
        />
        <TestimonialCard
            starRating="⭐⭐⭐⭐⭐"
            profilePhoto=""
            profilePhotoAlt=""
            profileName="Bob"
            reviewText="Adrian and Mario are amazing chefs."
        />
        <TestimonialCard
            starRating="⭐⭐⭐⭐⭐"
            profilePhoto=""
            profilePhotoAlt=""
            profileName="Leah"
            reviewText="10/10 would eat here again!"
        />
    </section>
}