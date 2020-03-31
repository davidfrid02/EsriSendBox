define(function() {
  const load = view => {
    require(["esri/widgets/Expand", "esri/widgets/Measurement"], function(
      Expand,
      Measurement
    ) {
      let measureWidget = [];

      const createCustomElement = ({
        elementType,
        measurementType,
        classList
      }) => {
        let element = document.createElement(elementType);
        for (let currClass of classList) {
          element.classList.add(currClass);
        }
        if (measurementType == "trash") {
          element.onclick = () => {
            clearMeasurement();
          };
        } else {
          element.onclick = () => {
            startMeasurement(measurementType);
          };
        }
        return element;
      };

      let element = document.createElement("div");

      //AREA
      element.appendChild(
        createCustomElement({
          elementType: "div",
          measurementType: "area",
          classList: [
            "esri-widget--button",
            "esri-widget",
            "esri-icon-measure-area"
          ]
        })
      );

      //DISTANCE
      element.appendChild(
        createCustomElement({
          elementType: "div",
          measurementType: "distance",
          classList: [
            "esri-widget--button",
            "esri-widget",
            "esri-icon-measure-line"
          ]
        })
      );

      //TRASH
      element.appendChild(
        createCustomElement({
          elementType: "div",
          measurementType: "trash",
          classList: ["esri-widget--button", "esri-widget", "esri-icon-trash"]
        })
      );

      const startMeasurement = type => {
        measureWidget.push(
          new Measurement({
            view: view,
            activeTool: type
          })
        );
       
      };

      const clearMeasurement = type => {
        measureWidget.forEach(mw => {
          mw.clear();
        });

        measureWidget = [];
        // new Measurement({
        //     view: view,
        //     activeTool: type
        //   }).clear();
        // alert("clear");
      };

      measurement = new Expand({
        expandIconClass: "esri-icon-measure-line",
        view: view,
        content: element
      });
      view.ui.add(measurement, "top-right");
    });
  };

  return { load };
});
