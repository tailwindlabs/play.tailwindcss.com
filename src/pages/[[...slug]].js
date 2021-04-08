import { useState, useRef, useEffect, useCallback } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import useLocalStorage from '../hooks/useLocalStorage'
import Worker from 'worker-loader?publicPath=/_next/&filename=static/chunks/[name].[hash].js&chunkFilename=static/chunks/[id].[contenthash].worker.js!../workers/postcss.worker.js'
import { requestResponse } from '../utils/workers'
import { debounce } from 'debounce'
import { Editor } from '../components/Editor'
import SplitPane from 'react-split-pane'
import useMedia from 'react-use/lib/useMedia'
import defaultContent from '../preval/defaultContent'
import { validateJavaScript } from '../utils/validateJavaScript'
import { useDebouncedState } from '../hooks/useDebouncedState'
import { Preview } from '../components/Preview'
import Error from 'next/error'
import { ErrorOverlay } from '../components/ErrorOverlay'
import Router from 'next/router'
import { Header } from '../components/layout'
import { Share } from '../components/Share'
import { TabBar } from '../components/TabBar'
import { ApplyDraftModal } from '../components/ApplyDraftModal'
import { sizeToObject } from '../utils/size'
import { getLayoutQueryString } from '../utils/getLayoutQueryString'
import { get } from '../utils/database'
import { toValidTailwindVersion } from '../utils/toValidTailwindVersion'
import Head from 'next/head'
import { LAYOUT } from '../constants'

const HEADER_HEIGHT = 60 - 1
const TAB_BAR_HEIGHT = 40
const RESIZER_SIZE = 1
const RESIZER_CAP = 320
const DEFAULT_RESPONSIVE_SIZE = { width: 540, height: 720 }
const EDITOR_CONTENT_KEY = 'editorContent'

function Pen({
  serverSideContent,
  initialPath,
  initialLayout,
  initialResponsiveSize,
  initialActiveTab,
  enableWatch,
}) {
  const previewRef = useRef()
  const worker = useRef()
  const [size, setSize] = useState({ percentage: 0.5, layout: initialLayout })
  const [resizing, setResizing] = useState(false)
  const [activeTab, setActiveTab] = useState(initialActiveTab)
  const [activePane, setActivePane] = useState(
    initialLayout === LAYOUT.preview ? 'preview' : 'editor'
  )
  const isMd = useMedia('(min-width: 768px)')
  const [dirty, setDirty] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const [renderEditor, setRenderEditor] = useState(false)
  const [localEditorContent, setLocalEditorContent] = useLocalStorage(serverSideContent ? serverSideContent.ID : EDITOR_CONTENT_KEY)
  const [initialContent, setInitialContent] = useState()
  const [
    error,
    setError,
    setErrorImmediate,
    cancelSetError,
  ] = useDebouncedState(undefined, 1000)
  const editorRef = useRef()
  const [responsiveDesignMode, setResponsiveDesignMode] = useState(
    initialResponsiveSize ? true : false
  )
  const [shouldClearOnUpdate, setShouldClearOnUpdate] = useState(true)
  const [isLoading, setIsLoading, setIsLoadingImmediate] = useDebouncedState(
    false,
    1000
  )
  const [responsiveSize, setResponsiveSize] = useState(
    initialResponsiveSize || DEFAULT_RESPONSIVE_SIZE
  )
  const [tailwindVersion, setTailwindVersion] = useState()

  useEffect(() => {
    setDirty(true)
  }, [
    activeTab,
    size.layout,
    responsiveSize.width,
    responsiveSize.height,
    responsiveDesignMode,
    tailwindVersion,
  ])

  useEffect(() => {
    if (dirty) {
      function handleUnload(e) {
        e.preventDefault()
        e.returnValue = ''
      }
      window.addEventListener('beforeunload', handleUnload)
      return () => {
        window.removeEventListener('beforeunload', handleUnload)
      }
    }
  }, [dirty])

  useEffect(() => {
    if (!initialContent) {
      const hasLocalChanges = localEditorContent && !isContentEqual(localEditorContent, serverSideContent || defaultContent)
      setHasDraft(hasLocalChanges)
      setInitialContent(serverSideContent || defaultContent)
    }
  }, [serverSideContent, localEditorContent, initialContent])

  useEffect(() => {
    if (initialContent) {
      setDirty(false)
      setTailwindVersion(toValidTailwindVersion(initialContent.version))
      if (
        shouldClearOnUpdate &&
        previewRef.current &&
        previewRef.current.contentWindow
      ) {
        previewRef.current.contentWindow.postMessage(
          {
            clear: true,
          },
          '*'
        )
        inject({ html: initialContent.html })
        compileNow({
          css: initialContent.css,
          config: initialContent.config,
          tailwindVersion: toValidTailwindVersion(initialContent.version),
        })
      }
    }
  }, [initialContent])

  const inject = useCallback((content) => {
    previewRef.current.contentWindow.postMessage(content, '*')
  }, [])

  async function compileNow(content) {
    if (content.config) {
      let validateResult = await validateJavaScript(content.config)
      if (!validateResult.isValid) {
        return setError({ ...validateResult.error, file: 'Config' })
      }
    }
    cancelSetError()
    setIsLoading(true)
    const { css, canceled, error } = await requestResponse(
      worker.current,
      content
    )
    if (canceled) {
      return
    }
    setIsLoadingImmediate(false)
    if (error) {
      setError(error)
      return
    }
    setErrorImmediate()
    if (css) {
      previewRef.current.contentWindow.postMessage({ css }, '*')
    }
  }

  const compile = useCallback(debounce(compileNow, 200), [])

  const onChange = useCallback(
    (document, content) => {
      setDirty(true)
      setLocalEditorContent(content)
      if (document === 'html') {
        inject({ html: content.html })
      } else {
        compile({ css: content.css, config: content.config })
      }
    },
    [inject, compile]
  )

  const isContentEqual = (a, b) => a && b && a.html === b.html && a.css === b.css && a.config === b.config

  useEffect(() => {
    worker.current = new Worker()
    return () => {
      worker.current.terminate()
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    function updateSize() {
      setSize((size) => {
        const windowSize =
          size.layout === LAYOUT.horizontal
            ? document.documentElement.clientHeight - HEADER_HEIGHT
            : document.documentElement.clientWidth

        if (isMd && size.layout !== LAYOUT.preview && size.layout !== LAYOUT.editor) {
          const min = size.layout === LAYOUT.vertical ? RESIZER_CAP : RESIZER_CAP + TAB_BAR_HEIGHT
          const max =
            size.layout === LAYOUT.vertical
              ? windowSize - min - RESIZER_SIZE
              : windowSize - RESIZER_CAP - RESIZER_SIZE

          return {
            ...size,
            min,
            max,
            current: Math.max(
              Math.min(Math.round(windowSize * size.percentage), max),
              min
            ),
          }
        }

        const newSize =
          (isMd && size.layout !== LAYOUT.preview) ||
          (!isMd && activePane === 'editor')
            ? windowSize
            : 0

        return {
          ...size,
          current: newSize,
          min: newSize,
          max: newSize,
        }
      })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [isMd, setSize, size.layout, activePane])

  useEffect(() => {
    if (isMd) {
      if (size.layout !== 'preview') {
        setRenderEditor(true)
      }
    } else if (activePane === 'editor') {
      setRenderEditor(true)
    }
  }, [activePane, isMd, size.layout])

  useEffect(() => {
    if (resizing) {
      document.body.classList.add(
        size.layout === LAYOUT.vertical ? 'cursor-ew-resize' : 'cursor-ns-resize'
      )
    } else {
      document.body.classList.remove(
        size.layout === LAYOUT.vertical ? 'cursor-ew-resize' : 'cursor-ns-resize'
      )
    }
  }, [resizing])

  useIsomorphicLayoutEffect(() => {
    const applyLocalStorage = ({ newValue }) => {
      try {
        if (newValue) {
          const content = JSON.parse(newValue)
          inject({ html: content.html })
          compile({ css: content.css, config: content.config })
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (enableWatch) {
      window.addEventListener('storage', applyLocalStorage)
    }

    return () => {
      window.removeEventListener('storage', applyLocalStorage)
    }
  }, [size.layout])

  const updateCurrentSize = useCallback((newSize) => {
    setSize((size) => {
      const windowSize =
        size.layout === LAYOUT.vertical
          ? document.documentElement.clientWidth
          : document.documentElement.clientHeight - HEADER_HEIGHT
      const percentage = newSize / windowSize
      return {
        ...size,
        current: newSize,
        percentage:
          percentage === 1 || percentage === 0 ? size.percentage : percentage,
      }
    })
  }, [])

  const onShareStart = useCallback(() => {
    setDirty(false)
  }, [])

  const onShareComplete = useCallback(
    (path) => {
      setShouldClearOnUpdate(false)
      Router.push(path).then(() => {
        setShouldClearOnUpdate(true)
      })
    },
    [size.layout, responsiveDesignMode, responsiveSize]
  )

  const onClearDraft = () => {
    setDirty(false)
    setHasDraft(false)
    setLocalEditorContent(initialContent)
  }

  const onApplyDraft = () => {
    setDirty(true)
    setHasDraft(false)
    setInitialContent(localEditorContent)
  }

  const onEnableMultiscreen = () => {
    const { origin, pathname } = window.location
    setSize((size) => ({ ...size, layout: LAYOUT.editor }))
    window.open(`${origin}${pathname}?watch=true&layout=${LAYOUT.preview}`, '_blank', 'noopener,noreferrer')
  }

  // initial state resets
  useEffect(() => {
    setSize((size) => ({ ...size, layout: initialLayout }))
  }, [initialLayout])
  useEffect(() => {
    setResponsiveDesignMode(Boolean(initialResponsiveSize))
    setResponsiveSize(initialResponsiveSize || DEFAULT_RESPONSIVE_SIZE)
  }, [initialResponsiveSize])
  useEffect(() => {
    setActiveTab(initialActiveTab)
  }, [initialActiveTab])

  const isDefaultContent = isContentEqual(initialContent, defaultContent)

  return (
    <>
      {initialContent && <Head>
        <meta
          property="og:url"
          content={`https://play.tailwindcss.com${
            initialContent.ID ? `/${initialContent.ID}` : ''
          }`}
        />
        <meta
          name="twitter:card"
          content={initialContent.ID ? 'summary' : 'summary_large_image'}
        />
        <meta
          name="twitter:image"
          content={
            initialContent.ID
              ? 'https://play.tailwindcss.com/social-square.jpg'
              : 'https://play.tailwindcss.com/social-card.jpg'
          }
        />
        {!initialContent.ID && (
          <meta
            property="og:image"
            content="https://play.tailwindcss.com/social-card.jpg"
          />
        )}
      </Head>}
      <Header
        layout={size.layout}
        onChangeLayout={(layout) => setSize((size) => ({ ...size, layout }))}
        onEnableMultiscreen={onEnableMultiscreen}
        responsiveDesignMode={responsiveDesignMode}
        onToggleResponsiveDesignMode={() =>
          setResponsiveDesignMode(!responsiveDesignMode)
        }
        tailwindVersion={tailwindVersion}
        onChangeTailwindVersion={(version) => {
          setTailwindVersion(version)
          compileNow({ _recompile: true, tailwindVersion: version })
        }}
      >
        <Share
          editorRef={editorRef}
          onShareStart={onShareStart}
          onShareComplete={onShareComplete}
          dirty={dirty}
          initialPath={initialPath}
          layout={size.layout}
          responsiveSize={responsiveDesignMode ? responsiveSize : undefined}
          activeTab={activeTab}
          tailwindVersion={tailwindVersion}
        />
      </Header>
      <main className="flex-auto relative border-t border-gray-200 dark:border-gray-800">
        {initialContent && typeof size.current !== 'undefined' ? (
          <>
            {(!isMd || size.layout !== LAYOUT.preview) && (
              <TabBar
                width={
                  size.layout === LAYOUT.vertical && isMd ? size.current : '100%'
                }
                isLoading={isLoading}
                showPreviewTab={!isMd}
                activeTab={
                  isMd || activePane === 'editor' ? activeTab : 'preview'
                }
                onChange={(tab) => {
                  if (tab === 'preview') {
                    setActivePane('preview')
                  } else {
                    setActivePane('editor')
                    setActiveTab(tab)
                  }
                }}
              />
            )}
            <SplitPane
              split={size.layout === LAYOUT.horizontal ? 'horizontal' : 'vertical'}
              minSize={size.min}
              maxSize={size.max}
              size={size.current}
              onChange={updateCurrentSize}
              paneStyle={{ marginTop: -1 }}
              pane1Style={{ display: 'flex', flexDirection: 'column' }}
              onDragStarted={() => setResizing(true)}
              onDragFinished={() => setResizing(false)}
              allowResize={isMd && size.layout !== LAYOUT.preview && size.layout !== LAYOUT.editor}
              resizerClassName={
                isMd && size.layout !== LAYOUT.preview && size.layout !== LAYOUT.editor
                  ? 'Resizer'
                  : 'Resizer-collapsed'
              }
            >
              <div className="border-t border-gray-200 dark:border-gray-800 mt-10 flex-auto flex">
                {renderEditor && (
                  <Editor
                    editorRef={(ref) => (editorRef.current = ref)}
                    initialContent={initialContent}
                    onChange={onChange}
                    worker={worker}
                    activeTab={activeTab}
                    tailwindVersion={tailwindVersion}
                  />
                )}
              </div>
              <div className="absolute inset-0 w-full h-full">
                <Preview
                  ref={previewRef}
                  responsiveDesignMode={isMd && responsiveDesignMode}
                  responsiveSize={responsiveSize}
                  onChangeResponsiveSize={setResponsiveSize}
                  iframeClassName={resizing ? 'pointer-events-none' : ''}
                  onLoad={() => {
                    inject({
                      html: initialContent.html,
                      ...(isDefaultContent
                        ? { css: defaultContent.compiledCss }
                        : {}),
                    })
                    compileNow({
                      css: initialContent.css,
                      config: initialContent.config,
                      tailwindVersion: initialContent.version,
                    })
                  }}
                />
                <ErrorOverlay error={error} />
              </div>
            </SplitPane>
          </>
        ) : null}
      </main>
      {hasDraft && <ApplyDraftModal onConfirm={onApplyDraft} onDismiss={onClearDraft} />}
    </>
  )
}

export default function App({ errorCode, ...props }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }
  return <Pen {...props} />
}

export async function getServerSideProps({ params, res, query }) {
  const layoutProps = {
    initialLayout: [LAYOUT.vertical, LAYOUT.horizontal, LAYOUT.preview, LAYOUT.editor].includes(query.layout)
      ? query.layout
      : LAYOUT.vertical,
    initialResponsiveSize: sizeToObject(query.size),
    initialActiveTab: ['html', 'css', 'config'].includes(query.file)
      ? query.file
      : 'html',
    enableWatch: query.watch === 'true',
  }

  console.log(params.slug)

  if (
    !params.slug ||
    (params.slug.length === 1 && params.slug[0] === 'index')
  ) {
    res.setHeader(
      'cache-control',
      'public, max-age=0, must-revalidate, s-maxage=31536000'
    )
    return {
      props: layoutProps,
    }
  }

  if (params.slug.length !== 1) {
    return {
      props: {
        errorCode: 404,
      },
    }
  }

  try {
    const { Item: serverSideContent } = await get({
      ID: params.slug[0],
    })

    res.setHeader(
      'cache-control',
      'public, max-age=0, must-revalidate, s-maxage=31536000'
    )

    return {
      props: {
        serverSideContent,
        initialPath: `/${serverSideContent.ID}${getLayoutQueryString({
          layout: query.layout,
          responsiveSize: query.size,
          file: query.file,
          watch: query.watch,
        })}`,
        ...layoutProps,
      },
    }
  } catch (error) {
    return {
      props: {
        errorCode: error.status || 500,
      },
    }
  }
}
