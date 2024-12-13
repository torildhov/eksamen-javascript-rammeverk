// Dokumentation: https://www.npmjs.com/package/@lottiefiles/dotlottie-react
// Vet vi ikke blir belønnet for design, men viser at jeg kan finne frem til og bruke forskjellige
// npm biblioteker. Dessuten syntes jeg det bidrar til helheten av prosjektet.
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

// Komponent for å vise hero-animasjon på siden
export function HeroAnimation() {
  return (
    <div className="w-full h-full">
      {/* Lottie-animasjon med automatisk avspilling og loop */}
      <DotLottieReact
        src="https://lottie.host/5b5928cb-8aaf-46b4-ae91-286b85a618bf/l6KrGGDw5d.lottie"
        loop
        autoplay
        style={{ 
            marginTop: '-70px',   
        }}
      />
    </div>
  )
}
