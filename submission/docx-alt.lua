-- Quarto keeps `fig-alt` as an attribute, but the Word writer takes an image's
-- description from its alt inlines. Copy the attribute across so the alt text
-- ends up in the .docx (Word: right-click image > View Alt Text).
function Image(img)
  local alt = img.attributes["fig-alt"]
  if alt and alt ~= "" then
    img.caption = pandoc.Inlines(alt)
    img.attributes["fig-alt"] = nil
    return img
  end
end
