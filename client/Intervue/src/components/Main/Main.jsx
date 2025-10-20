import React, { use } from 'react'
import LogoLoop from '../../../Reactbits/LogoLoop/LogoLoop.jsx'
import { useNavigate } from 'react-router-dom'

function Main() {
  // Logo data - keeping the original structure but simplified for display
    const logos = [
    { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAnFBMVEVHcEzqQzXqQjXqQzXqQzXqQzXrRzPqRDTqQzXqQzXqQzXqQzXqOzbqQzX8vQPziCL7vAX8vAT3pRX7vAXsVzD7vAVChfRChfRChPRChfRChfT7vAVBhvJChfQ8m5BChfRChfRYq0wxqFPXuCEzqFKqsjUZp1Y0qFM9qVFDg/o0qFM0qFMzqFA8lLxDg/1ChfQ0qFM0qFMzqFE3onsP391uAAAAM3RSTlMAOYXD7f9hFN+ZWlX/bev/Mv//hv/CnZMe/0jGX2US7Nf/j//////KXoPe/DD//7+57UCtLMrnAAAA5ElEQVR4AX3QAxbEQBBF0T+2rdjG/vc23RXj5MZ5YaM0Gk+ms9l0Mh6hbc5CYTpH3WI5a1guUBrNOhYDbVw+c1aYrFaTZkPxvjXIpt7mW0oTlHYo7Q/bonUcT6fzbDtDr8uJuY7R63biit+6Pyr3J/a87ZF71b1x4j698TsUf0OP/eYfJIBAlIiYv5N+RVbQcKco8EFQNU1DAzURwF43WDS7N94BWLw1qv0iTzAORde1QDzTD3gLwQlaIVKUKGZbqgJIwu7TGlL+HyhqxxclwWne7Caos+JaU9DmKWbsurGpVHf9AR6XJvBaxWh+AAAAAElFTkSuQmCC", alt: "Google" },
    { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABnRSTlMAAAAAAABupgeRAAAAWklEQVR4AWP4FKBEJPrip8wABrV7GOp3EYtGhgWjFoxaMGrBqAXf/OSIRD995CEWVO9hqN1FLBoOYNlnotF3iI7/O4lHQOVL3hONPo9agB2NWjBqwagFoxYAAB2zMZ7bQW2tAAAAAElFTkSuQmCC", alt: "Microsoft" },
    { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAEU0lEQVRIibWWXUybZRTHz3nftx9rUxUaKd34HIyRAQbNDMWMZWjcmIsBgruYN7tzF1siapyZH1coEoOI3kzNliUmwlBidDoUJQJTHIJgjSAMCKMUKGXloxRoeT+e40XlpYttV0SevDfnOc/5/97nOc/HQSKCnWzcjqoDgBD7UGIkKzIRcRwn8Dwg/j8ARVFGbo10df381+Cg545HFEWj0ZicklJgK7AVFsbFxUUPx+g5mJube/3V1zo72hVZ+bc3wWJ5p7b2UNGh/whwu93PlJe7ZlxR4rUa7ScNnx589GCkARGTTETVVW+Gqmu1uqTkZIs1ked5tVOUxPq6Ooi8ChEBt8fHW1paVDP/kYe/uPZlW/uP7R2d1TU1er1edfX29CwuLmwZ4HBM4sZUiOjsuXPZ2dmCIGh12tKy0qz9+zcnIYrzCxEBEXdR8ePFfX/YJx0Oh8OxvOwrKjq8GaPRmM3m0MGyJG0ZAAAmkyknNzcnNzc4D9+yzznlnJmemZpyTkxMRAmMFRDU/bW7+2pjY39f/6zLpSgKYGwHLBZAIBC4cP6Vb659TRu7ZIviUQGiKL5YWfn9d61qj9VqPVpSkvdQXkKCpb6urr+vb1uAth/aQtWzDxyo/+D9zMzMoHnl8uVY1CHKNv225Xqo+dyZM6o6Ea35/dsCMMbGRsdUk4jS0lJVc2lpyTk5qZqIuLYWkRceQESyLIdKOJ1TquuzpqZZ1+YVwnHcTzc6twbged6SaAntuXLpkt1u93g8jQ0NH1/8kDEW6m262jQ4MBBWKmKSbYWF3b/cVE273V5RWsaIeC7MP8253c3NzcEjGdMMAODUqWetu3eH9iBiUF2j0bx0/uVjx4+rrqMlx56vrAwvRJHb9PT000+dyEhNU7+9KalPHCnu7elljPl8voqy8ozUtJrqtyVJ2ghiTPTKy2OSd0QJzBExDIx/rjEkYoINMcxyEdHY6OjQ0NB6IGAwGvfty8rIzFDfA7/fPzw8nJ+fHzzh8tKA/HsVePqQKcAUABCe/AoVaVnuvcBEnyb9JGc9DBoTwpbvg2Bj6/OkBBAFQGTzdqXztFDSKnCCSVPwnnTrI/m3N8BgxeQSfk8xZ8pEXgf/kO7JIwAgZZ38d5irg0214t4KzmBFzf14X6b6JjPFNyHbq2C6E0AhYzJneQwTi4QHskH/IAoGQOGuOoUISCElAOsexTvK3DeZqwOXb4PezOW9IKSfFO1vgbSqs9Xe9egTyczTpwxepLlukFcAAJAHjZF0ZtxlJl088SbgECU/J3vZqgvXl0DyApMBOTAmYXqFkHWa08WT5BO7zgq2d3l9Qriqghhbm2KzN5jjOi38SeIihlsoJIUJu8CQxFmPcKknuLgcTjAGh5HkZdIKb9gDkcoWAgJAJIVEL1udZr4JCLhBXGFsHZEDwYC6eM6YhKYU1CWgoI+Sp3sUXmoSMZhJAkQkoNh3WkyA7bQdr67/BvGhKyghWE2dAAAAAElFTkSuQmCC", alt: "Amazon" },
    { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAkFBMVEX////9/f+luu+BoeqqvvDD1/1/r/yfwfz6+//t8PsAYN4AT90AUt0KZeBspvwAb/lLlfsAePrl7f4aaOAAVN2ItPw5jvsAfPqdtO60xvIAXd8AXOPe6f6ZvvwhceZ1n/C50PzK2foAa/SqxPjW4vywzf+8y/Ijh/o9eODS3fgAcfrg5/l0qfuSsO9VkPBenPgPfDdCAAAApElEQVR4AeUQgwHAMCyzbdv6/7uZL6yNncDfHoJi+MoJkqK/PoblOF5gQJRkRVE/To3HGVTXDIUBMK23D+XthTqu569VpODlDN2NCa6zMvGVynjRykgrdNdpYunZNUmzheZSUeprlC8lDyeREgutKoBabwBUiXg62wzAWOM7L1wzn066rZqg7VdxcMd8kl53oNq2lXdxStPUgNfLs6tSkiXwrzcDVIoLHEbshVwAAAAASUVORK5CYII=", alt: "Meta" },
    { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEiklEQVRYha2XW2wUVRzGf7OX2SVt2d1ut11cMrVkt4XAA0oLiURC4UHI8iDpi4oJobXFRjCRRAJKTBDpW8VwEVGIwcjFd0OCSRHKMxEoCbSYmm7YsL1QdrdAZ/Yy40OnWNqZ7QzyPc75zv/79uw5/4tw+/ZdbOI14E0gBpTr354A94G/gKSdYC6LvAjQCrzvdruWeb1ePB4Rh8MBgKqqKEoOWZbJ5wv3gAvAGStmhHlOwA98DXRUV1d5/P6FeDxiyYCKkiOdzjIyMqYAPwJfAemXMbABOBcKBcM1NVUIglBSeDY0TWN4eIzR0Ucp4EOgx4jnMNnfAfwhSZFwOByyLQ4gCALhcAhJioSBy8BOqwY6Kyv9p2Kx150+X4UlMVVVOX/+At3d385Z8/kqiMXqnJWV/h+AzvkMbASOBYMBvF6vJXFZlmltbWPfvv309fUZcrxeD8FgAOCYrmFowA+ck6SI0+v1WBIHOHr0GFeu/AnA9u3bTXlerwdJijiBX3WtOQYOhULBGqvHDlO//vTpMwDs2vUJzc3rS/J9vgpCoWCYqZcF/PcKJOD+ihUN4nwXbnDwH1S1SF1dHU6nkyNHvqOpqZFoNMrDhykqKwPU1taa7tc0jTt3+nPAEiA5nYh2VFdXlRTv7b1Od3c3fX13UFWVhoZ64vE4tbUSZ8/+Qm/vdSYnJxFFkbVr3+LAgS+JxWJz4giCQHV1lTgyMvYRcHD6BO7W1y9ZapZkrl69xo4drRSLxZKnMxOxWIxLl37H45l7nxQlx8DAYD+w1AEsdrtdpuJPnz5l//4vbImXlZXR1XUYUTSO6fGIuN2uBmCxA1hZ6sldu9ZLMmmrvtDR0c6aNatLJjBdc6UDiJXK7zdu3LAlDrB586Z5ObpmvQOomK5qRpiYmLAlLgiCpSSma5abK+sIBAK2DGiaRn//gGW+A5hQVdWUsHz5clsGAI4fP0GhUCjJ0TWfOID7ipIzJTY1NVquC9O4desW7e07SSQSphxdc8AB3JRl2ZS4aNEi1q1725YBgJ6enuc1wgi65k0H8CCfL9wrdQqdnR/bNhAIBNi69V3DNUXJkc8XBoAH05fwYjqdNQ22atUqWlpabBnYu/dzfD6f4Vomk4WpvvF5Nfx5ZGQsr2maacBDhw4SjUYticfjcbZt+8BwTW/VcsBPAM7Ozl0AGaBG01hdXl5muFEURTZu3MDg4CAAzc3r2bPnM9ra2mhsbESWZVwuF1u2xOnqOozLZdxwDw+P8ezZ5EngN3ixKfUD9yQpYqsnsINMZoJEIpkClqF3yjMTURrYlkgki7KsvHJxWVZIJJJFpjrk52367EzYA+x+9Ogxr9KELCuMjz8G2M2s9tzojzo5Pp5Wx8fTJyQpYrkzNkM2O8HQULIIfAqcnL1uVgtOAe8kEslUKjVKqddhBk3TSKVGGRpKpoBNwPdGPCuj2TdAe01NlejzWRvNMpnszKd2gJcczWYiArQD77ndroYFC7yI4ovDaS6XY3JSJp8v9AMXdfH/PZwaYTHwBhAFFurfssDfTI3nD+wE+xfxCKNpO+N8NAAAAABJRU5ErkJggg==", alt: "Apple" },
    {src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAY1BMVEUAAAD////////////////////////////////////////////Pz8+Pj49fX18AAAC/v78/Pz9gYGDv7+9/f39QUFBAQECfn59vb28vLy/f398QEBAfHx+vr69PT08gICD////OKcp2AAAAIXRSTlMAEF+fz+//II8f3y///////////////////////////2AqutFBAAABHElEQVR4AYVTBQLCMAysHk7Wtdj8/6+EkbnepBa7JhE9pNLGAtZoJcUch6NFD32aHMsjJjjKkfoZM5wHRi58PpW4rOpPbMj2fC7BcRyxiuPfATZQO9EArrd1E7Ie73TFIqwUigUiLEMJzQIujj18eDwfLw/49/NZj4AWhgU+ziXXlDKXUQyfkXOUA4ARtnORZH9HkUegAvAchEAnEKjlklGZoMFA4NlSichR+WoF7EDAg8VTvDJ6Ny5MJ1C0XLM7kDh6cZB6EAMrBUoAJBQzzYr37tcoo98fyZtCknvcWFwJaYGaOFFZi/zwxqsemIhssp28ws0D0S3cIvzH9iL3071fMPslt1u0e2W/3zj7rcdGNHrY41B93v7VQPsL6J8c5Xq3hQ0AAAAASUVORK5CYII=", alt:"TCS"},
    {src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAAKlBMVEUAfMMAdsEAb756rdjp8vmav+Csy+bS4/JkotOLttz///8uicm91etSmc/zrBkHAAAAp0lEQVR4AWOgCDAqQhlCigJAUthVACKc4t4IpCSXQbgqzuaJCC7jLEahDWCuoKLgbkWGU0D2bhBXbfWpVd5dq0AAzF1Vu20VYxWD6PLbYO4aRaasoCrBriIBMHetAGNXUBWTF5CH4EqvQeEKr0ThSi5GlV2Kqne5AjKXqWojMpdhl6MgMld21QwGBtm5srMZGHZe7GRgZPMC+kyQQQBIMggCCSUG6gEASZFBBFedb0sAAAAASUVORK5CYII=", alt: "Infosys"}
  ]

  const navigate = useNavigate();

  function handleGetStarted() {
    navigate('/signup');
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden'>
      {/* Hero Section */}
      <div className='relative py-12 sm:py-16 lg:py-20'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div className='absolute top-20 left-10 w-32 h-32 border border-blue-400 rounded-full'></div>
          <div className='absolute bottom-32 right-16 w-24 h-24 border border-blue-400 rounded-full'></div>
          <div className='absolute top-1/3 right-1/4 w-16 h-16 border border-blue-400 rounded-full'></div>
          <div className='absolute bottom-1/4 left-1/3 w-20 h-20 border border-blue-400 rounded-full'></div>
        </div>

        {/* Main Content */}
        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header Section */}
          <div className='text-center mb-12 sm:mb-16 lg:mb-20'>
            <div className='mb-6'>
              <span className='inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm sm:text-base font-semibold px-4 py-2 rounded-full shadow-lg'>
                🚀 Trusted by 100,000+ Students
              </span>
            </div>
            
            <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
              <span className='bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent'>
                Ace Your Interviews
              </span>
              <br />
              <span className='text-gray-800'>
                with Industry Giants
              </span>
            </h1>
            
            <p className='text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8'>
              Master technical interviews with AI-powered mock sessions, real-time feedback, 
              and comprehensive preparation for top tech companies.
            </p>

            {/* Stats Section */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto mb-16'>
              <div className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold text-blue-600 mb-2'>95%</div>
                <div className='text-gray-600 text-sm sm:text-base'>Success Rate</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold text-blue-600 mb-2'>50K+</div>
                <div className='text-gray-600 text-sm sm:text-base'>Mock Interviews</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold text-blue-600 mb-2'>24/7</div>
                <div className='text-gray-600 text-sm sm:text-base'>AI Support</div>
              </div>
            </div>
          </div>

          {/* Companies Section */}
          <div className='text-center mb-8'>
            <h2 className='text-xl sm:text-2xl font-semibold text-gray-700 mb-4'>
              Join students who got placed at:
            </h2>
            <p className='text-gray-500 text-sm sm:text-base mb-8'>
              Our students have successfully interviewed and joined these industry leaders
            </p>
          </div>
        </div>
      </div>

      {/* Logo Carousel Section */}
      <div className='relative bg-white/50 backdrop-blur-sm border-y border-blue-100 py-8'>
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent'></div>
        <div className='relative z-10'>
          <LogoLoop
            logos={logos}
            speed={120}        // scrolling speed
            direction="left"   // scroll direction
            logoHeight={50}    // logo size
            gap={60}           // spacing between logos
            scaleOnHover       // zoom effect on hover
            pauseOnHover={false}
          />
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className='relative py-12 sm:py-16'>
        <div className='max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8'>
          <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 shadow-2xl transform hover:scale-105 transition-all duration-300'>
            <h3 className='text-2xl sm:text-3xl font-bold text-white mb-4'>
              Ready to Land Your Dream Job?
            </h3>
            <p className='text-blue-100 text-lg mb-6'>
              Start your interview preparation journey today with personalized AI coaching
            </p>
            <button className='bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg text-lg'
            onClick={handleGetStarted}
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main