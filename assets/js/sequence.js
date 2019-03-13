const $ = require('jquery')
const heb = require('hebrew-transliteration')
const sequence = heb.sequence

$('#input_button').click(() => {
  let hebText = $('#input').val()
  let seqText = sequence(hebText)
  $('#output').val(seqText)
})
