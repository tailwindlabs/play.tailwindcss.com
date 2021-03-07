export function ApplyDraftModal({
  onConfirm,
  onDismiss,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10 bg-gray-500 bg-opacity-75">
      <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-cyan-500 mt-1">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-3 mt-1">
            <p className="text-sm text-gray-900">
              You have previously unsaved changes. Do you want to apply them?
            </p>
            <div className="mt-4">
              <button onClick={onConfirm} className="relative flex-none rounded-md border border-turquoise-200 bg-turquoise-500 text-sm text-white font-medium leading-5 py-1.5 px-2 lg:px-4 focus:border-turquoise-400 focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-transparent dark:focus:bg-gray-700 dark:focus:border-turquoise-500">
                Apply
              </button>
              <button onClick={onDismiss} className="ml-4 relative flex-none rounded-md border border-gray-200 text-sm font-medium leading-5 py-1.5 px-2 lg:px-4 focus:border-turquoise-400 focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-transparent dark:focus:bg-gray-700 dark:focus:border-turquoise-500">
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
