# hebrewTransliteration

An app that transliterates Hebrew text according to SBL guidlines for academic transliteration using the `hebrew-transliteration` [package](https://www.npmjs.com/package/hebrew-transliteration)

# How to Use

Copy and paste any unicode Hebrew text into the input field and press submit. A transliterated text will appear below.

For example:
Copy the text below:

> וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהֹום וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּֽיִם׃

This will produce the text below:

> _wǝhāʾāreṣ hāyǝtâ tōhû wābōhû wǝḥōšek ʿal-pǝnê tǝhôm wǝrûaḥ ʾĕlōhîm mǝraḥepet ʿal-pǝnê hammāyim_

This _transliterates_ the text; it does not translate it.

# Known Issues

1. Short vowels written with a mater only appear with a circumflex
2. Defectively written long vowels only appear as short-vowels

# Qamets Qatan/Gadol Distinction

Forms with qamets qatan are based off of real, contextual forms.
Though not all forms are accounted for, many are.

Though the SBL style guide calls for the the disctions between qamets qatan and qamets gadol, this is difficult to do for a number of reasons:

1. In the text it is not always clear which one is which
2. On a purely graphical grounds, the signs are indistinguishable unless all the cantillation marks are taken into consideration
3. The qatan/gadol distinction is not native to Tiberian Hebrew, and creates a distinction that is inherit to other reading traditions
4. The point of translieration should be to accurately transliterate the _signs_ of a script, not the language itself.

# More Tools

There is also a page to strip cantillation and vowels from text, and page to sequence text correct (which is automatically done in the transliteration too).

# Acknowledgements

Shout out to the codeLouisville mentors!

## License

See [License](./license.md) for rights and limitations (MIT)
