$ ->
  # Extend Foundation's close reveal modal function
  # to acl-popup's "cancel" link
  $(document).on("click", ".js-close-popup", (e) ->
    $el = $(this)

    # Prevent the page from returning to top
    e.preventDefault() if $el.is("a")
    $el.closest(".acl-popup, .reveal-modal").foundation("reveal", "close")
  )
