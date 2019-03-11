  
/* Transilerates the text in a tit-for-tat manner */
function titForTat(hebText){
    const hebChars = {
        // preserves white space
        ' ':' ',
        // consonants
        'א':'ʾ',
        '\uFB2E':'ʾa',
        '\uFB2F':'ʾā',
        '\uFB30':'ʾ9',
        'ב':'b',
        '\uFB31':'b9',
        '\uFB4C':'b',
        'ג':'g',
        '\uFB32':'g9',
        'ד':'d',
        '\uFB33':'d9',
        'ה':'h',
        '\uFB34':'h9',
        'ו':'w',
        '\uFB35':'w9',
        '\uFB4B':'ô',
        'ז':'z',
        '\uFB36':'z9',
        'ח':'ḥ',
        'ט':'ṭ',
        '\uFB38':'ṭ9',
        'י':'y',
        '\uFB39':'y9',
        'כ':'k',
        '\uFB3B':'k9',
        '\uFB4D':'k',
        'ך':'k',
        '\uFB3A':'k9',
        'ל':'l',
        '\uFB3C':'l9',
        'מ':'m',
        '\uFB3E':'m9',
        'ם':'m',
        'נ':'n',
        '\uFB40':'n9',
        'ן':'n',
        'ס':'s',
        '\uFB41':'s9',
        'ע':'ʿ',
        'פ':'p',
        '\uFB44':'p9',
        '\uFB4E':'p',
        'ף':'p',
        '\uFB43':'p9',
        'צ':'ṣ',
        '\uFB46':'ṣ9',
        'ץ':'ṣ',
        'ק':'q',
        '\uFB47':'q9',
        'ר':'r',
        '\uFB48':'r9',
        'ש':'š',
        '\u05C1':'8',
        '\u05C2':'7',
        '\uFB2A':'š', //ligature for שׁ
        '\uFB2C':'š9',
        '\uFB2B':'ś', //ligature for שׂ
        '\uFB2D':'š9',
        'ת':'t',
        '\uFB4A':'t9',
        // vowels
        '\u05B0':'ǝ', //shewa
        '\u05B1':'ĕ', //hataf segol
        '\u05B2':'ă', //hataf patach
        '\u05B3':'ŏ', //hataf qamats
        '\u05B4':'i', //hiriq
        '\u05B5':'ē', //tsere
        '\u05B6':'e', //segol
        '\u05B7':'a', //patach
        '\u05B8':'ā', //qamats
        '\u05B9':'ō', //holam
        '\u05BA':'ō', //this is the codepoint for a holam on a const waw, but it is rarely used
        '\u05BB':'u', //qibbuts
        '\u05BC': '9', // dagesh
        '\u05BD': '', // metheg
        '\u05BE':'-', // maqqef
        '\u05BF':'', // rafe
        '\u05C7':'o', //qamets hatuf/qatan. Not used often, most use a qamats instead
        // extra marks and cantillations
        '\u0591':'', //athna
        '\u0592':'',
        '\u0593':'',
        '\u0594':'',
        '\u0595':'',
        '\u0596':'',
        '\u0597':'',
        '\u0598':'',
        '\u0599':'',
        '\u059A':'',
        '\u059B':'',
        '\u059C':'',
        '\u059D':'',
        '\u059E':'',
        '\u059F':'',
        '\u05A0':'',
        '\u05A1':'',
        '\u05A2':'',
        '\u05A3':'',
        '\u05A4':'',
        '\u05A5':'',
        '\u05A6':'',
        '\u05A7':'',
        '\u05A8':'',
        '\u05A9':'',
        '\u05AA':'',
        '\u05AB':'',
        '\u05AC':'',
        '\u05AD':'',
        '\u05AE':'',
        '\u05AF':'',
        '\u05C3':'',
      };
    let titTat = hebText.replace(/[\u0591-\u05F4, \uFB1D-\uFB4F]/gu, i => hebChars[i]);
    return titTat;
}

/* Splits titTat into an array of strings to be tested */
function makeArray(titTat){
    return titTat.split(" ");
}

/**********************************************************/ 
 
function changeElementSplit(input, split, join){
    return input.split(split).join(join);
}

function changeElementSubstr (input, index, join) {
    return input.substr(0, index) + join + input.substr(index+1, );
}

/* Tests the elements to see where they need to be transliterated */ 
function testEach(array){
    array.forEach( (element, index) => {

        // Tests for shin non-ligatures
        if (element.includes('8')) {
            // 8 is the shin-dot = \u05C1
            element = changeElementSplit(element, '8', '');
        }

        // Tests for sin non-ligatures
        if (element.includes('7')) {
            // 7 is the sin-dot = \u05C2
            element = changeElementSplit(element, 'š7', 'ś');
        }

         // Tests for hiriq-yod mater
         if (/iy(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|9)/.test(element)) {
            element = changeElementSplit(element, /iy(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|9)/, 'î');
        }

         // Tests for tsere-yod mater
         if (/ēy(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|9)/.test(element)) {
            element = changeElementSplit(element, /ēy(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|9)/, 'ê');
        }

         // Tests for seghol-yod mater
         if (/ey(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|9)/.test(element)) {
            element = changeElementSplit(element, /ey(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|9)/, 'ê');
        }

        // Tests for waw as a holem-mater
        if (/wō(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|u|9)/.test(element)) {
            element = changeElementSplit(element, /wō(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|u|9)/, 'ô');
        }

        // Tests for waw as a holem-mater
        if (/ōw(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|u|9)/.test(element)) {
            element = changeElementSplit(element, /ōw(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|u|9)/, 'ô');
        }

        // Tests for waw as a shureq-mater
        if (/w9(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|â|o|ô|u|û)/.test(element)) {
            element = changeElementSplit(element, /w9(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|â|o|ô|u|û)/, 'û');
        }

        // Tests for He as a final mater or with mappiq or tests for furtive patach
        if ( /āh$/.test(element) ) {
            element = changeElementSplit(element, /āh$/, 'â');  
        } else if (/ēh$/.test(element)) {
            element = changeElementSplit(element, /ēh$/, 'ê');
        } else if (/eh$/.test(element)) {
            element = changeElementSplit(element, /eh$/, 'ê');
        } else if (/h9$/.test(element)) {
            element = changeElementSplit(element, /h9$/, 'h');
        } else if (/h9a$/.test(element)) {
            element = changeElementSplit(element, /h9a$/, 'ah');
        } else if (/ḥa$/.test(element)) {
            element = changeElementSplit(element, /ḥa$/, 'aḥ');
        } else if (/ʿa$/.test(element)) {
            element = changeElementSplit(element, /ʿa$/, 'aʿ');
        }

        // Tests if a shewa exists in the element
        if (element.includes('ǝ')) {
            let pos = element.indexOf('ǝ');
            while (pos !== -1) {
                // shewa at the end of a word
                if (element.charAt(element.length-1) === 'ǝ' ) {
                    element = changeElementSubstr(element, element.length-1, '');
                }
                // if the shewa is preceded by a short vowel
                if ( /ǝ|a|e|i|u|o/.test(element.charAt(pos-2)) ) {
                    // if it SQeNeM LeVY letters in wayyiqtol forms
                    if ( /s|ṣ|š|ś|q|n|m|l|w|y/.test(element.charAt(pos-1)) && /w/.test(element.charAt(pos-3)) ) {
                        element;
                    } else {
                        element = changeElementSubstr(element, pos, '');
                    } 
                }
                pos = element.indexOf('ǝ', pos +1);
            }
            element = element;
        }

        // tests for Qametx qatan vs gadol
        const testQamets = $('input[type=checkbox]').prop('checked');
        if (testQamets) {
            if (/k9āl-/.test(element) ) {
                element = changeElementSplit(element, 'k9āl-', 'k9ol-');
            } else if (/kāl-/.test(element)) {
                element = changeElementSplit(element, 'kāl-', 'kol-');
            }
             else if (/ḥāq-/.test(element)) {
                element = changeElementSplit(element, 'ḥāq-', 'ḥoq-');
            }
        }

        // tests for a doubling dagesh
        if (element.includes('9')) {
            const elArray = element.split("");
            elArray.forEach( (e, i) => {
               if (e === '9' && /a|ā|e|ē|i|î|u|û|o|ō|ô/.test(elArray[i-2]) && Boolean(elArray[i-2]) ) {
                   elArray[i] = elArray[i-1];
                }
            })
            element = elArray.join("");
        }

        //  tests for yhwh
        if (element === "yǝhwâ") {
            element = "yhwh";
        } else if (element.includes('yǝhwâ')){
            element = changeElementSplit(element, 'yǝhwâ', 'yhwh');
        } else if (element.includes('yhwâ')) {
            element = changeElementSplit(element, 'yhwâ', 'yhwh');
        }

        // removes any remaining digits
        if (/\d/.test(element)) {
            element = changeElementSplit(element, /\d/, '')
        }

        array[index] = element;
    });  // forEach
    return array;
} // testEach
/**********************************************************/ 

/* Reconstructs the elements into a string */ 
function reJoin(modArray){
    return modArray.join(" ");
}

/* Executes all the above functions */ 
function execute () {
    const newSequence = sequence($("#input").val())
    const titTat = titForTat(newSequence);
    const array = makeArray(titTat);
    const modArray = testEach(array);
    const outputVal = reJoin(modArray);
    $('#output').val(outputVal);
}

$("#input_button").click(execute);