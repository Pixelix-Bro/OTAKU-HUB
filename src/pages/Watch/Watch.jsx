import {
  CalendarRange,
  CircleChevronLeft,
  Image as ImageIcon,
  Maximize,
  Minimize,
  Music2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  Volume2,
  VolumeX,
  X,
  LoaderCircle,
  Wifi,
  WifiOff,
} from 'lucide-react'

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../hooks/axios'

function Watch() {
  const nav = useNavigate()
  const { id } = useParams()

  const videoRef = useRef(null)
  const audioRef = useRef(null)

  const [data, setData] = useState(null)

  // ======================================================
  // VIDEO
  // ======================================================

  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedScene, setSelectedScene] = useState(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const [bufferedPercent, setBufferedPercent] = useState(0)

  // MUHIM
  const [isBuffering, setIsBuffering] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [connectionLost, setConnectionLost] = useState(false)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const [volume, setVolume] = useState(1)
  const [quality, setQuality] = useState('Auto')

  // ======================================================
  // MUSIC
  // ======================================================

  const [selectedMusic, setSelectedMusic] = useState(null)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [musicProgress, setMusicProgress] = useState(0)
  const [musicDuration, setMusicDuration] = useState(0)
  const [musicCurrentTime, setMusicCurrentTime] = useState(0)

  // ======================================================
  // API
  // ======================================================

  async function getApi() {
    try {
      const { data: response } = await api.get(`/animes/${id}`)

      console.log('ANIME API:', response)

      setData(response)
    } catch (error) {
      console.log('API ERROR:', error.message)
    }
  }

  useEffect(() => {
    getApi()
  }, [id])

  // ======================================================
  // VIDEO BUFFER
  // ======================================================

  function updateBuffered() {
    const video = videoRef.current

    if (!video) return

    try {
      if (!video.duration || !Number.isFinite(video.duration)) {
        return
      }

      const buffered = video.buffered

      if (!buffered || buffered.length === 0) {
        setBufferedPercent(0)
        return
      }

      let currentBufferedEnd = 0

      for (let i = 0; i < buffered.length; i++) {
        const start = buffered.start(i)
        const end = buffered.end(i)

        if (
          video.currentTime >= start &&
          video.currentTime <= end
        ) {
          currentBufferedEnd = end
          break
        }
      }

      if (!currentBufferedEnd) {
        currentBufferedEnd = buffered.end(buffered.length - 1)
      }

      const percent =
        (currentBufferedEnd / video.duration) * 100

      setBufferedPercent(
        Math.min(Math.max(percent, 0), 100)
      )
    } catch (error) {
      console.log('BUFFER ERROR:', error)
    }
  }

  // ======================================================
  // VIDEO EVENTS
  // ======================================================

  function handleWaiting() {
    console.log('⏳ VIDEO BUFFERING...')

    setIsBuffering(true)
  }

  function handleStalled() {
    console.log('⚠️ VIDEO STALLED')

    setIsBuffering(true)
    setConnectionLost(true)
  }

  function handleCanPlay() {
    console.log('✅ VIDEO CAN PLAY')

    setIsBuffering(false)
    setConnectionLost(false)
    setVideoError(false)
  }

  function handlePlaying() {
    console.log('▶️ VIDEO PLAYING')

    setIsBuffering(false)
    setConnectionLost(false)
    setVideoError(false)

    setIsPlaying(true)
  }

  function handleLoadStart() {
    console.log('📡 VIDEO LOAD START')

    setIsBuffering(true)
    setVideoError(false)
    setConnectionLost(false)
  }

  function handleProgress() {
    updateBuffered()
  }

  function handlePlay() {
    setIsPlaying(true)
    setIsBuffering(false)
  }

  function handlePause() {
    setIsPlaying(false)
  }

  function handleError(event) {
    console.error(
      '❌ VIDEO ERROR:',
      event?.currentTarget?.error
    )

    setIsBuffering(false)
    setVideoError(true)
  }

  function handleTimeUpdate() {
    const video = videoRef.current

    if (!video) return

    const current = video.currentTime
    const total = video.duration || 0

    setCurrentTime(current)
    setDuration(total)

    setProgress(
      total
        ? (current / total) * 100
        : 0
    )

    updateBuffered()
  }

  function handleLoadedMetadata() {
    const video = videoRef.current

    if (!video) return

    const total = video.duration || 0

    setDuration(total)

    updateBuffered()
  }

  // ======================================================
  // PLAY
  // ======================================================

  function togglePlay() {
    const video = videoRef.current

    if (!video) return

    if (video.paused) {
      setIsBuffering(true)

      video.play().catch((error) => {
        console.log('PLAY ERROR:', error)

        setIsBuffering(false)
      })
    } else {
      video.pause()
    }
  }

  // ======================================================
  // PROGRESS
  // ======================================================

  function changeProgress(e) {
    const video = videoRef.current

    if (!video) return

    const value = Number(e.target.value)

    const total = video.duration || 0

    const newTime =
      (value / 100) * total

    video.currentTime = newTime

    setProgress(value)
    setCurrentTime(newTime)

    updateBuffered()
  }

  // ======================================================
  // SKIP
  // ======================================================

  function skip(seconds) {
    const video = videoRef.current

    if (!video) return

    video.currentTime += seconds

    updateBuffered()
  }

  // ======================================================
  // MUTE
  // ======================================================

  function toggleMute() {
    const video = videoRef.current

    if (!video) return

    video.muted = !video.muted

    setIsMuted(video.muted)
  }

  // ======================================================
  // VOLUME
  // ======================================================

  function changeVolume(e) {
    const video = videoRef.current

    if (!video) return

    const value = Number(e.target.value)

    video.volume = value

    setVolume(value)

    if (value === 0) {
      video.muted = true
      setIsMuted(true)
    } else {
      video.muted = false
      setIsMuted(false)
    }
  }

  // ======================================================
  // FULLSCREEN
  // ======================================================

  async function toggleFullscreen() {
    const player =
      document.getElementById('anime-player')

    if (!player) return

    try {
      if (!document.fullscreenElement) {
        await player.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.log('FULLSCREEN ERROR:', error)
    }
  }

  useEffect(() => {
    function fullscreenChange() {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      )
    }

    document.addEventListener(
      'fullscreenchange',
      fullscreenChange
    )

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        fullscreenChange
      )
    }
  }, [])

  // ======================================================
  // FORMAT TIME
  // ======================================================

  function formatTime(time) {
    if (
      !time ||
      Number.isNaN(time) ||
      !Number.isFinite(time)
    ) {
      return '00:00'
    }

    const hours = Math.floor(time / 3600)

    const minutes = Math.floor(
      (time % 3600) / 60
    )

    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(
        minutes
      ).padStart(2, '0')}:${String(seconds).padStart(
        2,
        '0'
      )}`
    }

    return `${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`
  }

  // ======================================================
  // OPEN VIDEO
  // ======================================================

  function openVideo(video) {
    console.log('🎬 OPEN VIDEO:', video)

    if (!video?.video) {
      console.error(
        '❌ VIDEO URL TOPILMADI:',
        video
      )

      return
    }

    setSelectedVideo(video)
    setSelectedScene(null)

    setProgress(0)
    setBufferedPercent(0)
    setCurrentTime(0)
    setDuration(0)

    setIsPlaying(false)
    setIsBuffering(true)
    setVideoError(false)
    setConnectionLost(false)

    setTimeout(() => {
      const player = videoRef.current

      if (!player) return

      player.load()

      player
        .play()
        .then(() => {
          setIsPlaying(true)
          setIsBuffering(false)
        })
        .catch((error) => {
          console.log(
            'AUTOPLAY BLOCKED:',
            error
          )

          setIsBuffering(false)
        })
    }, 200)
  }

  // ======================================================
  // CLOSE VIDEO
  // ======================================================

  function closeVideo() {
    const video = videoRef.current

    if (video) {
      video.pause()
      video.removeAttribute('src')
      video.load()
    }

    setSelectedVideo(null)
    setSelectedScene(null)

    setIsPlaying(false)
    setIsBuffering(false)

    setProgress(0)
    setBufferedPercent(0)
    setCurrentTime(0)
    setDuration(0)
  }

  // ======================================================
  // SCENE
  // ======================================================

  function selectScene(scene) {
    setSelectedScene(scene)

    const video = videoRef.current

    if (!video) return

    if (typeof scene.time === 'number') {
      video.currentTime = scene.time
    }

    video.play().catch(() => {})
  }

  // ======================================================
  // MUSIC
  // ======================================================

  function toggleMusic(music) {
    if (selectedMusic?.id !== music.id) {
      setSelectedMusic(music)

      setMusicCurrentTime(0)
      setMusicProgress(0)
      setMusicDuration(0)
      setMusicPlaying(false)

      setTimeout(() => {
        if (!audioRef.current) return

        audioRef.current.currentTime = 0

        audioRef.current
          .play()
          .then(() => {
            setMusicPlaying(true)
          })
          .catch(() => {})
      }, 150)

      return
    }

    if (!audioRef.current) return

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }

  function handleMusicTime() {
    if (!audioRef.current) return

    const current =
      audioRef.current.currentTime

    const total =
      audioRef.current.duration || 0

    setMusicCurrentTime(current)

    setMusicProgress(
      total
        ? (current / total) * 100
        : 0
    )
  }

  function handleMusicMetadata() {
    if (!audioRef.current) return

    setMusicDuration(
      audioRef.current.duration || 0
    )
  }

  function changeMusicProgress(e) {
    if (!audioRef.current) return

    const value = Number(e.target.value)

    const total =
      audioRef.current.duration || 0

    audioRef.current.currentTime =
      (value / 100) * total

    setMusicProgress(value)
  }

  function handleMusicEnded() {
    setMusicPlaying(false)
    setMusicCurrentTime(0)
    setMusicProgress(0)
  }

  // ======================================================
  // DATA
  // ======================================================

  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-[15px]">
          <LoaderCircle
            size={45}
            className="animate-spin text-white"
          />

          <p className="text-white/60 text-[16px]">
            Loading anime...
          </p>
        </div>
      </div>
    )
  }

  const videos = Array.isArray(data.videos)
    ? data.videos
    : []

  const scenes =
    selectedVideo?.scenes ||
    selectedVideo?.images ||
    []

  const musics =
    data.musics ||
    data.music ||
    selectedVideo?.musics ||
    []

  return (
    <div className="flex flex-col gap-[30px] pb-[80px]">

      {/* ==================================================
          BACK
      ================================================== */}

      <div>
        <CircleChevronLeft
          color="white"
          onClick={() => nav(-1)}
          size={42}
          className="
            p-[6px]
            bg-white/6
            backdrop-blur-xl
            border border-white/20
            rounded-xl
            rotate-[-90deg]
            transition-all
            duration-300
            hover:rotate-[-360deg]
            hover:bg-white/10
            cursor-pointer
          "
        />
      </div>

      {/* ==================================================
          PLAYER
      ================================================== */}

      {selectedVideo ? (
        <div className="flex flex-col gap-[20px]">

          <div
            id="anime-player"
            className="
              relative
              w-full
              overflow-hidden
              rounded-[28px]
              bg-black
              border border-white/15
              shadow-2xl
              group
            "
          >

            {/* VIDEO */}

            <video
              ref={videoRef}
              src={selectedVideo.video}
              className="
                w-full
                aspect-video
                object-contain
                bg-black
              "
              preload="auto"
              playsInline
              controls={false}
              onLoadStart={handleLoadStart}
              onLoadedMetadata={handleLoadedMetadata}
              onProgress={handleProgress}
              onTimeUpdate={handleTimeUpdate}
              onWaiting={handleWaiting}
              onStalled={handleStalled}
              onCanPlay={handleCanPlay}
              onPlaying={handlePlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onError={handleError}
              onEnded={() => {
                setIsPlaying(false)
                setIsBuffering(false)
              }}
              onDoubleClick={toggleFullscreen}
            />

            {/* ==================================================
                BUFFER LOADING
            ================================================== */}

            {isBuffering && !videoError && (
              <div
                className="
                  absolute
                  inset-0
                  z-30
                  flex
                  items-center
                  justify-center
                  pointer-events-none
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    items-center
                    gap-[12px]
                  "
                >

                  <div
                    className="
                      w-[75px]
                      h-[75px]
                      rounded-full
                      bg-black/50
                      backdrop-blur-xl
                      border border-white/20
                      flex
                      items-center
                      justify-center
                      shadow-2xl
                    "
                  >
                    <LoaderCircle
                      size={38}
                      className="
                        text-white
                        animate-spin
                      "
                    />
                  </div>

                  <div
                    className="
                      px-[14px]
                      py-[8px]
                      rounded-xl
                      bg-black/60
                      backdrop-blur-xl
                      border border-white/10
                    "
                  >
                    <p className="text-white text-[13px]">
                      Video yuklanmoqda...
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* ==================================================
                CONNECTION LOST
            ================================================== */}

            {connectionLost && !videoError && (
              <div
                className="
                  absolute
                  top-[20px]
                  left-1/2
                  -translate-x-1/2
                  z-40
                  flex
                  items-center
                  gap-[8px]
                  px-[14px]
                  py-[9px]
                  rounded-xl
                  bg-black/70
                  backdrop-blur-xl
                  border border-white/15
                "
              >
                <WifiOff
                  size={16}
                  className="text-white/70"
                />

                <span className="text-white/80 text-[13px]">
                  Video oqimi kutilyapti...
                </span>
              </div>
            )}

            {/* ==================================================
                VIDEO ERROR
            ================================================== */}

            {videoError && (
              <div
                className="
                  absolute
                  inset-0
                  z-40
                  flex
                  items-center
                  justify-center
                  bg-black/70
                  backdrop-blur-sm
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    items-center
                    gap-[15px]
                    text-center
                    p-[30px]
                  "
                >

                  <WifiOff
                    size={45}
                    className="text-white/70"
                  />

                  <p className="text-white text-[18px]">
                    Videoni yuklashda xatolik
                  </p>

                  <button
                    onClick={() => {
                      setVideoError(false)
                      setConnectionLost(false)
                      setIsBuffering(true)

                      const video =
                        videoRef.current

                      if (!video) return

                      video.load()

                      video.play().catch(() => {})
                    }}
                    className="
                      px-[18px]
                      py-[10px]
                      rounded-xl
                      bg-white
                      text-black
                      font-medium
                      hover:bg-white/80
                      transition
                    "
                  >
                    Qayta yuklash
                  </button>

                </div>
              </div>
            )}

            {/* ==================================================
                BUFFER BAR
            ================================================== */}

            <div
              className="
                absolute
                left-[18px]
                right-[18px]
                bottom-[72px]
                h-[3px]
                bg-white/10
                rounded-full
                overflow-hidden
                pointer-events-none
                z-[15]
              "
            >
              <div
                className="
                  h-full
                  bg-white/30
                  rounded-full
                  transition-all
                  duration-300
                "
                style={{
                  width: `${bufferedPercent}%`,
                }}
              />
            </div>

            {/* ==================================================
                GRADIENT
            ================================================== */}

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-[220px]
                pointer-events-none
                bg-gradient-to-t
                from-black
                via-black/60
                to-transparent
              "
            />

            {/* ==================================================
                CENTER PLAY
            ================================================== */}

            {!isPlaying &&
              !isBuffering &&
              !videoError && (
                <button
                  onClick={togglePlay}
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    z-20
                    w-[75px]
                    h-[75px]
                    rounded-full
                    flex
                    items-center
                    justify-center
                    bg-white/10
                    backdrop-blur-xl
                    border border-white/30
                    text-white
                    hover:scale-110
                    hover:bg-white/20
                    transition
                  "
                >
                  <Play
                    fill="white"
                    size={30}
                  />
                </button>
              )}

            {/* ==================================================
                TOP
            ================================================== */}

            <div
              className="
                absolute
                top-0
                left-0
                right-0
                z-20
                p-[20px]
                flex
                justify-between
                items-start
                opacity-0
                group-hover:opacity-100
                transition
              "
            >

              <div>
                <p className="text-white text-[20px] font-semibold">
                  {data.title}
                </p>

                <p className="text-white/50 text-[14px]">
                  {selectedVideo.title}
                </p>
              </div>

              <button
                onClick={closeVideo}
                className="
                  p-[10px]
                  rounded-xl
                  bg-black/50
                  backdrop-blur-xl
                  border border-white/20
                  text-white
                  hover:bg-white/10
                  hover:rotate-90
                  transition
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* ==================================================
                CONTROLS
            ================================================== */}

            <div
              className="
                absolute
                left-0
                right-0
                bottom-0
                z-20
                p-[18px]
              "
            >

              {/* PROGRESS */}

              <div className="relative w-full mb-[15px]">

                {/* BUFFER */}

                <div
                  className="
                    absolute
                    left-0
                    top-1/2
                    -translate-y-1/2
                    h-[4px]
                    bg-white/20
                    rounded-full
                    pointer-events-none
                  "
                  style={{
                    width: `${bufferedPercent}%`,
                  }}
                />

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={changeProgress}
                  className="
                    relative
                    w-full
                    h-[4px]
                    accent-white
                    cursor-pointer
                  "
                />

              </div>

              <div className="flex items-center justify-between">

                {/* LEFT */}

                <div className="flex items-center gap-[8px]">

                  <button
                    onClick={togglePlay}
                    className="player-btn"
                  >
                    {isPlaying ? (
                      <Pause size={19} />
                    ) : (
                      <Play
                        size={19}
                        fill="white"
                      />
                    )}
                  </button>

                  <button
                    onClick={() => skip(-10)}
                    className="player-btn"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <button
                    onClick={() => skip(10)}
                    className="player-btn"
                  >
                    <RotateCw size={18} />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="player-btn"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={19} />
                    ) : (
                      <Volume2 size={19} />
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={changeVolume}
                    className="
                      w-[80px]
                      accent-white
                      cursor-pointer
                    "
                  />

                  <span className="text-white/70 text-[13px] ml-[5px]">
                    {formatTime(currentTime)} /{' '}
                    {formatTime(duration)}
                  </span>

                </div>

                {/* RIGHT */}

                <div className="flex items-center gap-[8px]">

                  {/* BUFFER STATUS */}

                  <div
                    className="
                      hidden
                      sm:flex
                      items-center
                      gap-[6px]
                      px-[9px]
                      py-[6px]
                      rounded-lg
                      bg-white/5
                      border border-white/10
                    "
                  >
                    {isBuffering ? (
                      <>
                        <LoaderCircle
                          size={14}
                          className="animate-spin"
                        />

                        <span className="text-white/50 text-[11px]">
                          Buffering
                        </span>
                      </>
                    ) : (
                      <>
                        <Wifi
                          size={14}
                          className="text-white/50"
                        />

                        <span className="text-white/40 text-[11px]">
                          {Math.round(
                            bufferedPercent
                          )}
                          %
                        </span>
                      </>
                    )}
                  </div>

                  {/* SETTINGS */}

                  <div className="relative">

                    <button
                      onClick={() =>
                        setShowSettings(
                          !showSettings
                        )
                      }
                      className="player-btn"
                    >
                      <Settings size={19} />
                    </button>

                    {showSettings && (
                      <div
                        className="
                          absolute
                          bottom-[50px]
                          right-0
                          w-[160px]
                          p-[8px]
                          rounded-xl
                          bg-black/90
                          backdrop-blur-2xl
                          border border-white/20
                          shadow-2xl
                        "
                      >

                        <p className="text-white/40 text-[12px] px-[10px] py-[6px]">
                          Quality
                        </p>

                        {[
                          'Auto',
                          '1080p',
                          '720p',
                          '480p',
                        ].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setQuality(item)
                              setShowSettings(false)
                            }}
                            className={`
                              w-full
                              text-left
                              px-[10px]
                              py-[8px]
                              rounded-lg
                              text-[14px]
                              transition
                              ${
                                quality === item
                                  ? 'bg-white/15 text-white'
                                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                              }
                            `}
                          >
                            {item}
                          </button>
                        ))}

                      </div>
                    )}

                  </div>

                  {/* FULLSCREEN */}

                  <button
                    onClick={toggleFullscreen}
                    className="player-btn"
                  >
                    {isFullscreen ? (
                      <Minimize size={19} />
                    ) : (
                      <Maximize size={19} />
                    )}
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              VIDEO INFO
          ================================================== */}

          <div
            className="
              p-[22px]
              rounded-2xl
              bg-white/6
              backdrop-blur-xl
              border border-white/20
            "
          >
            <p className="text-white text-[25px] font-semibold">
              {selectedVideo.title}
            </p>

            <p className="text-white/50 text-[15px] mt-[8px]">
              {selectedVideo.caption}
            </p>
          </div>

          {/* ==================================================
              SCENES
          ================================================== */}

          <div
            className="
              p-[20px]
              rounded-2xl
              bg-white/6
              backdrop-blur-xl
              border border-white/20
            "
          >

            <div className="flex items-center justify-between mb-[15px]">

              <div className="flex items-center gap-[10px]">

                <ImageIcon
                  size={21}
                  className="text-white"
                />

                <p className="text-white text-[22px]">
                  Scenes
                </p>

              </div>

              <span className="text-white/40 text-[13px]">
                {scenes.length} scenes
              </span>

            </div>

            {scenes.length > 0 ? (
              <div
                className="
                  flex
                  gap-[14px]
                  overflow-x-auto
                  pb-[5px]
                "
              >

                {scenes.map((scene, index) => (
                  <button
                    key={scene.id || index}
                    onClick={() =>
                      selectScene(scene)
                    }
                    className={`
                      relative
                      flex-shrink-0
                      w-[190px]
                      h-[110px]
                      rounded-xl
                      overflow-hidden
                      border
                      transition
                      group/scene
                      ${
                        selectedScene?.id === scene.id
                          ? 'border-white'
                          : 'border-white/15 hover:border-white/50'
                      }
                    `}
                  >

                    <img
                      src={
                        scene.image ||
                        scene.url
                      }
                      alt={`Scene ${index + 1}`}
                      className="
                        w-full
                        h-full
                        object-cover
                        group-hover/scene:scale-110
                        transition
                        duration-500
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/80
                        via-transparent
                        to-transparent
                      "
                    />

                    <span
                      className="
                        absolute
                        left-[8px]
                        bottom-[7px]
                        text-white
                        text-[12px]
                        bg-black/50
                        backdrop-blur-md
                        px-[7px]
                        py-[3px]
                        rounded-md
                      "
                    >
                      Scene {index + 1}
                    </span>

                    {scene.time !== undefined && (
                      <span
                        className="
                          absolute
                          right-[8px]
                          bottom-[7px]
                          text-white/80
                          text-[11px]
                          bg-black/50
                          px-[6px]
                          py-[3px]
                          rounded-md
                        "
                      >
                        {typeof scene.time === 'number'
                          ? formatTime(scene.time)
                          : scene.time}
                      </span>
                    )}

                  </button>
                ))}

              </div>
            ) : (
              <div className="text-center py-[25px] text-white/40">
                Bu videoda scene rasmlari mavjud emas.
              </div>
            )}

          </div>

        </div>
      ) : (
        /* ==================================================
           NO VIDEO
        ================================================== */

        <div
          className="
            aspect-video
            flex
            flex-col
            items-center
            justify-center
            gap-[15px]
            rounded-[28px]
            bg-white/6
            backdrop-blur-xl
            border border-white/20
          "
        >

          <div className="p-[20px] rounded-full bg-white/10">

            <Play
              size={35}
              color="white"
              fill="white"
            />

          </div>

          <p className="text-white text-[22px]">
            Videoni tanlang
          </p>

          <p className="text-white/40">
            Pastdagi videolardan birini tanlang
          </p>

        </div>
      )}

      {/* ==================================================
          VIDEOS
      ================================================== */}

      <div className="flex flex-col gap-[18px]">

        <div className="flex items-center justify-between">

          <p className="text-white text-[28px] font-semibold">
            Episodes & Videos
          </p>

          <span className="text-white/40">
            {videos.length} ta video
          </span>

        </div>

        {videos.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-[18px]
            "
          >

            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() =>
                  openVideo(video)
                }
                className={`
                  text-left
                  group
                  overflow-hidden
                  rounded-2xl
                  bg-white/6
                  backdrop-blur-xl
                  border
                  transition-all
                  duration-300
                  ${
                    selectedVideo?.id === video.id
                      ? 'border-white/70 bg-white/10'
                      : 'border-white/15 hover:border-white/40'
                  }
                `}
              >

                <div className="relative h-[210px] bg-black">

                  <video
                    src={video.video}
                    muted
                    preload="metadata"
                    playsInline
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition
                      duration-500
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/20
                      group-hover:bg-black/40
                      transition
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <div
                      className="
                        w-[55px]
                        h-[55px]
                        flex
                        items-center
                        justify-center
                        rounded-full
                        bg-white/15
                        backdrop-blur-xl
                        border border-white/30
                        group-hover:scale-110
                        transition
                      "
                    >

                      <Play
                        size={23}
                        color="white"
                        fill="white"
                      />

                    </div>

                  </div>

                </div>

                <div className="p-[15px]">

                  <p className="text-white text-[18px] truncate">
                    {video.title}
                  </p>

                  <p className="text-white/45 text-[13px] truncate mt-[5px]">
                    {video.caption}
                  </p>

                </div>

              </button>
            ))}

          </div>
        ) : (
          <div
            className="
              p-[30px]
              text-center
              text-white/40
              bg-white/6
              backdrop-blur-xl
              border border-white/20
              rounded-2xl
            "
          >
            Hozircha videolar mavjud emas.
          </div>
        )}

      </div>

      {/* ==================================================
          MUSIC
      ================================================== */}

      <div
        className="
          p-[20px]
          rounded-2xl
          bg-white/6
          backdrop-blur-xl
          border border-white/20
        "
      >

        <div className="flex items-center justify-between mb-[18px]">

          <div className="flex items-center gap-[10px]">

            <Music2
              size={22}
              className="text-white"
            />

            <p className="text-white text-[28px] font-semibold">
              Anime Music
            </p>

          </div>

          <span className="text-white/40">
            {musics.length} ta
          </span>

        </div>

        {musics.length > 0 ? (
          <div className="flex flex-col gap-[10px]">

            {musics.map((music, index) => (
              <button
                key={music.id || index}
                onClick={() =>
                  toggleMusic(music)
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-[15px]
                  p-[12px]
                  rounded-xl
                  text-left
                  border
                  transition
                  ${
                    selectedMusic?.id === music.id
                      ? 'bg-white/10 border-white/40'
                      : 'bg-white/4 border-white/10 hover:bg-white/8 hover:border-white/25'
                  }
                `}
              >

                <div className="relative w-[65px] h-[65px] flex-shrink-0">

                  <img
                    src={
                      music.cover ||
                      music.image
                    }
                    alt={music.title}
                    className="
                      w-full
                      h-full
                      rounded-lg
                      object-cover
                    "
                  />

                  {selectedMusic?.id === music.id &&
                    musicPlaying && (
                      <div
                        className="
                          absolute
                          inset-0
                          flex
                          items-center
                          justify-center
                          bg-black/40
                          rounded-lg
                        "
                      >
                        <Music2
                          color="white"
                          size={22}
                        />
                      </div>
                    )}

                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-white text-[16px] truncate">
                    {music.title}
                  </p>

                  <p className="text-white/40 text-[13px] truncate">
                    {music.artist ||
                      'Unknown Artist'}
                  </p>

                </div>

                <div
                  className="
                    w-[42px]
                    h-[42px]
                    rounded-full
                    flex
                    items-center
                    justify-center
                    bg-white/10
                    border border-white/20
                    text-white
                  "
                >

                  {selectedMusic?.id === music.id &&
                  musicPlaying ? (
                    <Pause size={17} />
                  ) : (
                    <Play
                      size={17}
                      fill="white"
                    />
                  )}

                </div>

              </button>
            ))}

          </div>
        ) : (
          <div className="py-[30px] text-center text-white/40">
            Hozircha musiqa mavjud emas.
          </div>
        )}

        {/* AUDIO */}

        {selectedMusic && (
          <audio
            ref={audioRef}
            src={selectedMusic.audio}
            onPlay={() =>
              setMusicPlaying(true)
            }
            onPause={() =>
              setMusicPlaying(false)
            }
            onTimeUpdate={handleMusicTime}
            onLoadedMetadata={
              handleMusicMetadata
            }
            onEnded={handleMusicEnded}
          />
        )}

        {/* MUSIC PLAYER */}

        {selectedMusic && (
          <div
            className="
              mt-[18px]
              p-[15px]
              rounded-xl
              bg-black/20
              border border-white/10
            "
          >

            <div className="flex items-center gap-[12px]">

              <button
                onClick={() =>
                  toggleMusic(
                    selectedMusic
                  )
                }
                className="
                  w-[45px]
                  h-[45px]
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  border border-white/20
                  text-white
                  hover:bg-white/15
                  transition
                "
              >

                {musicPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play
                    size={18}
                    fill="white"
                  />
                )}

              </button>

              <div className="flex-1 min-w-0">

                <div className="flex justify-between items-center mb-[5px]">

                  <span className="text-white text-[13px] truncate">
                    {selectedMusic.title}
                  </span>

                  <span className="text-white/40 text-[12px] ml-[10px]">
                    {formatTime(
                      musicCurrentTime
                    )}{' '}
                    /{' '}
                    {formatTime(
                      musicDuration
                    )}
                  </span>

                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={musicProgress}
                  onChange={
                    changeMusicProgress
                  }
                  className="
                    w-full
                    accent-white
                    cursor-pointer
                  "
                />

              </div>

            </div>

          </div>
        )}

      </div>

      {/* ==================================================
          ANIME INFORMATION
      ================================================== */}

      <div className="flex flex-col lg:flex-row gap-[25px]">

        <div className="w-full lg:w-[45%]">

          <img
            src={data.image}
            alt={data.title}
            className="
              w-full
              h-[550px]
              rounded-3xl
              object-cover
              border border-white/10
            "
          />

        </div>

        <div
          className="
            w-full
            lg:w-[55%]
            flex
            flex-col
            gap-[20px]
            text-white
          "
        >

          <p
            className="
              text-[32px]
              lg:text-[40px]
              font-semibold
              bg-white/6
              backdrop-blur-xl
              border border-white/20
              rounded-2xl
              p-[20px]
            "
          >
            {data.title}
          </p>

          <p
            className="
              p-[20px]
              text-[17px]
              leading-8
              text-white/70
              bg-white/6
              backdrop-blur-xl
              border border-white/20
              rounded-2xl
            "
          >
            {data.caption}
          </p>

          <div className="flex flex-wrap gap-[10px]">

            {data.genre?.map(
              (genre, index) => (
                <span
                  key={index}
                  className="
                    px-[13px]
                    py-[9px]
                    text-[14px]
                    bg-white/6
                    backdrop-blur-xl
                    border border-white/20
                    rounded-xl
                  "
                >
                  {genre}
                </span>
              )
            )}

            <span
              className="
                flex
                items-center
                gap-[6px]
                px-[13px]
                py-[9px]
                bg-white/6
                backdrop-blur-xl
                border border-white/20
                rounded-xl
              "
            >
              <CalendarRange size={17} />

              {data.year}
            </span>

            <span
              className="
                flex
                items-center
                gap-[6px]
                px-[13px]
                py-[9px]
                bg-white/6
                backdrop-blur-xl
                border border-white/20
                rounded-xl
              "
            >
              <Play size={17} />

              {data.episodes || 0}
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Watch
