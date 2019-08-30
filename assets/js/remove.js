const $ = require('jquery')
const heb = require('hebrew-transliteration')
const remove = heb.remove

$('#input_button').click(() => {
  let removeVowelsVal = $('input[type=checkbox]').prop('checked')
  let hebText = $('#input').val()
  let transText = remove(hebText, {removeVowels: removeVowelsVal})
  $('#output').val(transText)
})
