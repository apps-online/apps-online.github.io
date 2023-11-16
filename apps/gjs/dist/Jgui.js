/*
 * Jgui
 *
 * @author   Leandro Sciola
 * @license  MIT License
 *
 * Requirement: GJS
 * debian@debian:~$ su
 * root@debian:~# apt install gjs
 * root@debian:~# apt install gir1.2-soup-2.4
 *
 * debian@debian:~$ gjs app.js
 */
imports.gi.versions.Gtk = "3.0";

var Gtk      = imports.gi.Gtk,
    GLib     = imports.gi.GLib,
    Gdk      = imports.gi.Gdk,
    Soup     = imports.gi.Soup,
    Lang     = imports.lang,
    Mainloop = imports.mainloop;

class Jgui {

    /**
     * @function constructor
     * @description Constructor method.
     */
    constructor() {
        this.bind     = null;
        this.url      = ""; // http://localhost:8000
        this.mainloop = Mainloop;
        Gtk.init(null);
    }

    /**
     * @function define
     * @param {object} $_class
     * @description Creates the class instance.
     */
    define($_class) {
        let name = $_class["name"],
            obj  = Object.getPrototypeOf(new $_class);

        obj.Name     = name;
        obj._init    = obj.main;
        window[name] = new Lang.Class(obj);
        this.bind    = Lang.bind(new window[name], function (builder,
                                                             object,
                                                             signal,
                                                             handler) {
            object.connect(signal, Lang.bind(this, this[handler]));
        });
        return new window[name];
    }

    /**
     * @function request
     * @param {array} arguments
     * @description HTTP requests.
     *
     * request("http://example.org/file", function (code, data) {
     *     log(code); log(data);
     * });
     *
     * request("http://example.org/file", {"foo":"bar"}, function (code, data) {
     *     log(code); log(data);
     * });
     */
    request() {
        let url      = "",
            arg_type = ({}).toString.call(arguments[1])
                           .match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        if (arguments[0].substring(0,4) !== "http") {
            url = this.url;
        }
        if (arg_type === "object") {
            var params   = Soup.form_encode_hash(arguments[1]),
                request  = Soup.Message.new("POST", url + arguments[0]),
                callback = arguments[2];

            request.set_request("application/x-www-form-urlencoded",
                                Soup.MemoryUse.COPY, params, params.length);
        } else {
            var request  = Soup.Message.new("GET", url + arguments[0]),
                callback = arguments[1];
        }
        let _session = new Soup.SessionAsync();
        _session.queue_message(request, Lang.bind(this, function (session,
                                                                  message) {
            this.mainloop.quit(true);
            if (callback != undefined && callback.length > 1) {
                callback(message.status_code, request.response_body.data);
            } else if (callback != undefined) {
                callback(request.response_body.data);
            }
        }));
        this.mainloop.run(true);
    }

    /**
     * @function include
     * @param {string} file
     * @description Include CSS file.
     */
    include(file) {
        this.request(file, function (response) {
            let CssProvider = new Gtk.CssProvider();
            CssProvider.load_from_data(response);
            Gtk.StyleContext.add_provider_for_screen(
                Gdk.Screen.get_default(),
                CssProvider,
                Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
        });
    }

    /**
     * @function builder
     * @param {string} xml
     * @param {string} obj
     * @description UI Builder.
     */
    builder(xml = "", obj) {
        if (this.bind) {
            if (!xml) {
                xml = `<?xml version="1.0" encoding="UTF-8"?><interface>
                       <requires lib="gtk+" version="3.12"/>
                       <object class="GtkMessageDialog" id="offline">
                       <property name="can_focus">False</property>
                       <property name="type_hint">dialog</property>
                       <property name="text" translatable="yes">Error</property>
                       <property name="secondary_text" 
                       translatable="yes">404 - XML not found!</property>
                       <child><placeholder/></child>
                       <child internal-child="vbox">
                       <object class="GtkBox">
                       <property name="can_focus">False</property>
                       <property name="orientation">vertical</property>
                       <property name="spacing">2</property>
                       <child internal-child="action_area">
                       <object class="GtkButtonBox">
                       <property name="can_focus">False</property>
                       <property name="homogeneous">True</property>
                       <property name="layout_style">end</property>
                       <child><object class="GtkButton">
                       <property name="label">gtk-ok</property>
                       <property name="visible">True</property>
                       <property name="can_focus">True</property>
                       <property name="receives_default">True</property>
                       <property name="margin_right">10</property>
                       <property name="margin_bottom">10</property>
                       <property name="use_stock">True</property>
                       <signal name="pressed" handler="onDeleteWindow" 
                       swapped="no"/>
                       </object><packing><property name="expand">True</property>
                       <property name="fill">True</property>
                       <property name="position">0</property></packing></child>
                       </object><packing>
                       <property name="expand">False</property>
                       <property name="fill">False</property>
                       <property name="position">0</property></packing></child>
                       </object></child></object></interface>`;
                obj = "offline";
            }
            let Builder = new Gtk.Builder();
                Builder.add_from_string(xml, xml.length);
                Builder.connect_signals_full(this.bind);
                Builder.get_object(obj).show_all();

            Gtk.main();
        }
    }

    /**
     * @function shell_exec
     * @param {string} command
     * @description Executes shell commands.
     */
    shell_exec(command) {
        GLib.spawn_command_line_async(command);
    }

    /**
     * @function quit
     * @description Destroy window.
     */
    quit() {
        Gtk.main_quit();
    }
}
window.Jgui = new Jgui;
