import { Outlet } from "react-router-dom"


function NormalLayout() {
  return (
    <div className="flex w-screen h-screen bg-zinc-100">
      <Outlet />
    </div>
  )
}

export default NormalLayout