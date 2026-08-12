import { CirclePlus, ImageUp, SquarePen, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { api } from '../../../src/hooks/axios'
function AnimePlus() {
  const [modal, setModal] = useState('')
  const [data, setData] = useState([])
  const [genres, setGenres] = useState([])
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

  useEffect(() => {
    async function genres() {
      try {
        const { data } = await api.get('/genres')
        setGenres(data)
      } catch (error) {
        console.log(error.message)
      }
    }

    genres()
  })

  const [img, setImg] = useState('')
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [genre1, setGenre1] = useState('')
  const [genre, setGenre] = useState('')
  const [reting, setReting] = useState(0)
  const [episode, setEpisode] = useState(0)
  const [year, setYear] = useState(0)

  async function del(id) {
    try {
      api.delete(`/animes/${id}`)
      setData((prevAnimes) => prevAnimes.filter((anime) => anime.id !== id))
    } catch (error) {
      console.log(error.message)
    }
  }
  async function Submit(e) {
    e.preventDefault()

    if (!img || !title || !caption || !genre || !genre1 || !reting || !episode || !year) {
      return toast.error('Iltimos, barcha maydonlarni to‘ldiring')
    }

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
      }

      try {
        const { data: updatedData } = await api.put(`/animes/${edit.id}`, updatedAnime)

        setData((prev) => prev.map((anime) => (anime.id === edit.id ? updatedData : anime)))

        setModal('')
        setEdit(null)

        toast.success('Anime muvaffaqiyatli tahrirlandi')
      } catch (error) {
        console.log(error.message)
        toast.error('Anime tahrirlanmadi')
      }

      return
    }

    const newAnime = {
      id: Date.now(),
      title,
      caption,
      image: img,
      genre: [genre, genre1],
      rating: reting,
      episodes: episode,
      year,
      time: new Date().toISOString(),
    }

    try {
      const { data: newData } = await api.post('/animes', newAnime)

      setData((prev) => [...prev, newData])

      setModal('')

      toast.success('Anime qo‘shildi')
    } catch (error) {
      console.log(error.message)
    }
  }

  const [edit, setEdit] = useState(null)

  useEffect(() => {
    if (edit) {
      setImg(edit.image)
      setCaption(edit.caption)
      setTitle(edit.title)
      setReting(edit.rating)
      setEpisode(edit.episodes)
      setYear(edit.year)
      setGenre(edit.genre?.[0] || '')
      setGenre1(edit.genre?.[1] || '')
    }
  }, [edit])

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="w-full flex justify-between">
        <button
          className="text-[20px] text-white   bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl p-[10px]"
          onClick={() => setModal('add')}
        >
          Add
        </button>
      </div>
      <div className="w-[100%] flex flex-wrap gap-[20px]">
        {data.map((item) => {
          return (
            <div
              className="flex w-[200px] flex-col  bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden gap-[10px]"
              key={item.id}
            >
              <img src={item.image} alt="AnimePhoto" className="w-full h-[300px]" />
              <div className="title p-[10px]">
                <p className="truncate text-white text-[25px]">{item.title}</p>
                <p className="truncate text-white text-[16px]">{item.caption}</p>
              </div>
              <div className="flex text-white p-[10px] gap-[10px] justify-center ">
                <SquarePen
                  onClick={() => {
                    setEdit(item)
                    setModal('edit')
                  }}
                  className="text-amber-300 hover:text-amber-500 cursor-pointer"
                />
                <Trash2
                  onClick={() => del(item.id)}
                  className="text-red-500 hover:text-red-600 cursor-pointer "
                />
                <CirclePlus
                  onClick={() => setModal('ep')}
                  className="text-blue-500 hover:text-blue-600 cursor-pointer "
                />
                <ImageUp
                  onClick={() => setModal('cadr')}
                  className="text-green-500 hover:text-green-600 cursor-pointer "
                />
              </div>
            </div>
          )
        })}
      </div>
      {modal ? (
        <div className=" fixed z-20 top-0 left-0 w-screen h-screen  bg-white/6 backdrop-blur-lg border border-white/20  flex justify-center items-center">
          <div className="flex flex-col gap-[20px]  bg-white/6 backdrop-blur-lg border border-white/20 p-[20px] text-white rounded-xl">
            <div className="flex w-full justify-between">
              <p>OTAKU-HUB | Anime Add</p>
              <button
                className=" bg-white/6 backdrop-blur-lg border border-white/20 rounded-[50%] hover:rotate-[360deg] transition duration-500 p-[10px]"
                onClick={() => setModal('')}
              >
                <X />
              </button>
            </div>
            <div className="flex flex-col ">
              <form onSubmit={Submit} className="flex flex-col gap-[20px]">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Anime Title"
                  className="  bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
                />
                <div className="flex gap-[10px]">
                  <div className="flex flex-col gap-[20px]">
                    <input
                      value={img}
                      type="url"
                      onChange={(e) => setImg(e.target.value)}
                      placeholder="Photo URL"
                      className="  bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
                    />
                    <input
                      value={reting}
                      type="text"
                      onChange={(e) => setReting(e.target.value)}
                      placeholder="Anime Reting"
                      className="  bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
                    />
                    <select
                      value={genre}
                      className="outline-none bg-white/6 backdrop-blur-lg border border-white/2 p-[10px] rounded-xl"
                      onChange={(e) => setGenre(e.target.value)}
                    >
                      {genres.map((i) => {
                        return (
                          <option
                            key={i.id}
                            className="text-white bg-black rounded-xl outline-none"
                          >
                            {i.name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="flex flex-col gap-[20px]">
                    <input
                      value={episode}
                      type="number"
                      onChange={(e) => setEpisode(e.target.value)}
                      placeholder="Episode Number"
                      className="  bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
                    />
                    <input
                      value={year}
                      type="number"
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Anime Year"
                      className="  bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
                    />
                    <select
                      value={genre1}
                      className="outline-none bg-white/6 backdrop-blur-lg border border-white/2 p-[10px] rounded-xl"
                      onChange={(e) => setGenre1(e.target.value)}
                    >
                      {genres.map((i) => {
                        return (
                          <option
                            key={i.id}
                            className="text-white bg-black rounded-xl outline-none"
                          >
                            {i.name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
                <textarea
                  value={caption}
                  type="url"
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Anime Caption"
                  className="min-w-[100%] max-h-[150px]  bg-white/6 backdrop-blur-lg border border-white/20 outline-none p-[10px] rounded-xl"
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
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default AnimePlus
