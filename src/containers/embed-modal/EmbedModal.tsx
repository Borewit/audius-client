import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { Button, ButtonType } from '@audius/stems'

import { close } from './store/actions'
import { getIsOpen, getId, getKind, getMetadata } from './store/selectors'

import styles from './EmbedModal.module.css'
import { AppState } from 'store/types'
import { Size } from './types'
import { Dispatch } from 'redux'
import { PlayableType, ID } from 'models/common/Identifiers'

import AudiusModal from 'components/general/AudiusModal'
import TabSlider from 'components/data-entry/TabSlider'
import EmbedCopy from './components/EmbedCopy'
import EmbedFrame from './components/EmbedFrame'
import { BASE_GA_URL } from 'utils/route'
import Collection from 'models/Collection'
import Track from 'models/Track'
import { useRecord, make } from 'store/analytics/actions'
import { Name } from 'services/analytics'

const BASE_EMBED_URL = `${BASE_GA_URL}/embed`

const FlavorMap = {
  [Size.STANDARD]: 'card',
  [Size.COMPACT]: 'compact'
}

const KindMap = {
  [PlayableType.TRACK]: 'track',
  [PlayableType.PLAYLIST]: 'playlist',
  [PlayableType.ALBUM]: 'album'
}

const constructUrl = (
  kind: PlayableType,
  id: ID,
  metadata: Track | Collection,
  size: Size
) => {
  const ownerId =
    'track_id' in metadata ? metadata.owner_id : metadata.playlist_owner_id

  return `${BASE_EMBED_URL}/${KindMap[kind]}?id=${id}&ownerId=${ownerId}&flavor=${FlavorMap[size]}`
}

const formatIFrame = (url: string, size: Size) => {
  const sizeString =
    size === Size.STANDARD
      ? 'width="100%" height="480"'
      : 'width="100%" height="120"'
  return `<iframe src=${url} ${sizeString} allow="encrypted-media" style="border: none;"></iframe>`
}

const messages = {
  title: {
    [PlayableType.TRACK]: 'Embed Track',
    [PlayableType.PLAYLIST]: 'Embed Playlist',
    [PlayableType.ALBUM]: 'Embed Album'
  },
  playerSize: 'Player Size',
  embedCode: 'Embed Code'
}

type OwnProps = {}

type EmbedModalProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const EmbedModal = ({ isOpen, kind, id, metadata, close }: EmbedModalProps) => {
  const [size, setSize] = useState(Size.STANDARD)
  // Delay the rendering of the embed frame since it's expensive.
  // This shores up the modal open animation a bit.
  const [delayedOpen, setDelayedOpen] = useState(false)
  useEffect(() => {
    setTimeout(() => setDelayedOpen(isOpen), 100)
  }, [isOpen])

  // Configure analytics
  const record = useRecord()

  useEffect(() => {
    if (isOpen && kind && id) {
      record(make(Name.EMBED_OPEN, { kind, id: `${id}` }))
    }
  }, [isOpen, kind, id, record])
  const onCopy = useCallback(() => {
    if (kind && id) {
      record(
        make(Name.EMBED_COPY, {
          kind,
          id: `${id}`,
          size: size === Size.COMPACT ? 'compact' : 'standard'
        })
      )
    }
  }, [kind, id, record, size])

  // Configure frames
  const standardFrameString = useMemo(() => {
    if (!kind || !id || !metadata) return ''
    return formatIFrame(
      constructUrl(kind, id, metadata, Size.STANDARD),
      Size.STANDARD
    )
  }, [kind, id, metadata])
  const compactFrameString = useMemo(() => {
    if (!kind || !id || !metadata) return ''
    return formatIFrame(
      constructUrl(kind, id, metadata, Size.COMPACT),
      Size.COMPACT
    )
  }, [kind, id, metadata])

  return (
    <AudiusModal
      isOpen={isOpen}
      onClose={close}
      showDismissButton
      showTitleHeader
      title={kind ? messages.title[kind] : ''}
      contentHorizontalPadding={32}
      bodyClassName={styles.modalBodyStyle}
      titleClassName={styles.modalTitleStyle}
    >
      <div className={styles.embed}>
        <div className={styles.frame}>
          <div
            className={cn(styles.switcher, {
              [styles.show]: size === Size.STANDARD
            })}
          >
            {delayedOpen && <EmbedFrame frameString={standardFrameString} />}
          </div>
          {kind === PlayableType.TRACK && (
            <div
              className={cn(styles.switcher, {
                [styles.show]: size === Size.COMPACT
              })}
            >
              {delayedOpen && <EmbedFrame frameString={compactFrameString} />}
            </div>
          )}
        </div>
        <div className={styles.details}>
          {metadata && (metadata as Track).track_id && (
            <div className={styles.panel}>
              <div className={styles.title}>{messages.playerSize}</div>
              <TabSlider
                options={[
                  {
                    key: Size.STANDARD,
                    text: Size.STANDARD
                  },
                  {
                    key: Size.COMPACT,
                    text: Size.COMPACT
                  }
                ]}
                selected={size}
                onSelectOption={size => setSize(size)}
              />
            </div>
          )}
          <div className={styles.panel}>
            <div className={styles.title}>{messages.embedCode}</div>
            <EmbedCopy
              frameString={
                size === Size.COMPACT ? compactFrameString : standardFrameString
              }
              onCopy={onCopy}
            />
          </div>

          <div className={styles.bottom}>
            <Button
              type={ButtonType.PRIMARY_ALT}
              onClick={close}
              text='Done'
              textClassName={styles.buttonText}
              className={styles.button}
            />
          </div>
        </div>
      </div>
    </AudiusModal>
  )
}

function mapStateToProps(state: AppState) {
  return {
    metadata: getMetadata(state),
    isOpen: getIsOpen(state),
    id: getId(state),
    kind: getKind(state)
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    close: () => dispatch(close())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmbedModal)
