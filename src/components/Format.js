export function Format({ editorRef }) {
  return (
    <div className="hidden sm:flex items-center space-x-4 min-w-0">
      <button
        type="button"
        className="relative flex-none rounded-md border border-gray-200 text-sm font-medium leading-5 py-1.5 px-4 focus:border-turquoise-400 focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-transparent dark:focus:bg-gray-700 dark:focus:border-turquoise-500 hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => {
          editorRef.current.editor
            .getAction('editor.action.formatDocument')
            .run()
        }}
      >
        Format
      </button>
    </div>
  )
}
