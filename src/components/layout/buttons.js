import { LAYOUT } from '../../constants'

export const Editor = () => (
  <rect
    x="2.75"
    y="4.75"
    width="18.5"
    height="14.5"
    rx="1.25"
    fill="#d4d4d8"
  />
)

export const Preview = () => (
  <rect
    x="2.75"
    y="4.75"
    width="18.5"
    height="14.5"
    rx="1.25"
    fill="none"
  />
)

export const Horizontal = () => (
  <>
    <rect
      x="21.25"
      y="19.25"
      width="18.5"
      height="14.5"
      rx="1.25"
      transform="rotate(-180 21.25 19.25)"
      fill="none"
    />
    <path d="M21.25 11.25H2.75V6c0-.69.56-1.25 1.25-1.25h16c.69 0 1.25.56 1.25 1.25v5.25z" />
  </>
)

export const Vertical = () => (
  <>
    <rect
      x="2.75"
      y="4.75"
      width="18.5"
      height="14.5"
      rx="1.25"
      fill="none"
    />
    <path d="M2.75 6c0-.69.56-1.25 1.25-1.25h7.25v14.5H4c-.69 0-1.25-.56-1.25-1.25V6z" />
  </>
)

export const getIcon = (layout) => {
  switch (layout) {
    case LAYOUT.editor:
      return Editor
    case LAYOUT.preview:
      return Preview
    case LAYOUT.horizontal:
      return Horizontal
    case LAYOUT.vertical:
      return Vertical
    default:
      return <></>
  }
}
