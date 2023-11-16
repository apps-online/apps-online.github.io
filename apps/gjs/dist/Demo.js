imports.searchPath.unshift("./");
imports.Jgui;

class Demo {

    main() {
        Jgui.url = "https://raw.githubusercontent.com/Leandro-Sciola/apps/main/gjs/";
        Jgui.include("style.min.css");
        Jgui.request("piano.xml", function (response) {
            /*
              XML structure object ID
              ---------------------------------------
              File: piano.xml
              <object class="GtkWindow" id="window">
            */
            Jgui.builder(response, "window"); // id="window"
        });
    }

    onDeleteWindow() { // onDeleteWindow is called by the XML file - piano.xml
        Jgui.quit(); // Close the window
    }

    playSound(button) {
        let Gst  = imports.gi.Gst,
            freq = { // Frequency
              C: 261.63,
              D: 293.66,
              E: 329.63,
              F: 349.23,
              G: 391.99,
              A: 440.00,
              B: 493.88};

        Gst.init(null);

        let pipeline = new Gst.Pipeline({name: "note"}),
            source   = Gst.ElementFactory.make("audiotestsrc","source"),
            sink     = Gst.ElementFactory.make("autoaudiosink","output");

        source.set_property("freq", freq[button.label]);
        pipeline.add(source);
        pipeline.add(sink);
        source.link(sink);
        pipeline.set_state(Gst.State.PLAYING);

        Jgui.mainloop.timeout_add(500, function () {
            pipeline.set_state(Gst.State.NULL);
            return false;
        });
    }
}

Jgui.define(Demo);
