import { ChartNoAxesCombined, CircleFadingPlus, Hd, LayoutDashboard } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import img1 from '../../../public/7.png'

const hov =
  'p-[10px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl text-white flex w-full gap-[10px] text-[25px] items-start justify-start p-[20px] rounded-2xl'
const def =
  'text-white flex w-full gap-[10px] text-[25px] items-center justify-start p-[20px] rounded-2xl '
function Navbar() {
  return (
    <div className="">
      <div className="pl-[10px] pt-[10px] ">
        <div className="rounded-4xl bg-white/6 backdrop-blur-lg border border-white/20 rounded-xl  w-[300px] h-[97vh] flex items-center flex-col gap-[20px] fixed z-20">
          <div className="w-[70%]">
            <img src={img1} alt="Logo" />
          </div>
          <div className="flex flex-col gap-[20px]">
            <NavLink to={'/admin'} end className={({ isActive }) => (isActive ? hov : def)}>
              <LayoutDashboard size={33} />
              Dashboard
            </NavLink>
            <NavLink to="/admin/addanime" className={({ isActive }) => (isActive ? hov : def)}>
              <CircleFadingPlus size={33} />
              Anime Plus
            </NavLink>
            <NavLink to="/admin/status" className={({ isActive }) => (isActive ? hov : def)}>
              <ChartNoAxesCombined size={33} />
              Anime Status
            </NavLink>
            <NavLink to="/admin/post" className={({ isActive }) => (isActive ? hov : def)}>
              <Hd size={33} />
              Anime Post
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
