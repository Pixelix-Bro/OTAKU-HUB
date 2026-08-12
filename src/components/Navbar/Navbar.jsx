import { NavLink } from 'react-router-dom'
import Logo from '../../../public/4.png'
function Navbar() {
  return (
    <>
      <div className="w-screen flex justify-center">
        <div className="flex  justify-center  items-center mt-[10px] fixed pt-[20px] items-center z-30 ">
          <div className="flex  justify-between w-full contenr  ">
            <div className="w-[20%] h-[100%]">
              <img
                src={Logo}
                alt="Logo"
                className=" items-center w-[30%] gap-[40px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl flex justify-center"
              />
            </div>
            <div className="menu text-white flex items-center w-auto p-[20px] gap-[30px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl flex justify-center">
              <NavLink to={'/'}>Home</NavLink>
              <NavLink to={'/top'}>Top Anime</NavLink>
              <NavLink to={'/random'}>Random Anime</NavLink>
              <NavLink to={'/search'}>Search</NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
