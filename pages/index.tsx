import Styles from './Landing.module.scss'
import React, { useEffect, useMemo, useContext, useState, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Logo from '../src/assets/images/Logo.png'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick";
import bg from '../src/assets/images/card-img.jpg'
import arrowNext from '../src/assets/icons/chevront-r.svg'
import star from '../src/assets/icons/Vector.svg'
import dotW from '../src/assets/icons/dot.svg'
import dot2 from '../src/assets/icons/dot2.svg'
import wrapper from '../store'
import { fetchGenres, fetchNowPlaying, fetchPopular, fetchToprated, fetchTVShow } from '../store/reducers/movies'
import { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import myLoader from '../src/helpers/imageLoader'
import { useRouter } from 'next/dist/client/router'

const Home: NextPage = () => {
  const nowPlaying = useSelector(({ movies }: any) => movies?.NowPlaying)
  const topRated = useSelector(({ movies }: any) => movies?.TopRated)
  const tvShow = useSelector(({ movies }: any) => movies?.TVShow)
  const popular = useSelector(({ movies }: any) => movies?.Popular)
  const genres = useSelector(({ movies }: any) => movies?.Genres)
  const loading = useSelector(({ movies }: any) => movies?.Loading)

  const router = useRouter()

  const size = useWindowSize()

  const dispatch = useDispatch()

  const [index, setIndex] = useState(0)
  const [onHover, setOnHover] = useState<any>()
  const [settings, setSetings] = useState({
    infinite: true,
    autoplay: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current: any, next: any) => setIndex(next),
  });
  const [secondSettings, setSecondSetings] = useState({
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true,
    initialSlide: 0,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  useEffect(() => {
    dispatch(fetchNowPlaying())
    dispatch(fetchToprated())
    dispatch(fetchTVShow())
    dispatch(fetchGenres())
  }, [])

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  const ref = (divElement: any) => {
    if (divElement?.clientHeight) {
      if (offset + window.innerHeight === divElement?.clientHeight) {
        console.log('bottom');

        if (popular?.length < 1 && tvShow && tvShow?.length > 0) {
          dispatch(fetchPopular())
        }
      }
    }
  }

  const goTo = (pathname: any, query: any) => {
    router.push({ pathname, query })
  }

  const handleMouseOver = (id: any) => {
    setOnHover(id)
  }

  const handleMouseOut = (id: any) => {
    setOnHover(null)
  }


  return (
    <div className='bg-black font-sans'
      style={{ overflowY: "auto" }}
      ref={ref}
    >
      <Head>
        <title>Movie App</title>
        <link rel="icon" href="/Logo.png" />
      </Head>

      <div className="relative">
        <Slider {...settings}>
          {topRated && topRated.length > 0 && topRated.slice(0, size.width > 768 ? nowPlaying.length : 3).map((el: any, i: any) => {
            let arr = []
            let rate = 1
            if (el.vote_average > 8.5) rate = 5
            if (el.vote_average > 7 && el.vote_average <= 8.5) rate = 4
            if (el.vote_average > 6 && el.vote_average <= 7) rate = 3
            if (el.vote_average >= 5 && el.vote_average <= 6) rate = 2
            if (el.vote_average < 5) rate = 1

            for (let idx = 0; idx < rate; idx++) {
              arr.push(idx)
            }

            let genre = ''
            if (genres && genres?.length > 0 && el?.genre_ids) {
              const filter = genres.filter((item: any) => {
                return item.id === el?.genre_ids[0]
              })

              if (filter && filter?.length > 0) genre = filter[0].name

            }

            return (
              <div
                key={el.id}
                className={`${Styles.hero} relative`}
              >
                <div className="absolute top-0 left-0 w-full h-full">
                  {el.backdrop_path && el.poster_path && (
                    <Image
                      loader={myLoader}
                      src={size.width > 768 ? el.backdrop_path : el.poster_path}
                      width={size.width > 768 ? 100 : 50}
                      height={size.width > 768 ? 50 : 100}
                      className='object-cover object-center h-full'
                      layout="responsive"
                    />
                  )}
                </div>
                <div className="md:container md:mx-auto md:pt-4 md:px-24 p-4 z-100">
                  <Image
                    src={Logo}
                    width={43.24}
                    height={44}
                    className='z-50'
                  />
                  <div className="absolute top-1/3 z-50 p-4 bottom-1/2">
                    <div className='px-2 w-32 text-center rounded-tr-md rounded-bl-md' style={{ backgroundColor: "rgba(15, 239, 253, 0.1)" }}>
                      <p className={Styles.aqua}>{genre}</p>
                    </div>
                    <div className="mt-4 flex gap-4 text-white">
                      {arr?.map((item: any) => (
                        <Image
                          key={item}
                          src={star}
                          width={13.33}
                          height={12.67}
                        />
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className='text-white text-xl md:text-2xl lg:text-4xl font-bold'>{el?.title ? el?.title : el?.name}</p>
                    </div>
                    <div className="mt-4">
                      <p className='md:w-3/4 text-xs md:text-md text-justify text-white'>{el?.overview}</p>
                    </div>
                    <div className="mt-4">
                      <div onClick={() => goTo(`/detail/${el.id}`, { type: 'movie' })} className={`${Styles.watcNow} rounded-full w-64 text-center w-full px-8 py-4 cursor-pointer`}>
                        <p style={{ color: "#FFE922" }} className="text-xl">Watch Now</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

        </Slider>
        <div className="absolute bottom-10 left-auto right-auto flex gap-4 justify-center w-full">
          {nowPlaying && nowPlaying.length > 0 && nowPlaying.slice(0, size.width > 768 ? nowPlaying.length : 3).map((el: any, i: any) => (
            <div key={el.id}>
              {i === index ?
                <Image src={dotW} width={8} height={8} />
                :
                <Image src={dot2} width={8} height={8} />}
            </div>
          ))}
        </div>
      </div>

      <div className="md:mt-8 mt-4 md:container md:mx-auto md:py-12 md:px-24 px-4">
        <div className="flex justify-between items-center">
          <p className="text-xl text-white font-bold">
            New Release
          </p>
          <p className="text-yellow-600 font-bold">
            See All {'>'}
          </p>
        </div>
        <Slider {...secondSettings}>
          {nowPlaying && nowPlaying.length > 0 && nowPlaying.map((el: any) => {
            let arr = []
            let rate = 1
            if (el.vote_average > 8.5) rate = 5
            if (el.vote_average > 7 && el.vote_average <= 8.5) rate = 4
            if (el.vote_average > 6 && el.vote_average <= 7) rate = 3
            if (el.vote_average >= 5 && el.vote_average <= 6) rate = 2
            if (el.vote_average < 5) rate = 1

            for (let idx = 0; idx < rate; idx++) {
              arr.push(idx)
            }

            let genre = ''
            if (genres && genres?.length > 0 && el?.genre_ids) {
              const filter = genres.filter((item: any) => {
                return item.id === el?.genre_ids[0]
              })

              if (filter && filter?.length > 0) genre = filter[0].name

            }

            return (
              <div key={el.id} onMouseOver={() => handleMouseOver(el.id)} onMouseOut={handleMouseOut} onDoubleClick={() => goTo(`/detail/${el.id}`, { type: 'movie' })} className={`h-96 p-4 cursor-pointer`}>
                <div className={`${Styles.bgLinear} relative`}>
                  {el.poster_path && (
                    <Image
                      loader={myLoader}
                      src={el.poster_path}
                      width={46}
                      height={74}
                      className={`${Styles.image} object-cover object-center`}
                      layout="responsive"
                    />
                  )}

                  <div className="absolute z-50 w-full bottom-2 left-0 px-2">
                    <div className={onHover === el.id ? Styles.tramformY : Styles.tramformYToNull}>
                      <div className='w-32 text-center rounded-tr-md rounded-bl-md' style={{ backgroundColor: "rgba(15, 239, 253, 0.1)" }}>
                        <p className={`${Styles.aqua} text-sm`}>{genre}</p>
                      </div>
                      <div className="">
                        {arr?.map((item: any) => (
                          <Image
                            key={item}
                            src={star}
                            width={13.33}
                            height={12.67}
                          />
                        ))}
                      </div>
                      <div className="mt-2">
                        <p className="text-white font-bold">{el?.title}</p>
                      </div>
                    </div>

                    <div className={`${onHover === el.id ? `${Styles.hoverOpacity} mt-2` : Styles.hoverOpacityToNull}`}>
                      <p className="text-yellow-500">Watch now {'>'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </Slider>
      </div>

      <div
        className="md:mt-8 mt-4 md:container md:mx-auto md:py-12 md:px-24 px-4">
        <div className="flex justify-between items-center">
          <p className="text-xl text-white font-bold">
            TV Show
          </p>
          <p className="text-yellow-600 font-bold">
            See All {'>'}
          </p>
        </div>
        <Slider {...secondSettings}>
          {tvShow && tvShow.length > 0 && tvShow.map((el: any) => {
            let arr = []
            let rate = 1
            if (el.vote_average > 8.5) rate = 5
            if (el.vote_average > 7 && el.vote_average <= 8.5) rate = 4
            if (el.vote_average > 6 && el.vote_average <= 7) rate = 3
            if (el.vote_average >= 5 && el.vote_average <= 6) rate = 2
            if (el.vote_average < 5) rate = 1

            for (let idx = 0; idx < rate; idx++) {
              arr.push(idx)
            }

            let genre = ''
            if (genres && genres?.length > 0 && el?.genre_ids) {
              const filter = genres.filter((item: any) => {
                return item.id === el?.genre_ids[0]
              })

              if (filter && filter?.length > 0) genre = filter[0].name

            }

            return (
              <div key={el.id} onDoubleClick={() => goTo(`/detail/${el.id}`, { type: 'tv' })} onMouseOver={() => handleMouseOver(el.id)} onMouseOut={handleMouseOut} className={`h-96 p-4 cursor-pointer`}>
                <div className={`${Styles.bgLinear} relative`}>
                  {el?.poster_path && (
                    <Image
                      loader={myLoader}
                      src={el.poster_path}
                      width={46}
                      height={74}
                      className='object-cover object-center'
                      layout="responsive"
                    />
                  )}

                  <div className="absolute z-50 w-full bottom-2 left-0 px-2">
                    <div className={onHover === el.id ? Styles.tramformY : Styles.tramformYToNull}>
                      <div className='w-32 text-center rounded-tr-md rounded-bl-md' style={{ backgroundColor: "rgba(15, 239, 253, 0.1)" }}>
                        <p className={`${Styles.aqua} text-sm`}>{genre}</p>
                      </div>
                      <div className="">
                        {arr?.map((item: any) => (
                          <Image
                            key={item}
                            src={star}
                            width={13.33}
                            height={12.67}
                          />
                        ))}
                      </div>
                      <div className="mt-2">
                        <p className="text-white font-bold">{el?.name}</p>
                      </div>
                    </div>

                    <div className={`${onHover === el.id ? `${Styles.hoverOpacity} mt-2` : Styles.hoverOpacityToNull}`}>
                      <p className="text-yellow-500">Watch now {'>'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </Slider>
      </div>

      {!loading && popular && popular?.length > 0 ? (
        <div
          className="md:mt-8 mt-4 md:container md:mx-auto md:py-12 md:px-24 px-4">
          <div className="flex justify-between items-center">
            <p className="text-xl text-white font-bold">
              Popular
            </p>
            <p className="text-yellow-600 font-bold">
              See All {'>'}
            </p>
          </div>
          <Slider {...secondSettings}>
            {popular.map((el: any) => {
              let arr = []
              let rate = 1
              if (el.vote_average > 8.5) rate = 5
              if (el.vote_average > 7 && el.vote_average <= 8.5) rate = 4
              if (el.vote_average > 6 && el.vote_average <= 7) rate = 3
              if (el.vote_average >= 5 && el.vote_average <= 6) rate = 2
              if (el.vote_average < 5) rate = 1

              for (let idx = 0; idx < rate; idx++) {
                arr.push(idx)
              }

              let genre = ''
              if (genres && genres?.length > 0 && el?.genre_ids) {
                const filter = genres.filter((item: any) => {
                  return item.id === el?.genre_ids[0]
                })

                if (filter && filter?.length > 0) genre = filter[0].name

              }

              return (
                <div key={el.id} onDoubleClick={() => goTo(`/detail/${el.id}`, { type: 'movie' })} onMouseOver={() => handleMouseOver(el.id)} onMouseOut={handleMouseOut} className={`h-96 p-4 cursor-pointer`}>
                  <div className={`${Styles.bgLinear} relative`}>
                    {el?.poster_path && (
                      <Image
                        loader={myLoader}
                        src={el.poster_path}
                        width={46}
                        height={74}
                        className='object-cover object-center'
                        layout="responsive"
                      />
                    )}
                    <div className="absolute z-50 w-full bottom-2 left-0 px-2">
                      <div className={onHover === el.id ? Styles.tramformY : Styles.tramformYToNull}>

                        <div className='w-32 text-center rounded-tr-md rounded-bl-md' style={{ backgroundColor: "rgba(15, 239, 253, 0.1)" }}>
                          <p className={`${Styles.aqua} text-sm`}>{genre}</p>
                        </div>
                        <div className="">
                          {arr?.map((item: any) => (
                            <Image
                              key={item}
                              src={star}
                              width={13.33}
                              height={12.67}
                            />
                          ))}
                        </div>
                        <div className="mt-2">
                          <p className="text-white font-bold">{el?.title}</p>
                        </div>
                      </div>

                      <div className={`${onHover === el.id ? `${Styles.hoverOpacity} mt-2` : Styles.hoverOpacityToNull}`}>
                        <p className="text-yellow-500">Watch now {'>'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </Slider>
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <div className={`${Styles.loading}`}></div>
          </div>
          <div className="text-center">
            <p className='text-white'>loading more movies for you...</p>
          </div>
        </div>
      )}


    </div>
  )
}

const NextArrow = ({ className, style, onClick }: any) => {
  return (
    <div className='absolute cursor-pointer right-4 top-1/2' onClick={onClick}>
      <Image
        src={arrowNext}
        width={20}
        height={20}
      />
    </div>
  )
}

const PrevArrow = ({ className, style, onClick }: any) => {
  return (
    <div style={{ transform: "rotate(180deg)" }} className='absolute cursor-pointer left-4 z-50 top-1/2' onClick={onClick}>
      <Image
        src={arrowNext}
        width={20}
        height={20}
      />
    </div>
  )
}

Home.getInitialProps = wrapper.getInitialPageProps(store => () => {
  const { dispatch } = store
  dispatch(fetchToprated())
  dispatch(fetchNowPlaying())
  dispatch(fetchTVShow())
  dispatch(fetchGenres())
})

export default Home

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
