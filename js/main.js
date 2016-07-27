/**
 * Created by sfei on 10/9/2015.
 */

var validateJson = function (json) {
    try {
        jQuery.parseJSON(json);
        return true;
    } catch (err) {
        return false;
    }
};

var showValidationMsg = function (valid) {
    toastr.clear();
    if (valid) {
        toastr["success"]("Valid JSON")
    } else {
        toastr["error"]("Invalid JSON")
    }
};

var setTextAreaValue = function (json) {
    var textArea = $('textarea');
    textArea.val(json);
};

var getTextAreaValue = function () {
    var textArea = $('textarea');
    return textArea.val().replace(/(?:\r\n|\r|\n)/g, '');
};

var validateJsonAfterFormat = function (json) {
    if (!validateJson(json)) {
        showValidationMsg(false);
    }
};

var onFormatClick = function () {
    var json = getTextAreaValue(),
        i,
        il = json.length,
        tab = "    ",
        newJson = "",
        indentLevel = 0,
        inString = false,
        currentChar = null;

    var repeat = function repeat(s, count) {
        return new Array(count + 1).join(s);
    };

    for (i = 0; i < il; i++) {
        currentChar = json.charAt(i);
        switch (currentChar) {
            case '{':
            case '[':
                if (!inString) {
                    newJson += currentChar + "\n" + repeat(tab, indentLevel + 1);
                    indentLevel += 1;
                } else {
                    newJson += currentChar;
                }
                break;
            case '}':
            case ']':
                if (!inString) {
                    indentLevel -= 1;
                    newJson += "\n" + repeat(tab, indentLevel) + currentChar;
                } else {
                    newJson += currentChar;
                }
                break;
            case ',':
                if (!inString) {
                    newJson += ",\n" + repeat(tab, indentLevel);
                } else {
                    newJson += currentChar;
                }
                break;
            case ':':
                if (!inString) {
                    newJson += ": ";
                } else {
                    newJson += currentChar;
                }
                break;
            case ' ':
            case "\n":
            case "\t":
                if (inString) {
                    newJson += currentChar;
                }
                break;
            case '"':
                if (i > 0 && json.charAt(i - 1) !== '\\') {
                    inString = !inString;
                }
                newJson += currentChar;
                break;
            default:
                newJson += currentChar;
                break;
        }
    }
    setTextAreaValue(newJson);
    validateJsonAfterFormat(newJson);
};

var onCompressClick = function () {
    var json = getTextAreaValue(),
        e = json.replace(/\n/g, " ").replace(/\r/g, " "),
        c = [], b = !1, d, g,
        len = e.length,
        newJson;
    for (d = 0; d < len; d++) {
        g = e.charAt(d);
        if (b && g === b) {
            e.charAt(d - 1) !== "\\" && (b = !1);
        }
        else if (!b && (g === '"' || g === "'")) {
            b = g;
        }
        else if (!b && (g === " " || g === "\t")) {
            g = "";
        }
        c.push(g)
    }
    newJson = c.join("");
    setTextAreaValue(newJson);
    validateJsonAfterFormat(newJson);
};
var onValidateClick = function () {
    var json = getTextAreaValue(),
        valid = validateJson(json);
    showValidationMsg(valid);
};

var onClearClick = function () {
    setTextAreaValue('');
};