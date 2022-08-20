function calc(fn) {
    return new Function('return ' + fn)();
}

function remove() {
    let input = document.querySelector('#calc');

    if (input.value !== "") {
        input.value = input.value.substring(0, input.value.length - 1);
    }
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

let result = false;
let c = "";

$(function () {
    let numbers = document.querySelectorAll('[data-number]');
    let input = document.querySelector('#calc');


    numbers.forEach(element => {
        let number = element.dataset.number;

        element.textContent = number;
        element.title = "Klick mich hart für " + number + "!";

        element.addEventListener('click', () => {
            if (number !== "=") {
                input.value += number;
            } else {
                input.value = calc(input.value);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        let kc = event.key;
        let button = document.querySelector('[data-number="' + kc + '"]');

        if (button != null) {
            button.classList.add('active');
        }
    });

    document.addEventListener('keyup', (event) => {
        let kc = event.key;
        let button = document.querySelector('[data-number="' + kc + '"]');

        if (kc === "c") {
            if (result) {
                copyTextToClipboard(input.value);
                toast('Ergebnis kopiert', 'Du hast das Ergebnis deiner Rechnung (' + c + ') erfolgreich kopiert.');
            }else {
                toast('Kein Ergebnis', 'Du musst erst eine Rechnung berechnen lassen, um das Ergebnis kopieren zu können.');
            }
        }

        result = (kc === "=" || kc === "Enter");

        if (button != null) {
            button.classList.remove('active');
            input.value += kc;
            c = input.value;
        } else if (kc === "+" || kc === "-" || kc === "*" || kc === "/") {
            input.value += kc;
            c = input.value;
        } else if (kc === "=" || kc === "Enter") {
            input.value = calc(input.value);
        } else if (kc === "Backspace") {
            remove();
            c = input.value;
        } else if (kc === "Escape") {
            input.value = "";
            c = input.value;
        }
    });

    document.querySelector('#back').addEventListener('click', () => {
        remove();
    });

    ['#info', '#info-popup-close', '#info-popup-wrapper'].forEach(selector => {
        document.querySelector(selector).addEventListener('click', () => {
            document.querySelector('#info-popup-wrapper').classList.toggle('active');
        });
    });

    document.querySelector('#info-popup-wrapper > div').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
    });
});