define(() => {
  const load = view => {
    require(["esri/widgets/Expand", "esri/widgets/Measurement"], function(
      Expand,
      Measurement
    ) {
      const createCustomElement = ({
        elementType,
        measurementType,
        classList
      }) => {
        const element = document.createElement(elementType);
        for (const currClass of classList) {
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

      const element = document.createElement("div");

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
        new Measurement({
          view: view,
          activeTool: type,
          id: "david-" + type
        });
      };

      const clearMeasurement = () => {
        view.tools.items = [];
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

