doctype html
html
  head
    meta(charset="utf-8")
    title #{pagename}
    link(type="text/css",rel="stylesheet",href="#{css}/<%= dirname %>.css")

  body(data-page-name="#{pageid}")

    include ../../mods/header/header.jade

    #bd
      p(style="text-align:center;font-size: 32px;line-height:5") <%= dirname %> page

    include ../../mods/footer/footer.jade

    script(src="#{js}/<%= dirname %>.js")