import { initialLineupState } from 'store/lineup/reducer'
import { RESET_SUCCEEDED, stripPrefix } from 'store/lineup/actions'
import {
  PREFIX,
  SET_TRENDING_SCORES,
  TRENDING_WEEK_PREFIX,
  TRENDING_MONTH_PREFIX,
  TRENDING_YEAR_PREFIX
} from './actions'

const initialState = {
  ...initialLineupState,
  antiBot: true,
  dedupe: true,
  prefix: PREFIX,

  // Array<{
  //   track_id,
  // }>
  trendingOrder: [],
  // { track_id:
  //   {
  //    listens,
  //    repost_count,
  //    save_count,
  //    track_owner_follower_count,
  //   }
  // }
  trendingStats: []
}

const makeActionsMap = initialState => {
  return {
    [RESET_SUCCEEDED](state, action) {
      const newState = initialState
      return newState
    },
    [SET_TRENDING_SCORES](state, action) {
      return {
        ...state,
        trendingOrder: action.trendingOrder,
        trendingStats: action.trendingStats
      }
    }
  }
}

const makeTrendingReducer = prefix => {
  const newInitialState = { ...initialState, entryIds: new Set([]), prefix }
  const newActionsMap = makeActionsMap(newInitialState)

  return (state = newInitialState, action) => {
    const baseActionType = stripPrefix(prefix, action.type)
    const matchingReduceFunction = newActionsMap[baseActionType]
    if (!matchingReduceFunction) return state
    return matchingReduceFunction(state, action)
  }
}

export const trendingWeek = makeTrendingReducer(TRENDING_WEEK_PREFIX)
export const trendingMonth = makeTrendingReducer(TRENDING_MONTH_PREFIX)
export const trendingYear = makeTrendingReducer(TRENDING_YEAR_PREFIX)
