# hebrewTransliteration
An app that transliterates Hebrew text according to SBL guidlines for academic transliteration.

# How to Use
Copy and paste any unicode Hebrew text into the input field and press submit. A transliterated text will appear below.

For example:
Copy the text below:

>וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהֹום וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּֽיִם׃

This will produce the text below:

>*wǝhāʾāreṣ hāyǝtâ tōhû wābōhû wǝḥōšek ʿal-pǝnê tǝhôm wǝrûaḥ ʾĕlōhîm mǝraḥepet ʿal-pǝnê hammāyim*

This *transliterates* the text; it does not translate it.

I HIGHLY recommend using a site like <blueletterbible.org> or <sefaria.org> as the text on those sites follows the best practices of encoding text: 
  
* character + (śin/šin dot) + (dagesh) + vowel + cantillation

# Known Issues

1. Short vowels written with a mater only appear with a circumflex
2. Defectively written long vowels only appear as short-vowels
3. Qamats Qatan only catches כָּל־ and חָק־ currently.

# Qamets Qatan/Gadol Distinction
Though the SBL style guide calls for the the disctions between qamets qatan and qamets gadol, this is difficult to do for a number of reasons:

1. In the text it is not always clear which one is which
2. On a purely graphical grounds, the signs are indistinguishable unless all the cantillation marks are taken into consideration
3. The qatan/gadol distinction is not native to Tiberian Hebrew, and creates a distinction that is inherit to other reading traditions
4. The point of translieration should be to accurately transliterate the *signs* of a script, not the language itself.

# Recently Added
Under the "More Tools" page there is another app to strip the text of cantillation marks or cantillation marks and vowels

# Acknowledgements
Shout out to the codeLouisville mentors!

## License

See [License](./license.md) for rights and limitations (MIT)