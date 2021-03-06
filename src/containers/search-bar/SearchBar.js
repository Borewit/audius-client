import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { matchPath } from 'react-router'
import { has } from 'lodash'
import { make } from 'store/analytics/actions'
import { Name } from 'services/analytics'

import { fetchSearch, cancelFetchSearch, clearSearch } from './store/actions'
import { trackPage, albumPage, playlistPage, profilePage } from 'utils/route'
import { push as pushRoute } from 'connected-react-router'
import { getSearch } from 'containers/search-bar/store/selectors'
import styles from './SearchBar.module.css'
import { SquareSizes } from 'models/common/ImageSizes'
import placeholderArt from 'assets/img/imageBlank2x.png'
import profilePicEmpty from 'assets/img/imageProfilePicEmpty2X.png'

import Bar from 'components/search/SearchBar'

class SearchBar extends Component {
  state = {
    value: ''
  }

  componentDidMount() {
    const { history, location } = this.props

    // Clear search when navigating away from the search results page.
    history.listen((location, action) => {
      const match = matchPath(location.pathname, {
        path: '/search/:query'
      })
      if (!match) {
        this.onSearchChange('')
      }
    })

    // Set the initial search bar value if we loaded into a search page.
    const match = matchPath(location.pathname, {
      path: '/search/:query'
    })
    if (has(match, 'params.query')) {
      this.onSearchChange(match.params.query)
    }
  }

  isTagSearch = () => this.state.value[0] === '#'

  onSearchChange = (value, fetch) => {
    if (value.trim().length === 0) {
      // If the user erases the entire search content, clear the search store
      // so that on the next search a new dataSource triggers animation of the dropdown.
      this.props.clearSearch()
      this.setState({ value: '' })
      return
    }

    if (!this.isTagSearch() && fetch) {
      this.props.fetchSearch(value)
    }
    this.setState({ value })
  }

  onSubmit = value => {
    // Encode everything besides tag searches
    if (!value.startsWith('#')) {
      value = encodeURIComponent(value)
    }
    const pathname = `/search/${value}`
    this.props.history.push({
      pathname,
      state: {}
    })
  }

  onSelect = value => {
    const { id, kind } = (() => {
      const selectedUser = this.props.search.users.find(
        u => value === profilePage(u.handle)
      )
      if (selectedUser) return { kind: 'profile', id: selectedUser.user_id }
      const selectedTrack = this.props.search.tracks.find(
        t =>
          value ===
          (t.user ? trackPage(t.user.handle, t.title, t.track_id) : '')
      )
      if (selectedTrack) return { kind: 'track', id: selectedTrack.track_id }
      const selectedPlaylist = this.props.search.playlists.find(
        p =>
          value ===
          (p.user
            ? playlistPage(p.user.handle, p.playlist_name, p.playlist_id)
            : '')
      )
      if (selectedPlaylist)
        return { kind: 'playlist', id: selectedPlaylist.playlist_id }
      const selectedAlbum = this.props.search.albums.find(
        a =>
          value ===
          (a.user
            ? albumPage(a.user.handle, a.playlist_name, a.playlist_id)
            : '')
      )
      if (selectedAlbum) return { kind: 'album', id: selectedAlbum.playlist_id }
      return {}
    })()
    this.props.recordSearchResultClick({
      term: this.props.search.searchText,
      kind,
      id,
      source: 'autocomplete'
    })
  }

  render() {
    if (!this.props.search.tracks) {
      this.props.search.tracks = []
    }
    const dataSource = {
      sections: [
        {
          title: 'Profiles',
          children: this.props.search.users.map(user => {
            return {
              key: profilePage(user.handle),
              primary: user.name || user.handle,
              id: user.user_id,
              imageMultihash:
                user.profile_picture_sizes || user.profile_picture,
              size: user.profile_picture_sizes
                ? SquareSizes.SIZE_150_BY_150
                : null,
              creatorNodeEndpoint: user.creator_node_endpoint,
              defaultImage: profilePicEmpty,
              isVerifiedUser: user.is_verified
            }
          })
        },
        {
          title: 'Tracks',
          children: this.props.search.tracks.map(track => {
            return {
              key: track.user
                ? trackPage(track.user.handle, track.title, track.track_id)
                : '',
              primary: track.title,
              secondary: track.user ? track.user.name : '',
              id: track.track_id,
              imageMultihash: track.cover_art_sizes || track.cover_art,
              size: track.cover_art_sizes ? SquareSizes.SIZE_150_BY_150 : null,
              creatorNodeEndpoint: track.user
                ? track.user.creator_node_endpoint
                : '',
              defaultImage: placeholderArt,
              imageUrl: track.cover_art_url,
              isVerifiedUser: track.user ? track.user.is_verified : false
            }
          })
        },
        {
          title: 'Playlists',
          children: this.props.search.playlists.map(playlist => {
            return {
              primary: playlist.playlist_name,
              secondary: playlist.user ? playlist.user.name : '',
              key: playlist.user
                ? playlistPage(
                    playlist.user.handle,
                    playlist.playlist_name,
                    playlist.playlist_id
                  )
                : '',
              id: playlist.playlist_id,
              imageMultihash:
                playlist.playlist_image_sizes_multihash ||
                playlist.playlist_image_multihash,
              size: playlist.playlist_image_sizes_multihash
                ? SquareSizes.SIZE_150_BY_150
                : null,
              defaultImage: placeholderArt,
              creatorNodeEndpoint: playlist.user
                ? playlist.user.creator_node_endpoint
                : '',
              isVerifiedUser: playlist.user ? playlist.user.is_verified : false
            }
          })
        },
        {
          title: 'Albums',
          children: this.props.search.albums.map(album => {
            return {
              key: album.user
                ? albumPage(
                    album.user.handle,
                    album.playlist_name,
                    album.playlist_id
                  )
                : '',
              primary: album.playlist_name,
              secondary: album.user ? album.user.name : '',
              id: album.playlist_id,
              imageMultihash:
                album.playlist_image_sizes_multihash ||
                album.playlist_image_multihash,
              size: album.playlist_image_sizes_multihash
                ? SquareSizes.SIZE_150_BY_150
                : null,
              defaultImage: placeholderArt,
              creatorNodeEndpoint: album.user
                ? album.user.creator_node_endpoint
                : '',
              isVerifiedUser: album.user ? album.user.is_verified : false
            }
          })
        }
      ]
    }
    const resultsCount = dataSource.sections.reduce(
      (count, section) => count + section.children.length,
      0
    )
    const { status, searchText } = this.props.search
    return (
      <div className={styles.search}>
        <Bar
          value={this.state.value}
          isTagSearch={this.isTagSearch()}
          status={status}
          searchText={searchText}
          dataSource={dataSource}
          resultsCount={resultsCount}
          onSelect={this.onSelect}
          onSearch={this.onSearchChange}
          onCancel={this.props.cancelFetchSearch}
          onSubmit={this.onSubmit}
          goToRoute={this.props.goToRoute}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  search: getSearch(state, props)
})
const mapDispatchToProps = dispatch => ({
  fetchSearch: value => dispatch(fetchSearch(value)),
  cancelFetchSearch: () => dispatch(cancelFetchSearch()),
  clearSearch: () => dispatch(clearSearch()),
  goToRoute: route => dispatch(pushRoute(route)),
  recordSearchResultClick: ({ term, kind, id, source }) =>
    dispatch(make(Name.SEARCH_RESULT_SELECT, { term, kind, id, source }))
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchBar)
)
