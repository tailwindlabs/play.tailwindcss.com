import { Logo } from '../Logo'
import { HeaderButton } from './HeaderButton'
import { SettingsDropdown } from './SettingsDropdown'
import { toggleTheme } from '../../utils/theme'

export function Header({
  layout,
  onChangeLayout,
  onEnableMultiscreen,
  responsiveDesignMode,
  onToggleResponsiveDesignMode,
  tailwindVersion,
  onChangeTailwindVersion,
  children,
}) {
  return (
    <header className="relative z-10 flex-none py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center space-x-4">
      <div className="flex-auto flex items-center min-w-0 space-x-5">
        <Logo className="flex-none text-black dark:text-white" />
        {children}
      </div>
      <div className="flex items-center space-x-3 lg:space-x-5">
        <label className="relative">
          <span className="sr-only">Tailwind CSS version</span>
          <select
            className="appearance-none cursor-pointer block bg-transparent pr-6 py-1 text-gray-500 dark:text-gray-400 font-medium text-sm focus:outline-none focus:text-gray-900 dark:focus:text-white transition-colors duration-200"
            value={tailwindVersion}
            onChange={(e) => onChangeTailwindVersion(e.target.value)}
          >
            <option value="1" className="text-initial">
              v1.9.6
            </option>
            <option value="2" className="text-initial">
              v2.0.2
            </option>
          </select>
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute top-1/2 right-0 -mt-2.5 pointer-events-none"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            ></path>
          </svg>
        </label>
        <SettingsDropdown layout={layout} onChangeLayout={onChangeLayout} />
        <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700" />
        <HeaderButton
          isActive={responsiveDesignMode}
          label="Toggle responsive design mode"
          onClick={onToggleResponsiveDesignMode}
          fillOnly={true}
          className="hidden md:block"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 8H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v4zm14-4.5H8a.5.5 0 00-.5.5v4H10a2 2 0 012 2v10c0 .173-.022.34-.063.5H20a.5.5 0 00.5-.5V4a.5.5 0 00-.5-.5zm-10 17a.5.5 0 00.5-.5V10a.5.5 0 00-.5-.5H4a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h6z"
          />
        </HeaderButton>
        <HeaderButton
          onClick={onEnableMultiscreen}
          label="Open preview in another window"
        >
          <rect
            x="0.75"
            y="2.75"
            width="18.5"
            height="14.5"
            rx="1.25"
            fill="none"
          />
          <rect
            x="6.75"
            y="8.75"
            width="18.5"
            height="14.5"
            rx="1.25"
            fill="#d4d4d8"
          />
        </HeaderButton>
        <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700" />
        <HeaderButton
          title="Toggle dark mode"
          label={
            <>
              <span className="dark:hidden">Switch to dark theme</span>
              <span className="hidden dark:inline">Switch to light theme</span>
            </>
          }
          onClick={toggleTheme}
          fillOnly={true}
        >
          <g className="dark:opacity-0">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.353 2.939a1 1 0 01.22 1.08 8 8 0 0010.408 10.408 1 1 0 011.301 1.3A10.003 10.003 0 0112 22C6.477 22 2 17.523 2 12c0-4.207 2.598-7.805 6.273-9.282a1 1 0 011.08.22z"
            />
          </g>
          <g className="opacity-0 dark:opacity-100">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.929 4.929a1 1 0 011.414 0l.707.707A1 1 0 115.636 7.05l-.707-.707a1 1 0 010-1.414zm14.142 0a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM7 12a5 5 0 1110 0 5 5 0 01-10 0zm-5 0a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm17 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-2.05 4.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm-11.314 0a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM12 19a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"
            />
          </g>
        </HeaderButton>
      </div>
    </header>
  )
}
