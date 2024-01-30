/**
 * Scalc.js - Basic calculator
 *
 * @author     LS
 * @copyright  2022 LS
 * @license    MIT License
 */
/*
| ------------------------------------------------------------------------------
| Calculator options
| ------------------------------------------------------------------------------
|
| scalc({
|   modal: true       // Default false
|   draggable: false  // Default true
| });
| ------------------------------------------------------------------------------
*/
function scalc(options = {}) {
    var init = function () {
        var calculator = document.getElementById("calculator");
        /*
        | ----------------------------------------------------------------------
        | Calculator structure
        | ----------------------------------------------------------------------
        */
        var html = `
            <div id="window" tabindex="0">
              <div id="topbar">
                <a href="Close" tabindex="-1">X</a>
              </div>
              <div id="display"></div>
              <ul>
                <li><a href="Escape" tabindex="-1">C</a></li>
                <li><a href="%" tabindex="-1">%</a></li>
                <li><a href="/" tabindex="-1">/</a></li>
                <li><a href="*" tabindex="-1">*</a></li>
                <li><a href="7" tabindex="-1">7</a></li>
                <li><a href="8" tabindex="-1">8</a></li>
                <li><a href="9" tabindex="-1">9</a></li>
                <li><a href="-" tabindex="-1">-</a></li>
                <li><a href="4" tabindex="-1">4</a></li>
                <li><a href="5" tabindex="-1">5</a></li>
                <li><a href="6" tabindex="-1">6</a></li>
                <li><a href="+" tabindex="-1">+</a></li>
                <li><a href="1" tabindex="-1">1</a></li>
                <li><a href="2" tabindex="-1">2</a></li>
                <li><a href="3" tabindex="-1">3</a></li>
                <li><a href="Enter" class="equal" tabindex="-1">=</a></li>
                <li><a href="0" class="zero" tabindex="-1">0</a></li>
                <li><a href="." class="dot" tabindex="-1">.</a></li>
              </ul>
            </div>`;
        /*
        | ----------------------------------------------------------------------
        | Options
        | ----------------------------------------------------------------------
        */
        options.modal     = (options.modal === true) ? true : false;
        options.draggable = (options.draggable === false) ? false : true;
        if (options.modal === true) {
            calculator.innerHTML = '<div id="container"><div id="draggable">' +
                                    html + '</div></div>';
            var _window = calculator.querySelector("#window");
            var width   = ((window.innerWidth - _window.offsetWidth) / 2);
            var height  = ((window.innerHeight - _window.offsetHeight) / 2);
            calculator.querySelector("#draggable").style.left = width  + "px";
            calculator.querySelector("#draggable").style.top  = height + "px";
            var $draggable = function () {
                var container = calculator.querySelector("#container");
                var topbar    = calculator.querySelector("#topbar");
                return {
                    resize : function () {
                        var width = window.innerWidth ||
                               document.documentElement.clientWidth ||
                               document.body.clientWidth ||
                               document.body.offsetWidth;
                        var height = window.innerHeight ||
                               document.documentElement.clientHeight ||
                               document.body.clientHeight ||
                               document.body.offsetHeight;
                        container.style.width  = width  + "px";
                        container.style.height = height + "px";
                    },
                    move : function (divid, xpos, ypos) {
                        divid.style.left = xpos + "px";
                        divid.style.top  = ypos + "px";
                    },
                    startMoving : function (divid, evt) {
                        addClass(topbar, "cursor-move");
                        evt = evt || window.event;
                        var posX     = evt.clientX,
                            posY     = evt.clientY,
                            divTop   = divid.style.top,
                            divLeft  = divid.style.left,
                            eWi      = parseInt(divid.style.width),
                            eHe      = parseInt(divid.style.height),
                            cWi      = parseInt(container.style.width),
                            cHe      = parseInt(container.style.height);
                            divTop   = divTop.replace("px", "");
                            divLeft  = divLeft.replace("px", "");
                        var diffX    = posX - divLeft,
                            diffY    = posY - divTop;
                        document.onmousemove = function (evt) {
                            evt = evt || window.event;
                            var posX = evt.clientX,
                                posY = evt.clientY,
                                aX   = posX - diffX,
                                aY   = posY - diffY;
                            if (aX < 0) aX = 0;
                            if (aY < 0) aY = 0;
                            if (aX + eWi > cWi) aX = cWi - eWi;
                            if (aY + eHe > cHe) aY = cHe - eHe;
                            $draggable.move(divid, aX, aY);
                        }
                    },
                    stopMoving : function () {
                        var a = document.createElement("script");
                        removeClass(topbar, "cursor-move");
                        document.onmousemove = function () {};
                    },
                    init : function () {
                        var element = calculator.querySelector("#draggable");
                        var resize_scrollbar_screen = function () {
                            var width  = document.documentElement.scrollWidth;
                            var height = document.documentElement.scrollHeight;
                            container.style.width  = width  + "px";
                            container.style.height = height + "px";
                        };
                        $draggable.resize();
                        window.onresize = function () {
                            $draggable.resize();
                        };
                        window.onscroll = function () {
                            resize_scrollbar_screen();
                        };
                        topbar.onmousedown = function (e) {
                            var _window = calculator.querySelector("#window");
                            resize_scrollbar_screen();
                            element.style.width  = "480px";
                            element.style.height = _window.offsetHeight + "px";
                            if (options.draggable === true) {
                                $draggable.startMoving(element);
                            }
                        };
                        document.onmouseup = function () {
                            if (options.draggable === true) {
                                $draggable.stopMoving();
                            }
                        };
                    }
                }
            }(); $draggable.init();
        } else {
            calculator.innerHTML = html;
            var _window = calculator.querySelector("#window");
            var width   = ((window.innerWidth - _window.offsetWidth) / 2);
            var height  = ((window.innerHeight - _window.offsetHeight) / 2);
            _window.style.left = width  + "px";
            _window.style.top  = height + "px";
            if (options.draggable === true) {
                (function (elmnt) {
                    var pos1   = 0,
                        pos2   = 0,
                        pos3   = 0,
                        pos4   = 0,
                        topbar = calculator.querySelector("#topbar");
                    topbar.onmousedown = dragMouseDown;
                    function dragMouseDown(e) {
                        addClass(topbar, "cursor-move");
                        e = e || window.event;
                        e.preventDefault();
                        // get the mouse cursor position at startup:
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        document.onmouseup = closeDragElement;
                        // call a function whenever the cursor moves:
                        document.onmousemove = elementDrag;
                    }
                    function elementDrag(e) {
                        e = e || window.event;
                        e.preventDefault();
                        var ww = window.innerWidth;
                        var wh = window.innerHeight;
                        var ew = elmnt.offsetWidth;
                        var eh = elmnt.offsetHeight;
                        // calculate the new cursor position:
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        // set the element's new position:
                        elmnt.style.top  = (elmnt.offsetTop  - pos2) + "px";
                        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                        if (elmnt.offsetLeft - pos1 >= ww - ew) {
                            elmnt.style.left = ww-ew + "px";
                        }
                        if (elmnt.offsetTop - pos2 >= wh - eh) {
                            elmnt.style.top = wh-eh + "px";
                        }
                        if (elmnt.offsetTop - pos2 <= 0 || eh >= wh) {
                            elmnt.style.top = "0";
                        }
                        if (elmnt.offsetLeft - pos1 <= 0 || ew >= ww) {
                            elmnt.style.left = "0";
                        }
                    }
                    function closeDragElement() {
                        removeClass(topbar, "cursor-move");
                        document.onmouseup   = null;
                        document.onmousemove = null;
                    }
                })(_window);
            }
        }
        /*
        | ----------------------------------------------------------------------
        | Add/Remove Classes
        | ----------------------------------------------------------------------
        */
        var css_class = "button-pressed";
        var hasClass  = function (el, className) {
            if (el.classList) {
                return el.classList.contains(className);
            } else {
                var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
                return !!el.className.match(reg);
            }
        };
        var addClass = function (el, className) {
            if (el.classList) {
                el.classList.add(className);
            } else if (!hasClass(el, className)) {
                el.className += " " + className;
            }
        };
        var removeClass = function (el, className) {
            if (el.classList) {
                el.classList.remove(className);
            } else if (hasClass(el, className)) {
                var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
                el.className=el.className.replace(reg, " ");
            }
        };
        /*
        | ----------------------------------------------------------------------
        | Calculation memory and display screen
        | ----------------------------------------------------------------------
        */
        var display = calculator.querySelector("#display");
        var memory  = "";
        /*
        | ----------------------------------------------------------------------
        | Clean the screen
        | ----------------------------------------------------------------------
        */
        var reset = function () {
            memory = "";
            display.innerHTML = "";
        };
        /*
        | ----------------------------------------------------------------------
        | Insert a character on the screen
        | ----------------------------------------------------------------------
        */
        var insert = function (char) {
            if (char === "/") {
                display.innerHTML += "&divide;";
            } else {
                display.innerHTML += char;
            }
            memory += char;
        };
        /*
        | ----------------------------------------------------------------------
        | Triggers the operation
        | ----------------------------------------------------------------------
        */
        var total = function () {
            memory = eval(memory) || 0;
            display.innerHTML = memory || "";
        };
        /*
        | ----------------------------------------------------------------------
        | Selects the button specified by the "href" attribute
        | ----------------------------------------------------------------------
        */
        var button = function (key) {
            return calculator.querySelector('a[href="' + key + '"]');
        };
        /*
        | ----------------------------------------------------------------------
        | Document events
        | ----------------------------------------------------------------------
        */
        var load    = new Event("load"),
            _window = calculator.querySelector("#window");
        _window.onload = function (e) {
            this.focus();
        };
        _window.dispatchEvent(load);
        _window.onfocus = function (e) {
            e.preventDefault();
            removeClass(this, "disable");
        };
        _window.onblur = function (e) {
            e.preventDefault();
            addClass(this, "disable");
        };
        /*
        | ----------------------------------------------------------------------
        | Mouse events
        | ----------------------------------------------------------------------
        */
        var tag = calculator.getElementsByTagName("a");
        for (var i=0; i < tag.length; i++) {
            button(tag[i].getAttribute("href")).onclick = function (e) {
                e.preventDefault();
                var key = this.getAttribute("href");
                if (key === "Enter") {
                    total();
                } else if (key === "Escape") {
                    reset();
                } else if (key === "Close") {
                    calculator.innerHTML = "";
                } else {
                    insert(key);
                }
            };
            button(tag[i].getAttribute("href")).onmousedown = function (e) {
                e.preventDefault();
                addClass(this, css_class);
            };
            button(tag[i].getAttribute("href")).onmouseup = function (e) {
                e.preventDefault();
                removeClass(this, css_class);
            };
        }
        calculator.querySelector("ul").onclick = function (e) {
            e.preventDefault();
            _window.focus();
        };
        calculator.querySelector("#topbar").onclick = function (e) {
            e.preventDefault();
            _window.focus();
        };
        /*
        | ----------------------------------------------------------------------
        | Keyboard events
        | ----------------------------------------------------------------------
        */
        var $key = function (e) {
            if (e.key) {
                return e.key;
            } else {
                return String.fromCharCode(e.which || e.keyCode);
            }
        };
        _window.onkeypress = function (e) {
            e.preventDefault();
            // Allowed characters 0-9 / * - + . %
            var char = $key(e).replace(/[^0-9\/\*\-\+\.\%]/g, "");
            if (char) {
                insert(char);
            }
        };
        _window.onkeydown = function (e) {
            var key = $key(e);
            var el  = button(key);
            if (el) {
                addClass(el, css_class);
            }
            if (key === "Enter") {
                total();
            } else if (key === "Escape") {
                reset();
            }
        };
        _window.onkeyup = function (e) {
            var key = $key(e);
            var el  = button(key);
            if (el) {
                removeClass(el, css_class);
            }
            if (key === "Backspace") {
                var char = display.innerHTML;
                char = char.substr(0, char.length - 1);
                display.innerHTML = char;
                memory = char;
            }
        };
    };
    try {
        init();
    } catch (e) {
        window.onload = function () {
            init();
        };
    }
}
