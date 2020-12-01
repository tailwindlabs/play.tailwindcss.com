import { Logo } from './Logo'
import clsx from 'clsx'
import { toggleTheme } from '../utils/theme'

export function Header({
  layout,
  onChangeLayout,
  responsiveDesignMode,
  onToggleResponsiveDesignMode,
  tailwindVersion,
  onChangeTailwindVersion,
  children,
}) {
  return (
    <header className="relative z-10 flex-none py-3 px-5 sm:px-6 flex items-center space-x-4">
      <div className="flex-auto flex items-center min-w-0 space-x-5">
        <Logo className="flex-none text-black dark:text-white" />
        {children}
      </div>
      <div className="flex items-center space-x-5">
        <label className="relative">
          <span className="sr-only">Tailwind CSS version</span>
          <select
            className="appearance-none block bg-transparent pr-6 py-1 text-gray-500 dark:text-gray-400 font-medium text-sm focus:outline-none focus:text-gray-900 dark:focus:text-white transition-colors duration-200 dark:focus:bg-gray-900"
            value={tailwindVersion}
            onChange={(e) => onChangeTailwindVersion(e.target.value)}
          >
            <option value="1">v1</option>
            <option value="2">v2</option>
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
        <div className="hidden md:flex items-center space-x-3.5">
          <HeaderButton
            isActive={layout === 'vertical'}
            label="Switch to vertical split layout"
            onClick={() => onChangeLayout('vertical')}
          >
            <rect
              x="2.75"
              y="4.75"
              width="18.5"
              height="14.5"
              rx="1.25"
              fill="none"
            />
            <path d="M2.75 6c0-.69.56-1.25 1.25-1.25h7.25v14.5H4c-.69 0-1.25-.56-1.25-1.25V6z" />
          </HeaderButton>
          <HeaderButton
            isActive={layout === 'horizontal'}
            label="Switch to horizontal split layout"
            onClick={() => onChangeLayout('horizontal')}
          >
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
          </HeaderButton>
          <HeaderButton
            isActive={layout === 'preview'}
            label="Switch to preview-only layout"
            onClick={() => onChangeLayout('preview')}
          >
            <rect
              x="2.75"
              y="4.75"
              width="18.5"
              height="14.5"
              rx="1.25"
              fill="none"
            />
          </HeaderButton>
        </div>
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
        <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700" />
        <HeaderButton
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

function HeaderButton({
  isActive = false,
  label,
  onClick,
  fillOnly = false,
  className,
  children,
}) {
  return (
    <button
      type="button"
      className={clsx(
        className,
        'group rounded-md border border-transparent focus:bg-gray-100 focus:outline-none dark:focus:bg-black dark:focus:border-gray-800',
        {
          'text-gray-700 dark:text-white': isActive,
          'text-gray-400': !isActive,
        }
      )}
      onClick={onClick}
    >
      <span className="sr-only">{label}</span>
      <svg
        width="34"
        height="34"
        viewBox="-5 -5 34 34"
        strokeWidth={fillOnly ? 0 : 1.5}
        className={clsx(
          fillOnly
            ? {
                'fill-gray-400 group-hover:fill-gray-500 group-focus:fill-gray-500 dark:fill-gray-500 dark:group-hover:fill-gray-400 dark:group-focus:fill-gray-400': !isActive,
                'fill-turquoise-500 group-hover:fill-turquoise-600 dark:fill-turquoise-400 dark:group-hover:fill-turquoise-300 dark:group-focus:fill-turquoise-300': isActive,
              }
            : {
                'fill-gray-300 stroke-gray-400 group-hover:fill-gray-400 group-hover:stroke-gray-500 group-focus:fill-gray-400 group-focus:stroke-gray-500 dark:fill-gray-700 dark:stroke-gray-500 dark:group-hover:fill-gray-600 dark:group-hover:stroke-gray-400 dark:group-focus:fill-gray-600 dark:group-focus:stroke-gray-400': !isActive,
                'fill-turquoise-100 stroke-turquoise-500 group-hover:fill-turquoise-200 group-hover:stroke-turquoise-600 dark:fill-turquoise-800 dark:stroke-turquoise-400 dark:group-hover:fill-turquoise-700 dark:group-hover:stroke-turquoise-300 dark:group-focus:fill-turquoise-700 dark:group-focus:stroke-turquoise-300': isActive,
              }
        )}
      >
        {children}
      </svg>
    </button>
  )
}
