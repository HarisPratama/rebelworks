import axios from "../../src/axios/config"

const initialState = {
    NowPlaying: [],
    TopRated: [],
    TVShow: [],
    Popular: [],
    Loading: false,
    Movie: {},
    Tv: {},
    Recomendations: [],
    Cast: [],
    Genres: [],
    Episodes: []
}

export default function moviesReducer(state = initialState, action: any) {
    switch (action.type) {
        case "SET_NOW_PLAYING":
            return { ...state, NowPlaying: action.payload }
        case "SET_TOP_RATED":
            return { ...state, TopRated: action.payload }
        case "SET_TV_SHOW":
            return { ...state, TVShow: action.payload }
        case "SET_POPULAR":
            return { ...state, Popular: action.payload }
        case "SET_MOVIE":
            return { ...state, Movie: action.payload }
        case "SET_TV":
            return { ...state, Tv: action.payload }
        case "SET_RECOMENDATIONS":
            return { ...state, Recomendations: action.payload }
        case "SET_CAST":
            return { ...state, Cast: action.payload }
        case "SET_GENRES":
            return { ...state, Genres: action.payload }
        case "SET_EPISODES":
            return { ...state, Episodes: action.payload }
        case "SET_LOADING":
            return { ...state, Loading: action.payload }
        default:
            return state
    }
}

export function fetchNowPlaying(page: number = 1) {
    return async (dispatch: any) => {
        const res = await axios.get(`/movie/now_playing?api_key=${process.env.api_key}&language=en-US&page=${page}`)

        if (res.status === 200) {
            dispatch({ type: "SET_NOW_PLAYING", payload: res.data.results })
        }
    }
}

export function fetchToprated(page: number = 1) {
    return async (dispatch: any) => {
        const res = await axios.get(`/movie/top_rated?api_key=${process.env.api_key}&language=en-US&page=${page}`)


        if (res.status === 200) {
            dispatch({ type: "SET_TOP_RATED", payload: res.data.results })
        }
    }
}

export function fetchTVShow(page: number = 1) {
    return async (dispatch: any) => {
        const res = await axios.get(`/tv/popular?api_key=${process.env.api_key}&language=en-US&page=${page}`)

        if (res.status === 200) {
            dispatch({ type: "SET_TV_SHOW", payload: res.data.results })
        }
    }
}

export function fetchPopular(page: number = 1) {
    return async (dispatch: any) => {
        dispatch({ type: "SET_LOADING", payload: true })

        const res = await axios.get(`/movie/popular?api_key=${process.env.api_key}&language=en-US&page=${page}`)

        if (res.status === 200) {
            dispatch({ type: "SET_POPULAR", payload: res.data.results })
        }

        dispatch({ type: "SET_LOADING", payload: false })
    }
}

export function fetchMovie(id: any) {
    return async (dispatch: any) => {
        dispatch({ type: "SET_LOADING", payload: true })

        const res = await axios.get(`/movie/${id}?api_key=${process.env.api_key}`)

        if (res.status === 200) {
            dispatch({ type: "SET_MOVIE", payload: res.data })
        }

        dispatch({ type: "SET_LOADING", payload: false })
    }
}

export function fetchTv(id: any) {
    return async (dispatch: any) => {

        const res = await axios.get(`/tv/${id}?api_key=${process.env.api_key}`)

        if (res.status === 200) {
            dispatch({ type: "SET_TV", payload: res.data })
        }

    }
}

export function fetchRecomendations(id: any, page: any = 1) {
    return async (dispatch: any) => {
        const res = await axios.get(`/movie/${id}/recommendations?api_key=${process.env.api_key}&language=en-US&page=${page}`)

        if (res.status === 200) {
            dispatch({ type: "SET_RECOMENDATIONS", payload: res.data.results })
        }

    }
}

export function fetchRecomendationsTVShow(id: any, page: any = 1) {
    return async (dispatch: any) => {
        const res = await axios.get(`/tv/${id}/recommendations?api_key=${process.env.api_key}&language=en-US&page=${page}`)

        if (res.status === 200) {
            dispatch({ type: "SET_RECOMENDATIONS", payload: res.data.results })
        }

    }
}

export function fetchCast(id: any, type: any) {
    return async (dispatch: any) => {
        const res = await axios.get(`/${type}/${id}/credits?api_key=${process.env.api_key}&language=en-US`)

        if (res.status === 200) {
            dispatch({ type: "SET_CAST", payload: res.data.cast })
        }
    }
}

export function fetchGenres() {
    return async (dispatch: any) => {
        const res = await axios.get(`/genre/movie/list?api_key=${process.env.api_key}&language=en-US`)

        if (res.status === 200) {
            dispatch({ type: "SET_GENRES", payload: res.data.genres })
        }
    }
}

export function fetchEpisodes(id: any, seasone: any) {
    return async (dispatch: any) => {
        console.log(id, '===', seasone, 'here << ');

        const res = await axios.get(`/tv/${id}/season/${seasone}?api_key=${process.env.api_key}&language=en-US`)
        console.log(res.status, "<< status");

        if (res.status === 200) {
            console.log(res.data, "<< res.data");

            dispatch({ type: "SET_EPISODES", payload: res.data })
        }
    }
}