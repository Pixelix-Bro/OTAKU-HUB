import { CirclePlus, ImageUp, SquarePen, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { api } from '../../../src/hooks/axios'

function AnimePlus() {
  const [modal, setModal] = useState('')
  const [data, setData] = useState([])
  const [genres, setGenres] = useState([])

  // Anime
  const [img, setImg] = useState('')
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [genre1, setGenre1] = useState('')
  const [genre, setGenre] = useState('')
  const [reting, setReting] = useState('')
  const [episode, setEpisode] = useState('')
  const [year, setYear] = useState('')

  // Edit
  const [edit, setEdit] = useState(null)

  // Selected anime
  const [selectedAnime, setSelectedAnime] = useState(null)

  // Short video
  const [epTitle, setEpTitle] = useState('')
  const [epVideo, setEpVideo] = useState('')
  const [epCaption, setEpCaption] = useState('')

  // Get animes
  useEffect(() => {
    async function getApi() {
      try {
        const { data } = await api.get('/animes')
        setData(data)
      } catch (error) {
        console.log(error.message)
      }
    }

    getApi()
    document.title = 'OTAKU-HUB | Add anime'
  }, [])

  // Get genres
  useEffect(() => {
    async function getGenres() {
      try {
        const { data } = await api.get('/genres')
        setGenres(data)
      } catch (error) {
        console.log(error.message)
      }
    }

    getGenres()
  }, [])

  // Delete anime
  async function del(id) {
    try {
      await api.delete(`/animes/${id}`)

      setData((prevAnimes) => prevAnimes.filter((anime) => anime.id !== id))

      toast.success("Anime o'chirildi")
    } catch (error) {
      console.log(error.message)
      toast.error("Anime o'chirilmadi")
    }
  }

  // Add / Edit anime
  async function Submit(e) {
    e.preventDefault()

    if (!img || !title || !caption || !genre || !genre1 || !reting || !year) {
      return toast.error("Iltimos, barcha maydonlarni to'ldiring")
    }

    // EDIT
    if (edit) {
      const updatedAnime = {
        title,
        caption,
        image: img,
        genre: [genre, genre1],
        rating: reting,
        episodes: episode,
        year,
        time: edit.time,
        videos: edit.videos || [],
      }

      try {
        const { data: updatedData } = await api.put(`/animes/${edit.id}`, updatedAnime)

        setData((prev) => prev.map((anime) => (anime.id === edit.id ? updatedData : anime)))

        setModal('')
        setEdit(null)
        resetAnimeForm()

        toast.success('Anime muvaffaqiyatli tahrirlandi')
      } catch (error) {
        console.log(error.message)
        toast.error('Anime tahrirlanmadi')
      }

      return
    }

    // CREATE
    const newAnime = {
      id: Date.now(),
      title,
      caption,
      image: img,
      genre: [genre, genre1],
      rating: reting,
      episodes: episode,
      year,
      videos: [],
      time: new Date().toISOString(),
    }

    try {
      const { data: newData } = await api.post('/animes', newAnime)

      setData((prev) => [...prev, newData])

      setModal('')
      resetAnimeForm()

      toast.success("Anime qo'shildi")
    } catch (error) {
      console.log(error.message)
      toast.error("Anime qo'shilmadi")
    }
  }

  // Reset anime form
  function resetAnimeForm() {
    setImg('')
    setTitle('')
    setCaption('')
    setGenre('')
    setGenre1('')
    setReting('')
    setEpisode('')
    setYear('')
  }

  // Edit anime form
  useEffect(() => {
    if (edit) {
      setImg(edit.image || '')
      setCaption(edit.caption || '')
      setTitle(edit.title || '')
      setReting(edit.rating || '')
      setEpisode(edit.episodes || '')
      setYear(edit.year || '')
      setGenre(edit.genre?.[0] || '')
      setGenre1(edit.genre?.[1] || '')
    }
  }, [edit])

  // Add short video
  async function Episod(e) {
    e.preventDefault()

    if (!selectedAnime || !epTitle || !epVideo) {
      return toast.error('Video nomi va video URL/file ID kerak')
    }

    const newVideo = {
      id: Date.now(),
      title: epTitle,
      caption: epCaption,
      video: epVideo,
      time: new Date().toISOString(),
    }

    const updatedAnime = {
      ...selectedAnime,
      videos: [...(selectedAnime.videos || []), newVideo],
    }

    try {
      const { data: updatedData } = await api.put(`/animes/${selectedAnime.id}`, updatedAnime)

      setData((prev) => prev.map((anime) => (anime.id === selectedAnime.id ? updatedData : anime)))

      setSelectedAnime(null)

      setEpTitle('')
      setEpVideo('')
      setEpCaption('')

      setModal('')

      toast.success("Qisqa video qo'shildi")
    } catch (error) {
      console.log(error.message)
      toast.error("Video qo'shilmadi")
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {/* ADD BUTTON */}
      <div className="w-full flex justify-between">
        <button
          className="text-[20px] text-white bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl p-[10px]"
          onClick={() => {
            setEdit(null)
            resetAnimeForm()
            setModal('add')
          }}
        >
          Add
        </button>
      </div>

      {/* ANIME LIST */}
      <div className="w-[100%] flex flex-wrap gap-[20px]">
        {data.map((item) => (
          <div
            className="flex w-[200px] flex-col bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden gap-[10px]"
            key={item.id}
          >
            <img src={item.image} alt="AnimePhoto" className="w-full h-[300px] object-cover" />

            <div className="title p-[10px]">
              <p className="truncate text-white text-[25px]">{item.title}</p>

              <p className="truncate text-white text-[16px]">{item.caption}</p>

              <p className="text-white/60 text-sm mt-2">Videos: {item.videos?.length || 0}</p>
            </div>

            {/* ACTIONS */}
            <div className="flex text-white p-[10px] gap-[10px] justify-center">
              {/* EDIT */}
              <SquarePen
                onClick={() => {
                  setEdit(item)
                  setModal('edit')
                }}
                className="text-amber-300 hover:text-amber-500 cursor-pointer"
              />

              {/* DELETE */}
              <Trash2
                onClick={() => del(item.id)}
                className="text-red-500 hover:text-red-600 cursor-pointer"
              />

              {/* ADD SHORT VIDEO */}
              <CirclePlus
                onClick={() => {
                  setSelectedAnime(item)

                  setEpTitle('')
                  setEpVideo('')
                  setEpCaption('')

                  setModal('ep')
                }}
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
              />

              {/* IMAGE */}
              <ImageUp
                onClick={() => setModal('cadr')}
                className="text-green-500 hover:text-green-600 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ========================= */}
      {/* ADD / EDIT ANIME MODAL */}
      {/* ========================= */}

      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed z-20 top-0 left-0 w-screen h-screen bg-black/40 backdrop-blur-lg border border-white/20 flex justify-center items-center">
          <div className="flex flex-col gap-[20px] bg-white/6 backdrop-blur-lg border border-white/20 p-[20px] text-white rounded-xl">
            {/* HEADER */}
            <div className="flex w-full justify-between">
              <p>OTAKU-HUB | Anime {modal === 'edit' ? 'Edit' : 'Add'}</p>

              <button
                className="bg-white/6 backdrop-blur-lg border border-white/20 rounded-[50%] hover:rotate-[360deg] transition duration-500 p-[10px]"
                onClick={() => {
                  setModal('')
                  setEdit(null)
                }}
              >
                <X />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={Submit} className="flex flex-col gap-[20px]">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Anime Title"
                className="bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
              />

              <div className="flex gap-[10px]">
                <div className="flex flex-col gap-[20px]">
                  <input
                    value={img}
                    type="url"
                    onChange={(e) => setImg(e.target.value)}
                    placeholder="Photo URL"
                    className="bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
                  />

                  <input
                    value={reting}
                    type="text"
                    onChange={(e) => setReting(e.target.value)}
                    placeholder="Anime Rating"
                    className="bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
                  />

                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="outline-none bg-white/6 backdrop-blur-lg border border-white/20 p-[10px] rounded-xl"
                  >
                    <option value="" className="text-black">
                      Select Genre
                    </option>

                    {genres.map((i) => (
                      <option key={i.id} value={i.name} className="text-black bg-white">
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-[20px]">
                  <input
                    value={episode}
                    type="number"
                    onChange={(e) => setEpisode(e.target.value)}
                    placeholder="Episode Number"
                    className="bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
                  />

                  <input
                    value={year}
                    type="number"
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Anime Year"
                    className="bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
                  />

                  <select
                    value={genre1}
                    onChange={(e) => setGenre1(e.target.value)}
                    className="outline-none bg-white/6 backdrop-blur-lg border border-white/20 p-[10px] rounded-xl"
                  >
                    <option value="" className="text-black">
                      Select Genre
                    </option>

                    {genres.map((i) => (
                      <option key={i.id} value={i.name} className="text-black bg-white">
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Anime Caption"
                className="min-w-[100%] max-h-[150px] bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
              />

              <button
                type="submit"
                className="bg-white/6 backdrop-blur-lg border border-white/20 p-[20px] rounded-xl"
              >
                {modal === 'edit' ? 'Edit' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
      {modal === 'ep' && (
        <div className="fixed z-20 top-0 left-0 w-screen h-screen bg-black/40 backdrop-blur-lg border border-white/20 flex justify-center items-center">
          <div className="flex flex-col gap-[20px] w-[500px] bg-white/6 backdrop-blur-lg border border-white/20 p-[20px] text-white rounded-xl">
            {/* HEADER */}
            <div className="flex w-full justify-between">
              <div>
                <p>OTAKU-HUB | Add Short Video</p>

                {selectedAnime && (
                  <p className="text-white/50 text-sm mt-1">Anime: {selectedAnime.title}</p>
                )}
              </div>

              <button
                className="bg-white/6 backdrop-blur-lg border border-white/20 rounded-[50%] hover:rotate-[360deg] transition duration-500 p-[10px]"
                onClick={() => {
                  setModal('')
                  setSelectedAnime(null)
                }}
              >
                <X />
              </button>
            </div>

            {/* VIDEO FORM */}
            <form onSubmit={Episod} className="flex flex-col gap-[20px]">
              <input
                type="text"
                value={epTitle}
                onChange={(e) => setEpTitle(e.target.value)}
                placeholder="Video Title"
                className="bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
              />

              <input
                type="text"
                value={epVideo}
                onChange={(e) => setEpVideo(e.target.value)}
                placeholder="Telegram File ID / Video URL"
                className="bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
              />

              <textarea
                value={epCaption}
                onChange={(e) => setEpCaption(e.target.value)}
                placeholder="Video Caption"
                className="min-w-[100%] max-h-[150px] bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
              />

              <button
                type="submit"
                className="bg-white/6 backdrop-blur-lg border border-white/20 p-[20px] rounded-xl"
              >
                Add Video
              </button>
            </form>
          </div>
        </div>
      )}

      {modal === 'cadr' && (
        <div className="fixed z-20 top-0 left-0 w-screen h-screen bg-black/40 backdrop-blur-lg border border-white/20 flex justify-center items-center">
          <div className="bg-white/6 backdrop-blur-lg border border-white/20 p-[20px] text-white rounded-xl">
            <div className="flex w-full justify-between gap-[30px]">
              <p>OTAKU-HUB | Image</p>

              <button
                className="bg-white/6 backdrop-blur-lg border border-white/20 rounded-[50%] p-[10px]"
                onClick={() => setModal('')}
              >
                <X />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnimePlus
