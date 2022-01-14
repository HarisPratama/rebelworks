import { combineReducers, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createWrapper, Context } from 'next-redux-wrapper'
import moviesReducer from './reducers/movies'

const reducers = combineReducers({
    movies: moviesReducer
})

const store = (context: Context) => createStore(reducers, applyMiddleware(thunk))

const wrapper = createWrapper(store, { debug: true })

export default wrapper