import { useEffect, useRef, useState } from 'react'

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomUnique(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, arr.length))
}

export default function AnimeBaraban() {
  const [animes, setAnimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [slots, setSlots] = useState(Array(5).fill(null))
  const [mainAnime, setMainAnime] = useState(null)
  const [spinning, setSpinning] = useState([false, false, false, false, false])
  const [winnerIdx, setWinnerIdx] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const intervalsRef = useRef([])

  useEffect(() => {
    fetch('http://localhost:3000/animes')
      .then((res) => {
        if (!res.ok) throw new Error("Serverdan ma'lumot olinmadi")
        return res.json()
      })
      .then((data) => {
        setAnimes(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleSpin = () => {
    if (isSpinning || animes.length === 0) return

    setIsSpinning(true)
    setWinnerIdx(null)
    setMainAnime(null)
    setSpinning([true, true, true, true, true])

    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current = []

    const finalAnimes = getRandomUnique(animes, 5)
    const durations = [1600, 2100, 2600, 3100, 3700] // har biri keyinroq to'xtaydi

    finalAnimes.forEach((_, idx) => {
      const interval = setInterval(() => {
        setSlots((prev) => {
          const next = [...prev]
          next[idx] = getRandom(animes)
          return next
        })
      }, 60)

      intervalsRef.current[idx] = interval

      setTimeout(() => {
        clearInterval(interval)
        setSlots((prev) => {
          const next = [...prev]
          next[idx] = finalAnimes[idx]
          return next
        })
        setSpinning((prev) => {
          const next = [...prev]
          next[idx] = false
          return next
        })

        if (idx === 4) {
          const wIdx = Math.floor(Math.random() * finalAnimes.length)
          setWinnerIdx(wIdx)
          setMainAnime(finalAnimes[wIdx])
          setIsSpinning(false)
        }
      }, durations[idx])
    })
  }

  if (loading) {
    return (
      <div>
        <div className="text-white text-xl font-medium animate-pulse">Yuklanmoqda...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 gap-3 text-center px-4">
        <p className="text-red-300 text-lg">Xato: {error}</p>
        <p className="text-white/70 text-sm">
          json-server ishlayaptimi?
          <br />
          <code className="bg-white/10 px-2 py-1 rounded mt-2 inline-block">
            npx json-server --watch db.json --port 3000
          </code>
        </p>
      </div>
    )
  }

  return (
    <div className="flex  flex-col justify-center items-center gap-[30px]">
      <div className="w-full max-w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl flex gap-6">
        <div className="w-56 h-[300px] rounded-2xl overflow-hidden border border-white/30 shadow-lg flex items-center justify-center shrink-0">
          {mainAnime ? (
            <img
              src={mainAnime.image}
              alt={mainAnime.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl text-white/40">?</span>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* 4 ta kichik glass katak */}
          <div className="grid grid-cols-4 gap-3">
            <div className="h-[160px] rounded-xl backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white font-medium text-[24px]  shadow-inner">
              {mainAnime ? mainAnime.genre?.[0] || '—' : '—'}
            </div>
            <div className="h-[160px] rounded-xl backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 font-semibold text-[24px] shadow-inner">
              {mainAnime ? `★ ${mainAnime.rating}` : '—'}
            </div>
            <div className="h-[160px] rounded-xl backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white font-medium text-[24px] shadow-inner">
              {mainAnime ? `${mainAnime.episodes} ep` : '—'}
            </div>
            <div className="h-[160px] rounded-xl backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white font-medium text-[24px] shadow-inner">
              {mainAnime ? mainAnime.year : '—'}
            </div>
          </div>

          {/* Title bar */}
          <div className="h-full rounded-xl backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center px-4 shadow-inner">
            <span className="text-white text-[40px] font-semibold truncate">
              {mainAnime ? mainAnime.title : 'Random Anime Title'}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-[340px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-5 shadow-2xl flex gap-4">
        {slots.map((anime, i) => (
          <div
            key={i}
            className={`
              relative flex-1 h-full rounded-2xl overflow-hidden border transition-all duration-300
              ${
                spinning[i]
                  ? 'border-white/40 bg-black/30 animate-pulse'
                  : 'border-white/20 bg-black/20'
              }
              ${
                winnerIdx === i
                  ? 'ring-4 ring-amber-400/70 border-amber-300 scale-105 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                  : ''
              }
            `}
          >
            {spinning[i] && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-[spinBlur_0.4s_linear_infinite] pointer-events-none z-10 " />
            )}

            {anime ? (
              <div
                className={`h-full h-[240px] flex flex-col ${spinning[i] ? 'animate-[slotSpin_0.15s_linear_infinite]' : ''}`}
              >
                <img src={anime.image} alt={anime.title} className="w-full h-[80%] object-cover" />
                <div className="flex-1 flex items-center justify-center px-2 bg-black/40 backdrop-blur-sm">
                  <span className="text-white text-[20px] font-bold text-center leading-tight line-clamp-2">
                    {anime.title}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-4xl text-white/30">?</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`
          relative w-full px-12 py-4 rounded-2xl font-semibold text-lg tracking-wide
          backdrop-blur-md border transition-all duration-300
          ${
            isSpinning
              ? 'bg-white/10 border-white/20 text-white/50 cursor-not-allowed'
              : 'bg-white/20 border-white/40 text-white hover:bg-white/30 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isSpinning ? 'Loading...' : 'Random'}
      </button>

      {/* Custom keyframes */}
      <style>{`
        @keyframes slotSpin {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
        @keyframes spinBlur {
          0% { opacity: 0.3; transform: translateY(-100%); }
          100% { opacity: 0.1; transform: translateY(100%); }
        }
      `}</style>
    </div>
  )
}
