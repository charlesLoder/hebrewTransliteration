/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 40);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequence = void 0;
var consonants = /[\u{05D0}-\u{05F2}]/u;
var ligature = /[\u{05C1}-\u{05C2}]/u;
var dagesh = /[\u{05BC},\u{05BF}]/u; // includes rafe
var vowels = /[\u{05B0}-\u{05BB},\u{05C7}]/u;
var accents = /[\u{0590}-\u{05AF},\u{05BD}-\u{05BE},\u{05C0},\u{05C3}]/u;
var Char = /** @class */ (function () {
    function Char(char) {
        this.char = char;
        this.posIndex = this.findPos(this.char);
    }
    Char.prototype.findPos = function (char) {
        if (consonants.test(char)) {
            return 0;
        }
        if (ligature.test(char)) {
            return 1;
        }
        if (dagesh.test(char)) {
            return 2;
        }
        if (vowels.test(char)) {
            return 3;
        }
        if (accents.test(char)) {
            return 4;
        }
        return 10;
    };
    return Char;
}());
exports.Sequence = function (text) {
    var splits = /(?=[\u{05D0}-\u{05F2}])/u;
    var charClusters = text.split(splits);
    var mapClusters = charClusters.map(function (cluster) { return __spread(cluster).map(function (char) { return new Char(char); }); });
    var sortClusters = mapClusters.map(function (cluster) { return cluster.sort(function (a, b) { return a.posIndex - b.posIndex; }); });
    var redClusters = sortClusters.map(function (cluster) { return cluster.reduce(function (a, c) { return a + c.char; }, ""); });
    var seqText = redClusters.reduce(function (a, c) { return a + c; });
    return seqText;
};
//# sourceMappingURL=sequence.js.map

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Remove = void 0;
var cantillation = /[\u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}]/gu;
var vowels = /[\u{05B0}-\u{05BD}\u{05BF}\u{05C7}]/gu;
var shinDot = /\u{05C1}/gu;
var sinDot = /\u{05C2}/gu;
var removeItem = function (text, item) { return text.replace(item, ""); };
exports.Remove = function (text, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.removeVowels, removeVowels = _c === void 0 ? false : _c, _d = _b.removeShinDot, removeShinDot = _d === void 0 ? false : _d, _e = _b.removeSinDot, removeSinDot = _e === void 0 ? false : _e;
    var remCantillation = removeItem(text, cantillation);
    var remVowels = removeVowels ? removeItem(remCantillation, vowels) : remCantillation;
    var remShin = removeShinDot ? removeItem(remVowels, shinDot) : remVowels;
    var remSin = removeSinDot ? removeItem(remShin, sinDot) : remShin;
    return remSin;
};
//# sourceMappingURL=remove.js.map

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sequence = exports.remove = exports.transliterate = void 0;
var transliterate_1 = __webpack_require__(3);
var sequence_1 = __webpack_require__(0);
var remove_1 = __webpack_require__(1);
exports.transliterate = function (text, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.isSequenced, isSequenced = _c === void 0 ? true : _c, _d = _b.qametsQatan, qametsQatan = _d === void 0 ? false : _d, _e = _b.isSimple, isSimple = _e === void 0 ? false : _e;
    var normalized = text.normalize("NFKD");
    return transliterate_1.Transliterate(normalized, { isSequenced: isSequenced, qametsQatan: qametsQatan, isSimple: isSimple });
};
exports.remove = function (text, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.removeVowels, removeVowels = _c === void 0 ? false : _c, _d = _b.removeShinDot, removeShinDot = _d === void 0 ? false : _d, _e = _b.removeSinDot, removeSinDot = _e === void 0 ? false : _e;
    var normalized = text.normalize("NFKD");
    var removed = remove_1.Remove(normalized, { removeVowels: removeVowels, removeShinDot: removeShinDot, removeSinDot: removeSinDot });
    var noMetheg = removed.replace(/\u{05BD}/gu, "");
    var sequenced = sequence_1.Sequence(noMetheg);
    return sequenced;
};
exports.sequence = function (text) {
    var normalized = text.normalize("NFKD");
    return sequence_1.Sequence(normalized);
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Transliterate = void 0;
var sequence_1 = __webpack_require__(0);
var remove_1 = __webpack_require__(1);
var qametsQatan_1 = __webpack_require__(4);
var titForTat_1 = __webpack_require__(5);
var testEach_1 = __webpack_require__(7);
exports.Transliterate = function (text, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.isSequenced, isSequenced = _c === void 0 ? true : _c, _d = _b.qametsQatan, qametsQatan = _d === void 0 ? false : _d, _e = _b.isSimple, isSimple = _e === void 0 ? false : _e;
    var newSeq = isSequenced ? sequence_1.Sequence(text) : text;
    var rmvCantillation = remove_1.Remove(newSeq, { removeShinDot: true });
    var titTat = titForTat_1.titForTat(rmvCantillation);
    var array = titTat.split(/(\s|\S*\-)/);
    var sanitized = qametsQatan ? qametsQatan_1.qametsQ(array) : array;
    var modArray = testEach_1.testEach(sanitized, { isSimple: isSimple });
    var transliteration = modArray.reduce(function (a, c) { return a + c; }, "");
    return transliteration;
};
//# sourceMappingURL=transliterate.js.map

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qametsQ = void 0;
var qQsnippets = [
    "ʾāzǝn",
    "ʾākǝl",
    "ʾākǝl",
    "ʾāniyּ",
    "ʾāpǝn",
    "ʾārǝḥ",
    "ʾārǝkּ",
    "ʾāšǝr",
    "bāʾǝš",
    "bāšǝtּ",
    "bּāšǝtּ",
    "gābǝh",
    "gּābǝh",
    "gādǝl",
    "gּādǝl",
    "gārǝn",
    "gּārǝn",
    "ḥādǝš",
    "ḥākǝm",
    "ḥālǝyֽwō",
    "ḥālǝyōw",
    "ḥānּēniy",
    "ḥāpǝn",
    "ḥāpǝniy",
    "ḥāpǝšiy",
    "ḥāpǝšiyt",
    "ḥāq-",
    "ḥārǝb",
    "ḥārǝneper",
    "ḥārǝpּ",
    "ḥāšǝkּ",
    "yāpǝy",
    "yāšǝr",
    "kāl-",
    "kּāl-",
    "mār-",
    "mārǝdּǝkay",
    "mātǝn",
    "sālǝtּ",
    "ʿāzּ",
    "ʿāmǝriy",
    "ʿānǝy",
    "ʿāpǝr",
    "ʿārǝl",
    "ʿārǝpּ",
    "ʿāšǝr",
    "ṣārǝkּ",
    "qādǝq",
    "qādǝš",
    "qārǝbּ",
    "qārǝḥ",
    "rāb-",
    "rāgǝz",
    "rāḥǝbּ",
    "šārǝš",
    "šārāš",
    "šּārāš",
    "tּākǝniyt",
    "tām-",
    "tּām-"
];
var qQRgx = qQsnippets.map(function (snippet) { return new RegExp(snippet, "m"); });
var qametsQatanDict = {
    // for certain inflected and contextual occurences
    bּǝʾābǝdan: "bǝʾobdan",
    hāʾābǝnāyim: "hāʾobnāyim",
    ḥāqǝkā: "ḥoqkā",
    ḥāqǝkem: "ḥoqkem",
    hadּārǝbāֽn: "haddorbān",
    lǝʾākǝlāֽh: "lǝʾoklāh",
    haqּārǝbāֽn: "haqqorbān",
    ḥāpǝraʿ: "ḥopraʿ",
    wayּāmāt: "wayּāmot",
    wayּānās: "wayּānos",
    wayּāqām: "wayּāqom",
    wayּārām: "wayּārām",
    wayּāšׁāb: "wayּāšׁob",
    watּāmāt: "watּāmot",
    watּāqām: "watּāqom",
    watּāšׁāb: "watּāšׁob",
    wǝhāֽʿāpǝniy: "wǝhāʿopniy",
    tּākǝniֽyt: "tokniyt" // with silluq
};
exports.qametsQ = function (text) {
    return text.map(function (word) {
        var e_1, _a;
        //   if there is no qamets char, return
        if (!/ā/.test(word)) {
            return word;
        }
        if (qametsQatanDict[word]) {
            return qametsQatanDict[word];
        }
        if (/ŏ/.test(word)) {
            var pos = word.indexOf("ŏ");
            if (word.charAt(pos - 2) === "ā") {
                return word.substring(pos - 2) + "o" + word.substring(pos - 1);
            }
        }
        try {
            for (var qQRgx_1 = __values(qQRgx), qQRgx_1_1 = qQRgx_1.next(); !qQRgx_1_1.done; qQRgx_1_1 = qQRgx_1.next()) {
                var rgx = qQRgx_1_1.value;
                if (rgx.test(word)) {
                    var newRgx = rgx.source.split("ā").join("o");
                    var matches = rgx.source.match(/ā/g);
                    // checks for qQ forms w/ two ā's
                    if (matches && matches.length >= 2) {
                        var parts = rgx.source.split("ā");
                        var firstMatch = [parts.shift(), parts.join("ā")];
                        newRgx = firstMatch.join("o");
                    }
                    return word.split(rgx).join(newRgx);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (qQRgx_1_1 && !qQRgx_1_1.done && (_a = qQRgx_1.return)) _a.call(qQRgx_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return word;
    });
};
//# sourceMappingURL=qametsQatan.js.map

/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(41);


/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

var inputBtn = document.querySelector("#input_button");
var input = document.querySelector("#input");
var output = document.querySelector("#output");
var simpleBtn = document.querySelector("#isSimple");
var qametsBtn = document.querySelector("#qametsQatan");
var qametsInfo = document.querySelector("#qametsInfo");
var heb = __webpack_require__(2);
var transliterate = heb.transliterate;

simpleBtn.addEventListener("change", function (e) {
  if (e.target.checked) {
    output.placeholder = "ivrit";
  } else {
    output.placeholder = "ʿibrît";
  }
});

// start off hidden
qametsInfo.hidden = true;
qametsBtn.addEventListener("change", function (e) {
  if (e.target.checked) {
    qametsInfo.hidden = false;
  } else {
    qametsInfo.hidden = true;
  }
});

inputBtn.addEventListener("click", function () {
  try {
    var qametsQatanVal = qametsBtn.checked;
    var isSimpleVal = simpleBtn.checked;
    var hebText = input.value;
    var niqqud = /[,\u05B0-\u05BC\u05C7]/;
    if (!niqqud.test(hebText)) {
      var mssg = "The text entered does not have any niqqud (vowels).\nThis will only transliterate consonants.\nVisit https://nakdan.dicta.org.il/ for adding niqqud to text";
      alert(mssg);
    }
    var transText = transliterate(hebText, {
      isSequenced: true,
      qametsQatan: qametsQatanVal,
      isSimple: isSimpleVal
    });
    output.value = transText;
  } catch (e) {
    alert("There was an error: " + e.message);
  }
});

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.titForTat = void 0;
var hebCharsTrans_1 = __webpack_require__(6);
exports.titForTat = function (text) {
    return __spread(text).map(function (char) { return (char in hebCharsTrans_1.transliterateMap ? hebCharsTrans_1.transliterateMap[char] : char); })
        .reduce(function (a, c) { return a + c; }, "");
};
//# sourceMappingURL=titForTat.js.map

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.transliterateMap = void 0;
exports.transliterateMap = {
    //   niqqud
    "\u05B0": "ǝ",
    "\u05B1": "ĕ",
    "\u05B2": "ă",
    "\u05B3": "ŏ",
    "\u05B4": "i",
    "\u05B5": "ē",
    "\u05B6": "e",
    "\u05B7": "a",
    "\u05B8": "ā",
    "\u05B9": "ō",
    "\u05BA": "ō",
    "\u05BB": "u",
    //  "\u{05BC}": "", // HEBREW POINT DAGESH OR MAPIQ (U+05BC)
    //  "\u{05BD}": "", // HEBREW POINT METEG (U+05BD)
    "\u05BE": "-",
    "\u05C7": "ο",
    //   consonants
    א: "ʾ",
    ב: "b",
    ג: "g",
    ד: "d",
    ה: "h",
    ו: "w",
    ז: "z",
    ח: "ḥ",
    ט: "ṭ",
    י: "y",
    ך: "k",
    כ: "k",
    ל: "l",
    ם: "m",
    מ: "m",
    ן: "n",
    נ: "n",
    ס: "s",
    ע: "ʿ",
    ף: "p",
    פ: "p",
    ץ: "ṣ",
    צ: "ṣ",
    ק: "q",
    ר: "r",
    ש: "š",
    ת: "t",
    "\u05EF": "",
    װ: "",
    ױ: "",
    ײ: "" // HEBREW LIGATURE YIDDISH DOUBLE YOD (U+05F2)
};
//# sourceMappingURL=hebCharsTrans.js.map

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEach = void 0;
var changeElementSplit = function (input, split, join) { return input.split(split).join(join); };
var changeElementSubstr = function (input, index, join) {
    return input.substring(0, index) + join + input.substring(index + 1);
};
var academicRules = function (array, _a) {
    var _b = (_a === void 0 ? {} : _a).isSimple, isSimple = _b === void 0 ? false : _b;
    return array.map(function (element) {
        if (element === " " || !element) {
            return element;
        }
        // Tests for shin non-ligatures
        // if (/\u{05C1}/u.test(element)) {
        //   element = changeElementSplit(element, /\u{05C1}/u, "");
        // }
        // Tests for sin non-ligatures
        if (/š\u{05C2}/u.test(element)) {
            element = changeElementSplit(element, /š\u{05C2}/u, "ś");
        }
        // remove metheg that is left in for checking qamets qatan vs gadol
        if (/\u{05BD}/u.test(element)) {
            element = changeElementSplit(element, /\u{05BD}/u, "");
        }
        // Tests for hiriq-yod mater
        if (/iy(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|\u{05BC})/u.test(element)) {
            element = changeElementSplit(element, /iy(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|\u05BC)/, "î");
        }
        // Tests for tsere-yod mater
        if (/ēy(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|\u{05BC})/u.test(element)) {
            element = changeElementSplit(element, /ēy(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|\u05BC)/, "ê");
        }
        // Tests for seghol-yod mater
        if (/ey(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|\u{05BC})/u.test(element)) {
            element = changeElementSplit(element, /ey(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|ō|u|\u05BC)/, "ê");
        }
        // Tests for waw as a holem-mater
        if (/wō/.test(element)) {
            // this is a workaround for lack of lookbehind support
            var rev = __spread(element).reverse().reduce(function (a, c) { return a + c; });
            if (/ōw(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|u)/.test(rev)) {
                rev = changeElementSplit(rev, /ōw(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|u)/, "ô");
            }
            element = __spread(rev).reverse().reduce(function (a, c) { return a + c; });
        }
        // Tests for waw as a holem-mater
        // this will catch a waw as a consonant like - C+ō+w+V+C > CōwVC
        if (/ōw(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|u|\u{05BC})/u.test(element)) {
            element = changeElementSplit(element, /ōw(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|u|\u05BC)/, "ô");
        }
        // Tests for waw as a shureq-mater
        if (/w\u{05BC}(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|â|o|ô|u|û)/u.test(element)) {
            element = changeElementSplit(element, /w\u05BC(?!ǝ|ĕ|ă|ŏ|i|ē|e|a|ā|â|o|ô|u|û)/, "û");
        }
        // Tests for He as a final mater
        /* if using simple version, ēh remains so that it is passed into simpleRules
        if not, then there would be now way to distinguish between ê from tsere-yod vs he-mater */
        if (!isSimple) {
            if (/āh(?=$|-)/m.test(element)) {
                element = changeElementSplit(element, /āh(?=$|-)/m, "â");
            }
            else if (/ēh(?=$|-)/m.test(element)) {
                element = changeElementSplit(element, /ēh(?=$|-)/m, "ê");
            }
            else if (/eh(?=$|-)/m.test(element)) {
                element = changeElementSplit(element, /eh(?=$|-)/m, "ê");
            }
        }
        // tests for he with mappiq or furtive patach
        if (/h\u{05BC}$/mu.test(element)) {
            element = changeElementSplit(element, /h\u{05BC}$/mu, "h");
        }
        else if (/h\u{05BC}a$/mu.test(element)) {
            element = changeElementSplit(element, /h\u{05BC}a$/mu, "ah");
        }
        else if (/ḥa$/m.test(element)) {
            element = changeElementSplit(element, /ḥa$/m, "aḥ");
        }
        else if (/ʿa$/m.test(element)) {
            element = changeElementSplit(element, /ʿa$/m, "aʿ");
        }
        // Tests if a shewa exists in the element
        if (/ǝ/.test(element)) {
            var pos = element.indexOf("ǝ");
            while (pos !== -1) {
                // shewa at the end of a word
                if (element.charAt(element.length - 1) === "ǝ") {
                    element = changeElementSubstr(element, element.length - 1, "");
                }
                // if the shewa is preceded by a short vowel
                if (/ǝ|a|e|i|u|o/.test(element.charAt(pos - 2))) {
                    // if it SQeNeM LeVY letters in wayyiqtol forms
                    if (/s|ṣ|š|ś|q|n|m|l|w|y/.test(element.charAt(pos - 1)) && /w/.test(element.charAt(pos - 3))) {
                        element = element;
                    }
                    else {
                        element = changeElementSubstr(element, pos, "");
                    }
                }
                pos = element.indexOf("ǝ", pos + 1);
            }
            element = element;
        }
        // tests for a doubling dagesh
        if (/\u{05BC}/u.test(element)) {
            var elArray_1 = element.split("");
            elArray_1.forEach(function (e, i) {
                if (e === "\u05BC" && /a|ā|e|ē|i|î|u|û|o|ō|ô/.test(elArray_1[i - 2]) && Boolean(elArray_1[i - 2])) {
                    elArray_1[i] = elArray_1[i - 1];
                }
            });
            element = elArray_1.join("");
        }
        //  tests for yhwh
        if (element === "yǝhwâ") {
            element = "yhwh";
        }
        else if (element.includes("yǝhwâ")) {
            element = changeElementSplit(element, /yǝhwâ/, "yhwh");
        }
        else if (element.includes("yhwâ")) {
            element = changeElementSplit(element, /yhwâ/, "yhwh");
        }
        // removes any remaining dageshes
        if (/\u{05BC}/u.test(element)) {
            element = changeElementSplit(element, /\u{05BC}/u, "");
        }
        return element;
    }); // map
};
var simpleRules = function (array) {
    return array.map(function (element) {
        if (element === " " || !element) {
            return element;
        }
        // remove aleph half-ring
        if (/ʾ/.test(element)) {
            element = changeElementSplit(element, /ʾ/, "");
        }
        // remove ayin half-ring
        if (/ʿ/.test(element)) {
            element = changeElementSplit(element, /ʿ/, "");
        }
        // simplify he-mater
        if (/āh$/m.test(element)) {
            element = changeElementSplit(element, /āh$/m, "ah");
        }
        else if (/ēh$/.test(element)) {
            element = changeElementSplit(element, /ēh$/m, "eh");
        }
        // simplify hiriq-yod
        if (/î/.test(element)) {
            element = changeElementSplit(element, /î/, "i");
        }
        // simplify tsere-yod / seghol-yod
        if (/ê/.test(element)) {
            element = changeElementSplit(element, /ê/, "e");
        }
        // simplify holem-waw
        if (/ô/.test(element)) {
            element = changeElementSplit(element, /ô/, "o");
        }
        // simplify shureq
        if (/û/.test(element)) {
            element = changeElementSplit(element, /û/, "u");
        }
        // remove doubling of shin
        if (/šš/.test(element)) {
            element = changeElementSplit(element, /šš/, "š");
        }
        // remove doubling of tsade
        if (/ṣṣ/.test(element)) {
            element = changeElementSplit(element, /ṣṣ/, "ṣ");
        }
        // simplify long-a
        if (/ā/.test(element)) {
            element = changeElementSplit(element, /ā/, "a");
        }
        // simplify short-a
        if (/ă/.test(element)) {
            element = changeElementSplit(element, /ă/, "a");
        }
        // simplify long-e
        if (/ē/.test(element)) {
            element = changeElementSplit(element, /ē/, "e");
        }
        // simplify short-e
        if (/ĕ/.test(element)) {
            element = changeElementSplit(element, /ĕ/, "e");
        }
        // simplify long-i
        if (/ī/.test(element)) {
            element = changeElementSplit(element, /ī/, "i");
        }
        // simplify long-o
        if (/ō/.test(element)) {
            element = changeElementSplit(element, /ō/, "o");
        }
        // simplify short-o
        if (/ŏ/.test(element)) {
            element = changeElementSplit(element, /ŏ/, "o");
        }
        // simplify long-u
        if (/ū/.test(element)) {
            element = changeElementSplit(element, /ū/, "u");
        }
        // simplify shewa
        if (/ǝ/.test(element)) {
            element = changeElementSplit(element, /ǝ/, "e");
        }
        // spirantized cons
        /* Since the negative lookbehind regex is not well supported,
        the string is reversed and then the regex searches the pattern of
        the consonant that is followed by a vowel (which preceded it in the original direction)
        */
        var rev = __spread(element).reverse().reduce(function (a, c) { return a + c; }, "");
        // change b > v
        if (/b/.test(element) && !/bb/.test(element)) {
            if (/b(?=[aeiou])/.test(rev)) {
                rev = changeElementSplit(rev, /b(?=[aeiou])/, "v");
            }
        }
        // change p > f
        if (/p/.test(element) && !/pp/.test(element)) {
            if (/p(?=[aeiou])/.test(rev)) {
                rev = changeElementSplit(rev, /p(?=[aeiou])/, "f");
            }
        }
        // change k > kh
        if (/k/.test(element) && !/kk/.test(element)) {
            if (/k(?=[aeiou])/.test(rev)) {
                //   when the string is reversed back 'hk' > 'kh'
                rev = changeElementSplit(rev, /k(?=[aeiou])/, "hk");
            }
        }
        element = __spread(rev).reverse().reduce(function (a, c) { return a + c; }, "");
        // simplify ṭet
        if (/ṭ/.test(element)) {
            element = changeElementSplit(element, /ṭ/, "t");
        }
        // simplify tsade
        if (/ṣ/.test(element)) {
            element = changeElementSplit(element, /ṣ/, "ts");
        }
        // simplify shin
        if (/š/.test(element)) {
            element = changeElementSplit(element, /š/, "sh");
        }
        // simplify sin
        if (/ś/.test(element)) {
            element = changeElementSplit(element, /ś/, "s");
        }
        // simplify ḥet
        if (/ḥ/.test(element)) {
            element = changeElementSplit(element, /ḥ/, "kh");
        }
        // simplify waw
        if (/w/.test(element)) {
            element = changeElementSplit(element, /w/, "v");
        }
        //  tests for yhwh
        if (element === "yehvah") {
            element = "yhwh";
        }
        return element;
    }); // map
};
exports.testEach = function (array, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.qametsQatan, qametsQatan = _c === void 0 ? false : _c, _d = _b.isSimple, isSimple = _d === void 0 ? false : _d;
    var academic = academicRules(array, { qametsQatan: qametsQatan, isSimple: isSimple });
    return !isSimple ? academic : simpleRules(academic);
};
//# sourceMappingURL=testEach.js.map

/***/ })

/******/ });
//# sourceMappingURL=transliterate.js.map