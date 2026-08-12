function HeroBottom() {
  return (
    <div>
      <div className="w-full h-[120px] object-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="object-cover h-[180px] w-screen rounded-4xl"
        >
          <source src="https://otaku-hub-backend-production.up.railway.app/api/video/msqc43ulumz20khh" />
        </video>
      </div>
    </div>
  )
}

export default HeroBottom
