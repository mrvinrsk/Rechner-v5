/* Toasts */
$(function () {
    getWrapper();
});

let wrapper = null;

function getWrapper() {
    const wrapperEle = document.createElement("div");
    wrapperEle.classList.add("toast_wrapper");

    if (document.querySelector(".toast_wrapper") !== null) {
        wrapper = document.querySelector(".toast_wrapper");
    } else {
        document.body.appendChild(wrapperEle);
        wrapper = wrapperEle;
    }
}

let defaultToast = {
    autoClose: true,
    stay: 3000,
    closeButton: false,
    boxShadow: true,
    border: false
};

function toast(title, description, options = defaultToast) {
    // Set default options if not set in custom options
    for (let option in defaultToast) {
        if (options[option] === undefined || options[option] === null) {
            options[option] = defaultToast[option];
        }
    }

    if (options["autoClose"] == false) {
        options["closeButton"] = true;
    }

    function slideOut() {
        if (toast != null) {
            $(toast).animate(
                {
                    opacity: 0,
                    right: "-100%"
                },
                500,
                function () {
                    wrapper.removeChild(toast);
                }
            );
        }
    }

    const toast = document.createElement("div");
    toast.classList.add("toast");

    const titleEl = document.createElement("span");
    titleEl.textContent = title;
    titleEl.classList.add("toast_title");

    const descriptionEl = document.createElement("p");
    descriptionEl.textContent = description;
    descriptionEl.classList.add("toast_description");

    toast.appendChild(titleEl);
    toast.appendChild(descriptionEl);

    if (options.boxShadow == true || options.boxShadow == "true") {
        toast.style.boxShadow = "0 0 25px rgba(0 0 0 / 5%)";
    }

    if (options.border == true || options.border == "true") {
        toast.style.border = "1px solid #888";
    }

    wrapper.appendChild(toast);

    let slideoutTimeout = null;
    if (options.autoClose == true || options.autoClose == "true") {
        slideoutTimeout = setTimeout(() => {
            slideOut();
        }, options.stay);
    }

    if (options.closeButton == true || options.closeButton == "true") {
        const closeEl = document.createElement("span");
        closeEl.classList.add("toast_close");
        closeEl.textContent = "x";
        closeEl.addEventListener("click", () => {
            slideOut();

            if (slideoutTimeout != null) {
                clearTimeout(slideoutTimeout);
            }
        });

        toast.appendChild(closeEl);
    }
}