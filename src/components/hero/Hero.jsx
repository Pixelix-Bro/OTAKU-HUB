import { CalendarRange, Play, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { api } from '../../hooks/axios'
import Loading from '../Loading/Loaing'
const Hero = () => {
  const { id } = useParams()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  async function getAnime() {
    try {
      const res = await api.get('/animes')
      const data = await res.data
      setData(data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getAnime()
  }, [])

  return (
    <div className="w-[100%]  h-[480px] p-[20px] rounded-4xl bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl flex flex-row">
      {loading ? <Loading /> : ''}
      <Swiper
        loop={data.length > 3}
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        speed={400}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        className="w-full h-[490px] rounded-3xl"
      >
        {data.map((item) => {
          return (
            <SwiperSlide className="h-full flex rounded-4xl">
              <div className="flex w-full justify-between  rounded-4xl p-[10px] gap-[90px]">
                <img
                  src={item.image}
                  alt="Anime Photo"
                  className="w-[260px] h-[400px] rounded-4xl transition-all duration-200 "
                />
                <div className="flex flex-col items-end gap-[30px] p-[30px]   bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl">
                  <h1 className="text-[50px] text-white font-bold">{item.title}</h1>
                  <p className="text-white h-[150px]">{item.caption}</p>
                  <div className="flex gap-[20px] items-center">
                    <div className="flex gap-[20px]">
                      <div className="flex gap-[7px] rounded-4xl bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl p-[6px]">
                        <TrendingUp color="white" />
                        <p className="text-white">{item.rating}</p>
                      </div>
                      <div className="flex gap-[7px] rounded-4xl bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl p-[6px]">
                        <Play color="white" />
                        <p className="text-white">{item.episodes}</p>
                      </div>
                      <div className="flex gap-[7px] rounded-4xl bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl p-[6px]">
                        <CalendarRange color="white" />
                        <p className="text-white">{item.year}</p>
                      </div>
                    </div>
                    <NavLink
                      className={
                        'text-[20px] text-white border-white border-[0.1px] p-[10px] rounded-4xl cursor-pointer transition duration-200 hover:bg-gray-600 '
                      }
                    >
                      Anime About
                    </NavLink>
                    <NavLink
                      to={`watch/anime/id/${item.id}`}
                      className={
                        'text-[20px] text-white border-white border-[0.1px] p-[10px] rounded-4xl cursor-pointer transition duration-200 hover:bg-amber-600 '
                      }
                    >
                      Watch Anime
                    </NavLink>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  )
}

export default Hero
