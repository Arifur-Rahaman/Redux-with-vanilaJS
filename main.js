import thunk from 'redux-thunk'
import './src/scss/style.scss'
import { createStore, combineReducers, applyMiddleware } from 'redux'

const count = document.getElementById('count')
const incrementButton = document.getElementById('btn-increment')
const decrementButton = document.getElementById('btn-decrement')

//***Counter reducer function ***/
function counterReducer1(state={value: 0}, action) { 
  switch (action.type) {
    case 'counter/incremented':
      return { value: state.value + 1 }
    case 'counter/decremented':
      return { value: state.value - 1 }
    default:
      return state
  }
}

//***Product reducer function***/
function productReducer(state={product:{loading:false, products:[], error:''}}, action){
  switch (action.type) {
    case 'product/fetching':
      return {...state, loading: true}
    case 'product/fetched':
      return { ...state, loading: false,  products: action.payload}
      case 'product/error':
        return { ...state, loading: false, error:action.payload}
    default:
      return state
  }
}

//***Combine the reducers***/
const rootReducer = combineReducers({counter1: counterReducer1, product: productReducer})

//***Creating store ***/
let store = createStore(rootReducer, {counter1:{value:0}, product:{products:[], loading: true, error: ''}}, applyMiddleware(thunk))

//***Subscribe the store to get update on the ui when the store get updated ***/
store.subscribe(() =>{
    count.innerText = store.getState().counter1.value
    console.log(store.getState())
})


const fetchData = ()=>{
  return (dispatch)=>{
    dispatch({type: 'product/fetching'})
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => dispatch({type: 'product/fetched', payload: json}))
  }
}

incrementButton.onclick = ()=>{store.dispatch({ type: 'counter/incremented' })}
decrementButton.onclick = ()=>{store.dispatch({ type: 'counter/decremented' })}
store.dispatch(fetchData())