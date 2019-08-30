const $ = require('jquery')
const heb = require('hebrew-transliteration')
const transliterate = heb.transliterate

$('#input_button').click(() => {
  let qametsQatanVal = $('input[type=checkbox]').prop('checked')
  let hebText = $('#input').val()
  let transText = transliterate(hebText, {isSequenced: true, qametsQatan: qametsQatanVal})
  $('#output').val(transText)
})
