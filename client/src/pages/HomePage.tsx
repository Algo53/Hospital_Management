import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className='flex w-screen h-screen justify-center'
      style={{
        backgroundImage: `url('/images/homepage2.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        minWidth: '100vw',
      }}
    >
      <div className='flex flex-col pt-20 w-[800px] gap-5 h-min justify-center'>
        <div className='flex text-4xl font-bold backdrop-blur-sm py-1 px-5 rounded-3xl'>
          The Simplest Way to Manage your Health Service
        </div>
        <div className='flex text-lg backdrop-blur-md px-5 py-1 rounded-2xl text-white'>
          Our user-friendly medical admin dashboard streamlines patient management, appointment scheduling, ensuring a seamless experience for both patients and healthcare professionals.
        </div>
        <div className='flex pt-20 justify-between'>
          <Link to='/login' className='flex text-3xl hover:text-[31px] font-bold backdrop-blur-sm hover:backdrop-blur-xl px-5 py-1 rounded-xl'>Login</Link>
          <Link to='/signup' className='flex text-3xl hover:text-[31px] font-bold backdrop-blur-sm hover:backdrop-blur-lg px-2 py-1 rounded-xl'>Register as Admin</Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage