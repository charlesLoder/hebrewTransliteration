const $ = require('jquery')
const heb = require('hebrew-transliteration')
const transliterate = heb.transliterate

$('#input_button').click(() => {
  let qametsQatan = $('input[type=checkbox]').prop('checked')
  let hebText = $('#input').val()
  let transText = transliterate(hebText, {'isSeqeunced': true, 'qametsQatan': qametsQatan})
  $('#output').val(transText)
})
