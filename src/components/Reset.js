import { useState, useEffect } from 'react'
import clsx from 'clsx'

export function Reset({
  dirty,
  onClick,
}) {
  return (
    <div className="hidden sm:flex items-center space-x-4 min-w-0">
      <button
        className={clsx(
          'relative flex-none rounded-md border border-gray-200 text-sm font-medium leading-5 py-1.5 px-2 lg:px-4 focus:border-turquoise-400 focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-transparent dark:focus:bg-gray-700 dark:focus:border-turquoise-500',
          {
            'opacity-50': !dirty,
            'hover:bg-gray-50 dark:hover:bg-gray-700': dirty,
          }
        )}
        disabled={!dirty}
        onClick={onClick}
      >
        Reset
      </button>
    </div>
  )
}
