class AclUploader
  TEMPLATE = JST["acl_uploader/dropzone"]
  PROGRESS_TEMPLATE = JST["acl_uploader/progress"]
  DROPZONE_TEMPLATE = JST["acl_uploader/dropzone_overlay"]
  UPLOAD_FAIL_TEMPLATE = JST["acl_uploader/fail_message"]

  DEFAULT_DROPZONE = "body"
  DROPZONE_OVERLAY = ".acl-uploader__overlay"

  constructor: (@$el, @options = {}) ->
    @_render()

    @_input().fileupload(@_fileUploadOptions())

    if @_uploaderInitialized() && !@_ie9orLess()
      @_initializeDropZoneEffects()

  _render: ->
    @$el.html(TEMPLATE(url: @_url()))

  _startUpload: ->
    @_hideDropzoneOverlay()
    @_hideFailMessage()

  _hideFailMessage: ->
    @$el.find('.acl-uploader__fail').remove()

  _addFileToProgressQueue: (data) ->
    data.context = $(PROGRESS_TEMPLATE(filename: data.files[0].name)).appendTo(@_container())
    data.submit()

  _updateUploadingProgress: (data) ->
    @_updateProgressBar(data)
    @_updateLoadedInfo(data)

    @_markAsSent(data) if data.loaded is data.total

  _updateProgressBar: (data) ->
    percents = Math.floor((data.loaded / data.total) * 100)
    data.context.find(".acl-uploader__progress-bar").css('width', percents + '%')

  _updateLoadedInfo: (data) ->
    secondsRemaining = Math.floor((data.total - data.loaded) * 8 / data.bitrate)
    loaded = I18n.toHumanSize(data.loaded, precision: 0, format: "%n %u")
    total = I18n.toHumanSize(data.total, precision: 0, format: "%n %u")

    data.context.find(".acl-uploader__info").text(I18n.t("app.attachments.upload_progress",
      count: secondsRemaining
      loaded: loaded
      total: total
    ))

  _markAsSent: (data) ->
    data.context.addClass("acl-uploader__progress--sent")

  _displayUploadingResult: (e, data) ->
    data.context.find(".acl-uploader__info").text("")
    data.context.find(".acl-uploader__progress-bar").css(width: 0)
    data.context.removeClass("acl-uploader__progress--sent")
    data.context.addClass("acl-uploader__progress--done")

  _displayFail: (e, data) ->
    data.context.remove()

    if !@options.fail && @_noFailMessage()
      @$el.prepend(UPLOAD_FAIL_TEMPLATE(support_url: @_support_url()))

  _noFailMessage: ->
    !@$el.find('.acl-uploader__fail').length

  _clearProgressQueue: ->
    setTimeout(=>
      @_container().find(".acl-uploader__progress--done").remove()
    , 3000)

  # Overlay methods

  _uploaderInitialized: ->
    @_input().data("blueimpFileupload")

  _initializeDropZoneEffects: ->
    $(DEFAULT_DROPZONE).append(DROPZONE_TEMPLATE())

    $(DEFAULT_DROPZONE).dragster
      enter: (_, e) =>
        @_displayWhenFilesPresent(e)
      leave: =>
        @_hideDropzoneOverlay()
      drop: =>
        @_hideDropzoneOverlay()

  _displayWhenFilesPresent: (e) ->
    dt = e.originalEvent.dataTransfer
    types = dt.types

    if @_containsFile(types)
      @_displayDropzoneOverlay()
    else
      @_hideDropzoneOverlay()

    e.preventDefault()

  _containsFile: (types) ->
    # note: types possibly being DOMStringList and Array here
    return unless types

    contains = (thing) -> @indexOf(thing) >= 0
    contains = (types.contains ? contains).bind(types)

    contains('Files') or contains('application/x-moz-file')

  _displayDropzoneOverlay: ->
    $(DEFAULT_DROPZONE).find(DROPZONE_OVERLAY).show()

  _hideDropzoneOverlay: ->
    $(DEFAULT_DROPZONE).find(DROPZONE_OVERLAY).hide()

  # Finders

  _container: ->
    @$el.find(".acl-uploader__container")

  _url: ->
    @$el.data('attachments-url')

  _support_url: ->
    @$el.data('support-url') || "https://support.acl.com"

  _input: ->
    @$el.find('input[type="file"]')

  _ie9orLess: ->
    document.all && !window.atob

  # Options

  _defaultOptions: ->
    url: @_url()
    dropZone: $(DEFAULT_DROPZONE)
    start: => @_startUpload()
    add: (_, data) => @_addFileToProgressQueue(data)
    progress: (_, data) => @_updateUploadingProgress(data)
    stop: => @_clearProgressQueue()
    done: (e, data) => @_displayUploadingResult(e, data)
    fail: (e, data) => @_displayFail(e, data)
    formData: [
      {
        name: 'authenticity_token'
        value: $('meta[name="csrf-token"]').attr('content')
      }
      {
        name: 'format'
        value: if $.support.xhrFileUpload then 'json' else 'text'
      }
    ]

  _fileUploadOptions: () ->
    @options.singleFileUploads = !@options.limitMultiFileUploads
    optionsWithNewKey = $.extend(true, {}, @_defaultOptions(), @options)
    @_overrideCallbacks(optionsWithNewKey, @_defaultOptions(), @options)

  _overrideCallbacks: (existingOptions, defaultOptions, options) ->
    Object.keys(existingOptions).forEach (key) ->
      if typeof existingOptions[key] is 'function'
        existingOptions[key] = (e, data) ->
          defaultOptions[key](e, data) if defaultOptions[key]
          options[key](e, data) if options[key]

    existingOptions

$.fn.aclUploader = (options) ->
  return $(@).each(->
    $.data(@, "acl-uploader", new AclUploader($(@), options))
  )
