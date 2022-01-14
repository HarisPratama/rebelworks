import { NextPage } from 'next'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Styles from './styles.module.scss'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { fetchCast, fetchEpisodes, fetchMovie, fetchRecomendations, fetchRecomendationsTVShow, fetchTv, fetchGenres } from '../../store/reducers/movies'
import Logo from '../../src/assets/images/Logo.png'
import Image from 'next/image'
import myLoader from '../../src/helpers/imageLoader'
import star from '../../src/assets/icons/Vector.svg'
import btn from '../../src/assets/icons/btn.svg'
import Slider from "react-slick";
import wrapper from '../../store'

const DetailMovie: NextPage = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { id, type } = router.query

    const [index, setIndex] = useState(4)
    const [seasons, setSeasons] = useState<any>([])
    const [onHover, setOnHover] = useState<any>()

    const movie = useSelector(({ movies }: any) => movies?.Movie)
    const tv = useSelector(({ movies }: any) => movies?.Tv)
    const recomendations = useSelector(({ movies }: any) => movies?.Recomendations)
    const cast = useSelector(({ movies }: any) => movies?.Cast)
    const episodes = useSelector(({ movies }: any) => movies?.Episodes)
    const genres = useSelector(({ movies }: any) => movies?.Genres)
    const loading = useSelector(({ movies }: any) => movies?.Loading)

    const secondSettings = {
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
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
    }

    const [rates, setRates] = useState<any>([])

    useEffect(() => {
        if (id && type == "movie") {
            dispatch(fetchMovie(id))
            dispatch(fetchRecomendations(id))
        }

        if (id && type) dispatch(fetchCast(id, type))

        if (id && type == "tv") {
            dispatch(fetchTv(id))
            dispatch(fetchRecomendationsTVShow(id))
        }

        if (id) dispatch(fetchGenres())

    }, [id])

    useEffect(() => {
        if (movie && movie?.vote_average) {
            let arr = []
            let rate = 1
            if (movie.vote_average > 8.5) rate = 5
            if (movie.vote_average > 7 && movie.vote_average <= 8.5) rate = 4
            if (movie.vote_average > 6 && movie.vote_average <= 7) rate = 3
            if (movie.vote_average >= 5 && movie.vote_average <= 6) rate = 2
            if (movie.vote_average < 5) rate = 1

            for (let idx = 0; idx < rate; idx++) {
                arr.push(idx)
            }

            setRates(arr)
        }
    }, [movie])

    useEffect(() => {
        if (tv && tv?.vote_average) {
            let arr = []
            let rate = 1
            if (tv.vote_average > 8.5) rate = 5
            if (tv.vote_average > 7 && tv.vote_average <= 8.5) rate = 4
            if (tv.vote_average > 6 && tv.vote_average <= 7) rate = 3
            if (tv.vote_average >= 5 && tv.vote_average <= 6) rate = 2
            if (tv.vote_average < 5) rate = 1

            for (let idx = 0; idx < rate; idx++) {
                arr.push(idx)
            }

            setRates(arr)

            if (tv?.number_of_seasons) {
                dispatch(fetchEpisodes(id, 1))

                let season = []
                for (let i = 1; i <= +tv?.number_of_seasons; i++) {
                    season.push(i)
                }

                setSeasons(season)
            }
        }
    }, [tv])

    const getEpisodes = (e: any) => {
        if (+e?.target?.value) dispatch(fetchEpisodes(id, +e?.target?.value))
    }

    const goTo = (pathname: any, query: any = {}) => {
        router.push({ pathname, query })
    }

    const handleMouseOver = (id: any) => {
        setOnHover(id)
    }

    const handleMouseOut = (id: any) => {
        setOnHover(null)
    }

    return (
        <div className="bg-black py-4 font-sans">
            <div className="md:container md:mx-auto md:px-24 px-4">
                <div className="cursor-pointer" onClick={() => goTo('/')} >
                    <Image
                        src={Logo}
                        width={43.24}
                        height={44}
                        className='z-50'
                    />
                </div>

                {movie && type == 'movie' && movie?.backdrop_path && (
                    <div>
                        <div className="mt-4 md:flex gap-4">
                            <div className={`${Styles.bgLinear} md:w-1/4 w-full h-full block relative`}>
                                {movie?.poster_path && (
                                    <Image
                                        loader={myLoader}
                                        src={movie.poster_path}
                                        width={46}
                                        height={74}
                                        className='object-cover object-center'
                                        layout="responsive"
                                    />
                                )}
                                <div className="absolute z-50 w-full bottom-2 left-0 px-2">
                                    <div className='w-24 text-center py-1 rounded-tr-md rounded-bl-md' style={{ backgroundColor: "rgba(15, 239, 253, 0.1)" }}>
                                        <p className={`${Styles.aqua} text-xs`}>{movie?.genres && movie?.genres?.length > 0 ? movie?.genres[0]?.name : ''}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {rates?.map((item: any) => (
                                            <Image
                                                key={item}
                                                src={star}
                                                width={13.33}
                                                height={12.67}
                                            />
                                        ))}
                                        <p className="text-gray-300">Release Year: {movie?.release_date ? movie?.release_date.split('-')[0] : ''}</p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-white font-bold">{movie?.title}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='md:w-3/4 w-full'>
                                <div className="md:flex gap-4">
                                    <div className='md:w-3/4'>
                                        <p className="text-white font-bold md:text-2xl">Synopsis</p>
                                        <div className="mt-4 p-4" style={{ backgroundColor: '#242424' }}>
                                            <p className='text-gray-300'>{movie?.overview}</p>
                                        </div>
                                    </div>
                                    <div className='md:w-1/4'>
                                        <p className='text-gray-400'>Cast</p>
                                        <ul className='mt-4'>
                                            {cast && cast.length > 0 && cast.slice(0, index).map((el: any) => (
                                                <li className='text-white' key={el.id}>{el.name}</li>
                                            ))}
                                            {cast && cast.length > 0 && index < cast.length && (
                                                <li onClick={() => setIndex(index + 4)} className='text-yellow-600 cursor-pointer'>more</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <p className="text-white font-bold md:text-2xl">Episodes</p>
                                    <div className="flex gap-4 mt-4">
                                        <div className='relative w-1/4 block w-full h-full'>
                                            {movie?.backdrop_path && (
                                                <Image
                                                    loader={myLoader}
                                                    src={movie.backdrop_path}
                                                    width={200}
                                                    height={100}
                                                    className='object-cover object-center'
                                                    layout="responsive"
                                                />
                                            )}
                                            <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center cursor-pointer">
                                                <Image
                                                    src={btn}
                                                    width={40}
                                                    height={40}
                                                    className='object-cover object-center'
                                                />
                                            </div>
                                        </div>
                                        <div className='w-3/4'>
                                            <p className="text-white font-bold">1 {movie?.title}</p>
                                            <p className="text-gray-300">{movie?.overview ? movie?.overview.split('.')[0] : ''}</p>
                                        </div>
                                    </div>

                                    <div className="h-px mt-4 w-full bg-gray-600"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {tv && type == 'tv' && tv?.backdrop_path && (
                    <div>
                        <div className="mt-4 md:flex gap-4">
                            <div className={`${Styles.bgLinear} md:w-1/4 w-full h-full block relative`}>
                                {tv?.poster_path && (
                                    <Image
                                        loader={myLoader}
                                        src={tv.poster_path}
                                        width={46}
                                        height={74}
                                        className='object-cover object-center'
                                        layout="responsive"
                                    />
                                )}
                                <div className="absolute z-50 w-full bottom-2 left-0 px-2">
                                    <div className='w-24 text-center py-1 rounded-tr-md rounded-bl-md' style={{ backgroundColor: "rgba(15, 239, 253, 0.1)" }}>
                                        <p className={`${Styles.aqua} text-xs`}>{tv?.genres && tv?.genres?.length > 0 ? tv?.genres[0]?.name : ''}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {rates?.map((item: any) => (
                                            <Image
                                                key={item}
                                                src={star}
                                                width={13.33}
                                                height={12.67}
                                            />
                                        ))}
                                        <p className="text-gray-300">Release Year: {tv?.first_air_date ? tv.first_air_date.split('-')[0] : ''}</p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-white font-bold">{tv?.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='md:w-3/4 w-full'>
                                <div className="md:flex gap-4">
                                    <div className='md:w-3/4'>
                                        <p className="text-white font-bold md:text-2xl">Synopsis</p>
                                        <div className="mt-4 p-4" style={{ backgroundColor: '#242424' }}>
                                            <p className='text-gray-300'>{tv?.overview}</p>
                                        </div>
                                    </div>
                                    <div className='md:w-1/4'>
                                        <p className='text-gray-400'>Cast</p>
                                        <ul className='mt-4'>
                                            {cast && cast.length > 0 && cast.slice(0, index).map((el: any) => (
                                                <li className='text-white' key={el.id}>{el.name}</li>
                                            ))}
                                            {cast && cast.length > 0 && index < cast.length && (
                                                <li onClick={() => setIndex(index + 4)} className='text-yellow-600 cursor-pointer'>more</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <div className="flex gap-4">
                                        <p className="text-white font-bold md:text-2xl">Episodes</p>
                                        <select style={{ backgroundColor: '#242424' }} onChange={getEpisodes} className='text-white pr-8 pl-2'>
                                            {type === 'tv' && seasons && seasons.length > 0 && seasons.map((el: any) => (
                                                <option key={el} value={el}>Season {el}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {episodes && episodes?.episodes && episodes?.episodes?.length > 0 && episodes?.episodes?.map((el: any) => (
                                        <div key={el.id}>
                                            <div className="flex gap-4 mt-4">
                                                <div className='relative w-1/4 block w-full h-full'>
                                                    {el.still_path ? (
                                                        <Image
                                                            loader={myLoader}
                                                            src={el?.still_path}
                                                            width={200}
                                                            height={100}
                                                            className='object-cover object-center'
                                                            layout="responsive"
                                                        />
                                                    ) : (
                                                        <>
                                                            {episodes?.poster_path && <Image
                                                                loader={myLoader}
                                                                src={episodes.poster_path}
                                                                width={200}
                                                                height={100}
                                                                className='object-cover object-center'
                                                                layout="responsive"
                                                            />}

                                                            {tv?.backdrop_path && !episodes?.poster_path && <Image
                                                                loader={myLoader}
                                                                src={tv.backdrop_path}
                                                                width={200}
                                                                height={100}
                                                                className='object-cover object-center'
                                                                layout="responsive"
                                                            />}
                                                        </>
                                                    )}
                                                    <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center cursor-pointer">
                                                        <Image
                                                            src={btn}
                                                            width={40}
                                                            height={40}
                                                            className='object-cover object-center'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='w-3/4'>
                                                    <p className="text-white font-bold">{el?.episode_number} {el?.name}</p>
                                                    <p className="text-gray-300">{el?.overview ? el?.overview?.split('.')[0] : ''}</p>
                                                </div>
                                            </div>
                                            <div className="h-px mt-4 w-full bg-gray-600"></div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="md:mt-24 mt-8">
                    <div className="flex justify-between items-center">
                        <p className="text-xl text-white font-bold">
                            You Might Also Like This!
                        </p>
                        <p className="text-yellow-600 font-bold">
                            See All {'>'}
                        </p>
                    </div>
                    {recomendations && recomendations.length > 0 && (
                        <Slider {...secondSettings}>
                            {recomendations.map((el: any) => {
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
                                    <div key={el.id} onDoubleClick={() => goTo(`/detail/${el.id}`, { type })} onMouseOver={() => handleMouseOver(el.id)} onMouseOut={handleMouseOut} className={`h-96 p-4 cursor-pointer`}>
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
                                                        <p className="text-white font-bold">{el?.title ? el?.title : el?.name}</p>
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
                    )}
                </div>
            </div>
        </div >
    )
}

DetailMovie.getInitialProps = wrapper.getInitialPageProps(store => ({ pathname, query }) => {
    const { dispatch } = store
    if (query?.id && query?.type == "movie") {
        dispatch(fetchMovie(query?.id))
        dispatch(fetchRecomendations(query?.id))
    }

    if (query?.id && query?.type) dispatch(fetchCast(query?.id, query?.type))

    if (query?.id && query?.type == "tv") {
        dispatch(fetchTv(query?.id))
        dispatch(fetchRecomendationsTVShow(query?.id))
    }

    dispatch(fetchGenres())
})

export default DetailMovie
