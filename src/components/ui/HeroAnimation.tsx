import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export function HeroAnimation() {
  return (
    <div className="w-full h-full">
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
