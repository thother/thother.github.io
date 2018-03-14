function create(tag, attr) {
  var elem = document.createElement(tag);

  for (var k in attr) {
    elem[k] = attr[k];
  }

  return elem;
}

document.head.appendChild(create("link", {
  rel: "stylesheet",
  href: "//js.arcgis.com/4.7/esri/css/main.css"
}));

document.head.appendChild(create("link", {
  rel: "stylesheet",
  href: "./support/style.css"
}));

document.head.appendChild(create("script", {
  src: "//js.arcgis.com/4.7/"
}));

(function(snippet, settings) {

  window.addEventListener("load", function() {
    require([
      "dojo/dom-construct",
      "dojo/on",

      "esri/core/declare",
      "esri/core/Scheduler",
      "esri/Map",
      "esri/views/MapView",

      "dojo/domReady!"
      ], function(
        domCtr, on,

        declare,
        Scheduler,
        Map,
        MapView
      ) {

      var containers = {};

      // provide default functionality
      // (to be redefined according to settings)
      var interlinks = {
        log: function() { console.log(Array.prototype.join.call(arguments, " ")); },
        playButton: function() {},
        overviewDiv: {},
      };

      if (!settings.disableViewDiv) {
        containers.viewDiv = create("div", {
          id: "viewDiv"
        });

        if (!settings.disableLog) {
          containers.logDiv = create("div", {
            id: "logDiv"
          });
          containers.viewDiv.appendChild(containers.logDiv);

          interlinks.log = function() {
            containers.logDiv.textContent = Array.prototype.join.call(arguments, " ");
          };
        }

        if (!settings.disableOverview) {
          containers.overviewDiv = create("div", {
            id: "overviewDiv"
          });
          containers.viewDiv.appendChild(containers.overviewDiv);
        }

        if (!settings.disableFPS) {
          containers.fpsDiv = create("div", {
            id: "fpsDiv"
          });
          containers.viewDiv.appendChild(containers.fpsDiv);


          var numFrames = 0;
          var windowInSeconds = 0.5;
          var lastMeasurement = 0;

          var fpsTask = Scheduler.addFrameTask({
            update: function(event) {
              var elapsed = (event.spendInTask - lastMeasurement) / 1000;

              if (elapsed >= windowInSeconds) {
                containers.fpsDiv.textContent = Math.round(numFrames / elapsed).toString() + " fps";

                lastMeasurement = event.spendInTask;
                numFrames = 0;
              }
              else {
                ++numFrames;
              }
            }
          });

          fpsTask.resume();
        }


        document.body.appendChild(containers.viewDiv);
      }

      snippet(containers, interlinks);

      window.addEventListener("message", function(m) {
        if (m.data && m.data.play) {
          interlinks.playButton(m.data.arguments);
        }
      }, false);

      if (!settings.disableOverview) {
        var mapView = new MapView({
          map: new Map({
            basemap: "streets"
          }),

          container: containers.overviewDiv,

          ui: {
            components: []
          }
        });

        mapView.then(function() {
          mapView.constraints.snapToZoom = false;
        });

        interlinks.overviewMap = mapView;
      }
    });
  });
})(window.snippet, window.settings || {});
