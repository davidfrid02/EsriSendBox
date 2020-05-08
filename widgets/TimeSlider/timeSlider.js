define(["esri/widgets/TimeSlider"], (TimeSlider) => {
  const load = (view) => {
    const timeSlider = new TimeSlider({
      container: "timeSliderDiv",
      view: view,
      // show data within a given time range
      // in this case data within one year
      mode: "time-window",
      fullTimeExtent: {
        // entire extent of the timeSlider
        start: new Date(2000, 0, 1),
        end: new Date(2010, 0, 1),
      },
      values: [
        // location of timeSlider thumbs
        new Date(2000, 0, 1),
        new Date(2001, 1, 1),
      ],
    });
    window.widgets = {
      timeSlider: timeSlider,
    };

    view.ui.add(timeSlider, "bottom-left");

    let uiBottomLeft = document.getElementsByClassName(
      "esri-ui-bottom-left esri-ui-corner"
    );

    
    var mutationObserver = new MutationObserver(function (mutations) {
      getTimeSliderAndAppendSelect();
      mutationObserver.disconnect();
    });
    
    mutationObserver.observe(uiBottomLeft[0], {
      attributes: true,
      childList: true,
      subtree: true,
    });

  };

  const getTimeSliderAndAppendSelect = () => {
    const timeExtentElements = document.getElementsByClassName(
      "esri-time-slider__time-extent"
    );
    const selectBoxElement = document.createElement("select");
    selectBoxElement.style.position = "absolute";
    selectBoxElement.style.top = "5px";
    selectBoxElement.style.right = "20px";
    selectBoxElement.onchange = (event) => {
      const timeSliderDates = getTimeSliderDataByValue(
        event.target.selectedOptions[0].value
      );
      window.widgets.timeSlider.fullTimeExtent = timeSliderDates.fullTimeExtent;
      window.widgets.timeSlider.values = timeSliderDates.values;
    };
    selectBoxElement.appendChild(createOptionElement("ababab"));
    selectBoxElement.appendChild(createOptionElement("cdcdcd"));
    selectBoxElement.appendChild(createOptionElement("fefefe"));
    timeExtentElements[0].appendChild(selectBoxElement);
  };

  const createOptionElement = (value) => {
    const optionElement = document.createElement("option");
    optionElement.value = value;
    optionElement.innerText = value;

    return optionElement;
  };

  const getTimeSliderDataByValue = (value) => {
    if (value) {
      if (value == "ababab") {
        return {
          fullTimeExtent: {
            // entire extent of the timeSlider
            start: new Date(2000, 0, 1),
            end: new Date(2010, 0, 1),
          },
          values: [
            // location of timeSlider thumbs
            new Date(2000, 0, 1),
            new Date(2001, 1, 1),
          ],
        };
      } else if (value == "cdcdcd") {
        return {
          fullTimeExtent: {
            // entire extent of the timeSlider
            start: new Date(2005, 5, 5),
            end: new Date(2008, 10, 10),
          },
          values: [
            // location of timeSlider thumbs
            new Date(2005, 6, 7),
            new Date(2001, 11, 11),
          ],
        };
      } else if (value == "fefefe") {
        return {
          fullTimeExtent: {
            // entire extent of the timeSlider
            start: new Date(2015, 0, 1),
            end: new Date(2019, 0, 1),
          },
          values: [
            // location of timeSlider thumbs
            new Date(2016, 2, 3),
            new Date(2018, 5, 4),
          ],
        };
      }
    }
  };

  return { load };
});
