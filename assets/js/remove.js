const $ = require('jquery')
const heb = require('hebrew-transliteration')
const remove = heb.remove

$('#input_button').click(() => {
  let removeVowels = $('input[type=checkbox]').prop('checked')
  let hebText = $('#input').val()
  let transText = remove(hebText, {'removeVowels': removeVowels})
  $('#output').val(transText)
})
