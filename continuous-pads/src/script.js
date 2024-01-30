/*
| ------------------------------------------------------------------------------
| class Keyboard
| ------------------------------------------------------------------------------
| const $Keyboard = new Keyboard();
|
| ------------------------------------------------------------------------------
*/
class Keyboard {

    /**
     * Class constructor
     *
     * @access public
     */
    constructor() {
        try {
            this.audio             = {};
            this.audio.pipe        = [];
            this.audio.blob        = [];
            this.audio.url         = "";
            this.audio.timer       = null;
            this.audio.context     = new AudioContext();
            this.audio.player      = new WebAudioFontPlayer();
            this.audio.destination = new MediaStreamAudioDestinationNode(
                                         this.audio.context);
            this.audio.recorder    = new MediaRecorder(
                                         this.audio.destination.stream);
            this.audio.timbre      = this.timbre();
            this.audio.recorder.ondataavailable = e => {
                this.audio.blob.push(e.data);
            };
            this.audio.recorder.onstop = e => {
                this.audio.url = URL.createObjectURL(new Blob(this.audio.blob, {
                  "type" : "audio/ogg; codecs=opus"
                }));
            };
            this.audio.player.adjustPreset(this.audio.context,
                                           this.audio.timbre);
            this.addOption();
            this.addEvent();
            //this.timbre("0990"); // Load timbre
        } catch(err) {
            alert('Sorry, but the Web Audio API is not supported by your '     +
                  'browser.\nPlease, consider upgrading to the latest '        +
                  'version or downloading Google Chrome or Mozilla Firefox.\n' +
                  err);
        }
    }

    /**
     * Include .js file
     *
     * include("path/file.js");
     *
     * @param {Array|String} src
     * @access private
     */
    include(src) {
        var type_of = obj => Object.prototype
                                   .toString
                                   .call(obj)
                                   .slice(8, -1)
                                   .toLowerCase();
        if (type_of(src) === "string") {
            var script   = document.createElement("script");
            script.type  = "text/javascript";
            script.src   = src;
            script.async = true;
            document.getElementsByTagName("head")[0].appendChild(script);
        } else if (type_of(src) === "array") {
            this.includeMulti(src);
        }
    }

    /**
     * Include multiple .js files
     *
     * include(["path/file1.js", "path/file2.js", "path/file3.js"]);
     *
     * @param {Array} arr
     * @access private
     */
    includeMulti(arr) {
        var attr = [];
        var file = "";
        $("head script").each(function (i) {
            attr[i] = $(this).attr("src");
        });
        $(arr).each((index, path) => {
            file = path;
            $(attr).each((i, src) => {
                if (path === src) {
                    file = "";
                    return false;
                }
            });
            if (file !== "") {
                this.include(file);
            }
        });
    }

    /**
     * File list
     *
     * @return {Object}
     * @access private
     */
    fileList() {
        // Audio path - /webaudiofont/sound/0502_FluidR3_GM_sf2_file.js
        return {
          "0502"    : "0502_FluidR3_GM_sf2_file",
          "0990"    : "0990_Aspirin_sf2_file"
        };
    }

    /**
     * Add options in HTML element select
     *
     * @access private
     */
    addOption() {
        var list = this.fileList();
        for (let item in list) {
            let option   = document.createElement("option");
            option.text  = item;
            option.value = item;
            this.id("timbre").appendChild(option);
        }
    }

    /**
     * Element ID
     *
     * @param {String} name
     * @return {Object}
     * @access private
     */
    id(name) {
        return document.getElementById(name);
    }

    /**
     * Toggle keyboard key
     *
     * @param {Object} element
     * @return {Boolean}
     * @access private
     */
    toggleKeyboardKey(element) {
        if (element.classList.contains("white")) {
            if (element.classList.contains("white-active")) {
                element.classList.remove("white-active");
            } else {
                element.classList.add("white-active");
                return true;
            }
        } else {
            if (element.classList.contains("black-active")) {
                element.classList.remove("black-active");
            } else {
                element.classList.add("black-active");
                return true;
            }
        }
        return false;
    }

    /**
     * Add events
     *
     * @access private
     */
    addEvent() {
        var key  = document.querySelectorAll("#keyboard li");
        var size = key.length;
        for (let i = 0; i < size; i++) {
            key[i].addEventListener("click", e => {
                this.sound(e.target.getAttribute("value"),
                           this.toggleKeyboardKey(e.target));

            });
        }
        this.id("timbre").addEventListener("change", e => {
            this.audio.timbre = this.timbre(e.target.value);
            if (this.audio.timbre) {
                this.audio.player.adjustPreset(this.audio.context,
                                               this.audio.timbre);
            }
        });
        this.id("stop").addEventListener("click", e => {
            this.stop();
        });
        this.id("recording").addEventListener("click", e => {
            switch (e.target.name) {
              case "start":
                this.startRecording(e.target);
                break;
              case "stop":
                this.stopRecording(e.target);
                break;
              case "download":
                this.download();
            }
        });
        this.id("reset").addEventListener("click", e => {
            this.reset();
        });
    }

    /**
     * Button change
     *
     * @param {Object} target
     * @param {String} name
     * @param {String} text
     * @access private
     */
    buttonChange(target, name, text) {
        target.name      = name;
        target.innerHTML = '<i class="fas fa-' +
                           (name === "start" ? "play" : name) +
                           ' me-2" aria-hidden="true"></i>' + text;
    }

    /**
     * Timbre
     *
     * @param {String} name
     * @return {Object}
     * @access private
     */
    timbre(name = null) {
        var list = this.fileList();
        name = (name) ? list[name] : Object.values(list)[0];
        if (!window["_tone_" + name]) {
            this.include("https://leandro-sciola.github.io/apps/worship-pads-" +
                         "generator/webaudiofont/sound/" + name + ".js");
        }
        return window["_tone_" + name];
    }

    /**
     * Timer
     *
     * @return {Object}
     * @access private
     */
    timer() {
        var msec = 0;
        var sec  = 0;
        var min  = 0;
        return setInterval(() => {
            msec += 1;
            if (msec == 60) {
                sec += 1;
                msec = 0;
                if (sec == 60) {
                    sec = 0;
                    min += 1;
                }
            }
            this.id("timer").value = String(min).padStart(2, "0") + ":" +
                                     String(sec).padStart(2, "0") + ":" +
                                     String(msec).padStart(2, "0");
        }, 1000);
    }

    /**
     * Stop
     *
     * @param {Object} pipe
     * @access private
     */
    stop(pipe = null) {
        var key  = document.querySelectorAll("#keyboard li");
        var size = key.length;
        if (pipe) {
            pipe.cancel();
            for (let i = 0; i < size; i++) {
                if (key[i].classList.contains("white-active") ||
                    key[i].classList.contains("black-active")) {
                    return;
                }
            }
        } else {
            this.audio.player.cancelQueue(this.audio.context);
            for (let i = 0; i < size; i++) {
                if (key[i].classList.contains("white-active")) {
                    key[i].classList.remove("white-active");
                } else if (key[i].classList.contains("black-active")) {
                    key[i].classList.remove("black-active");
                }
            }
        }
        clearInterval(this.audio.timer);
        this.audio.timer = null;
        this.id("stop").classList.add("disabled");
    }

    /**
     * Sound
     *
     * @param {String} key
     * @param {Boolean} play
     * @access private
     */
    sound(key, play) {
        var pitch = {
          "1-1" : 0+12*1,
          "2-1" : 1+12*1,
          "3-1" : 2+12*1,
          "4-1" : 3+12*1,
          "5-1" : 4+12*1,
          "6-1" : 5+12*1,
          "7-1" : 6+12*1,
          "8-1" : 7+12*1,
          "9-1" : 8+12*1,
          "10-1" : 9+12*1,
          "11-1" : 10+12*1,
          "12-1" : 11+12*1,
          "1-2" : 0+12*2,
          "2-2" : 1+12*2,
          "3-2" : 2+12*2,
          "4-2" : 3+12*2,
          "5-2" : 4+12*2,
          "6-2" : 5+12*2,
          "7-2" : 6+12*2,
          "8-2" : 7+12*2,
          "9-2" : 8+12*2,
          "10-2" : 9+12*2,
          "11-2" : 10+12*2,
          "12-2" : 11+12*2,
          "1-3" : 0+12*3,
          "2-3" : 1+12*3,
          "3-3" : 2+12*3,
          "4-3" : 3+12*3,
          "5-3" : 4+12*3,
          "6-3" : 5+12*3,
          "7-3" : 6+12*3,
          "8-3" : 7+12*3,
          "9-3" : 8+12*3,
          "10-3" : 9+12*3,
          "11-3" : 10+12*3,
          "12-3" : 11+12*3,
          "1-4" : 0+12*4,
          "2-4" : 1+12*4,
          "3-4" : 2+12*4,
          "4-4" : 3+12*4,
          "5-4" : 4+12*4,
          "6-4" : 5+12*4,
          "7-4" : 6+12*4,
          "8-4" : 7+12*4,
          "9-4" : 8+12*4,
          "10-4" : 9+12*4,
          "11-4" : 10+12*4,
          "12-4" : 11+12*4
        };
        if (play) {
            if (!this.audio.timer) {
                this.audio.timer = this.timer();
                this.id("stop").classList.remove("disabled");
            }
            this.audio.pipe[key] = this.audio.player.queueWaveTable(
            this.audio.context,
            this.audio.context.destination,
            this.audio.timbre,
            this.audio.context.currentTime + 0,
            pitch[key],
            999999,
            true);
            this.audio.pipe[key].connect(this.audio.destination);
        } else {
            this.stop(this.audio.pipe[key]);
        }
    }

    /**
     * Start recording
     *
     * @param {Object} target
     * @access private
     */
    startRecording(target) {
        this.audio.recorder.start();
        this.buttonChange(target, "stop", "Stop recording");
    }

    /**
     * Stop recording
     *
     * @param {Object} target
     * @access private
     */
    stopRecording(target) {
        this.audio.recorder.requestData();
        this.audio.recorder.stop();
        this.buttonChange(target, "download", "Download");
    }

    /**
     * Download
     *
     * @access private
     */
    download() {
        var anchor = document.createElement("a");
        var name   = (Math.random() * new Date().getTime())
                     .toString(10)
                     .replace(/\./g, "");
        anchor.setAttribute("download", "pad_" + name);
        anchor.href = this.audio.url;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }

    /**
     * Reset
     *
     * @access private
     */
    reset() {
        this.audio.player.cancelQueue(this.audio.context);
        location.reload(true);
    }
}
