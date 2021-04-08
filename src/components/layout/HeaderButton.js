import clsx from 'clsx'

export function HeaderButton({
  isActive = false,
  label,
  title,
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
      title={title || label}
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
