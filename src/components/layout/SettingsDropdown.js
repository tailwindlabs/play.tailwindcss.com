import { useState } from 'react'
import { HeaderButton } from './HeaderButton'
import { Editor, Preview, Vertical, Horizontal, getIcon } from './buttons'
import { LAYOUT } from '../../constants'

const options = [
  {
    label: "Editor",
    code: LAYOUT.editor,
    Icon: Editor,
  },
  {
    label: "Horizontal",
    code: LAYOUT.horizontal,
    Icon: Horizontal,
  },
  {
    label: "Vertical",
    code: LAYOUT.vertical,
    Icon: Vertical,
  },
  {
    label: "Preview",
    code: LAYOUT.preview,
    Icon: Preview,
  },
]

export function SettingsDropdown({
  layout,
  onChangeLayout,
}) {
  const [open, setOpen] = useState(false)
  const SelectedLayoutIcon = getIcon(layout)

  const handleChangeLayout = (newLayout) => {
    setOpen(false)
    onChangeLayout(newLayout)
  }

  return (
    <div className="relative -mb-2">
      <button className="relative" onClick={() => setOpen((open) => !open)} aria-expanded={open} aria-haspopup={open} title="Change layout">
        <span className="sr-only">Change layout</span>
        <div
          className="group appearance-none cursor-pointer block bg-transparent pr-6 py-1 text-gray-500 dark:text-gray-400 font-medium text-sm focus:outline-none focus:text-gray-900 dark:focus:text-white transition-colors duration-200"
          id="layout-menu"
        >
          <svg
            width="34"
            height="34"
            viewBox="-5 -5 34 34"
            strokeWidth="1.5"
            className="fill-gray-300 stroke-gray-400 dark:stroke-gray-500 dark:group-hover:stroke-gray-400"
          >
            <SelectedLayoutIcon />
          </svg>
        </div>
        <svg
          className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute top-1/2 right-0 -mt-2.5 pointer-events-none"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          ></path>
        </svg>
      </button>

      {open && <div className="origin-top-right absolute right-0 bg-white rounded shadow-lg text-sm w-44 ring-1 ring-black ring-opacity-10 py-1 dark:bg-gray-800 dark:text-white" role="menu" aria-orientation="vertical" aria-labelledby="layout-menu">
        {options.map(({ label, code, Icon }) => <a key={code} href="#" onClick={() => handleChangeLayout(code)} className="flex items-center px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
          <HeaderButton isActive={layout === code}>
            <Icon />
          </HeaderButton>
          <span className="ml-1">{label}</span>
        </a>)}
      </div>}
    </div>
  )
}
