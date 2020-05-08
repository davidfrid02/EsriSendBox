define(["esri/widgets/Expand", "esri/widgets/LayerList"], (
  Expand,
  LayerList
) => {
  const load = (view) => {
    var layerList = new LayerList({
      view: view,
      listItemCreatedFunction: defineActions,
    });

    const expand = new Expand({
      expandIconClass: "esri-icon-layer-list",
      view: view,
      content: layerList,
    });
    view.ui.add(expand, "top-right");
  };

  const changeSymbol = (event, attribute) => {
    const layerId = event.currentTarget.parentElement.layerId;
    let layer = view.map.findLayerById(layerId);
    if (layer.renderer) {
      let currRenderer = layer.renderer.clone();
      let value = event.target.value;
      switch (attribute) {
        case "color":
          currRenderer.symbol.color = value;
          break;
        case "size":
          event.currentTarget.parentElement.getElementsByClassName(
            "sizeSliderValue"
          )[0].innerText = value;
          currRenderer.symbol.size = value;
          break;
        case "style":
          currRenderer.symbol.style = event.target.selectedOptions[0].value;
          break;
        case "angle":
          event.currentTarget.parentElement.getElementsByClassName(
            "angleSliderValue"
          )[0].innerText = value;
          currRenderer.symbol.angle = value;
          break;
        //======OUTLINE======
        case "outline-color":
          currRenderer.symbol.outline.color = value;
          break;
        case "outline-width":
          event.currentTarget.parentElement.getElementsByClassName(
            "outlineWidthSliderValue"
          )[0].innerText = value;
          currRenderer.symbol.outline.width = value;
          break;
        case "outline-style":
          currRenderer.symbol.outline.style = event.target.selectedOptions[0].value;
          break;
      }
      layer.renderer = currRenderer;
    }
  };

  const defineActions = (event) => {
    var item = event.item;
    const divPanel = document.createElement("div");
    divPanel.layerId = item.layer.id;

    let color = "blue";
    let size = 14;
    let style = "rectangle";
    let angle = 0;
    let outlineColor = "white";
    let outlineWidth = 1;
    let outlineStyle = "solid";
    if (item.layer.renderer && item.layer.renderer.symbol) {
      color = item.layer.renderer.symbol.color;
      size = item.layer.renderer.symbol.size;
      style = item.layer.renderer.symbol.style;
      angle = item.layer.renderer.symbol.angle;
      if (item.layer.renderer.symbol.outline) {
        outlineColor = item.layer.renderer.symbol.outline.color;
        outlineWidth = item.layer.renderer.symbol.outline.width;
        outlineStyle = item.layer.renderer.symbol.outline.style;
      }
    }
    createColorPicker(divPanel, color);
    createSizeSlider(divPanel, size);
    createStyleSelect(divPanel, style);
    createAngleSlider(divPanel, angle);

    //==========OUTLINE=========
    createOutlineColorPicker(divPanel, outlineColor);
    createOutlineWidthSlider(divPanel, outlineWidth);
    createOutlineStyleSelect(divPanel, outlineStyle);

    item.panel = {
      content: divPanel,
    };
  };

  const createSizeSlider = (element, value) => {
    const sizeSlider = document.createElement("input");
    sizeSlider.type = "range";
    sizeSlider.value = value;
    sizeSlider.min = "1";
    sizeSlider.max = "100";
    sizeSlider.onchange = (event) => {
      changeSymbol(event, "size");
    };
    const sizeSliderValue = document.createElement("p");
    sizeSliderValue.innerText = value;
    sizeSliderValue.className = "sizeSliderValue";

    element.appendChild(sizeSlider);
    element.appendChild(sizeSliderValue);
  };

  const createColorPicker = (element, value) => {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = value;
    colorPicker.onchange = (event) => {
      changeSymbol(event, "color");
    };
    element.appendChild(colorPicker);
  };

  const createStyleSelect = (element, value) => {
    //need to save in array the styles and then select the value(default)
    const selectStyle = document.createElement("select");
    let optionsArray = [
      "circle",
      "cross",
      "diamond",
      "square",
      "triangle",
      "x",
    ];
    for(option of optionsArray){
      createOption(selectStyle, option);
    }
    selectStyle.onchange = (event) => {
      changeSymbol(event, "style");
    };
    element.appendChild(selectStyle);
  };

  const createAngleSlider = (element, value) => {
    const sizeSlider = document.createElement("input");
    sizeSlider.type = "range";
    sizeSlider.value = value;
    sizeSlider.min = "-180";
    sizeSlider.max = "180";
    sizeSlider.onchange = (event) => {
      changeSymbol(event, "angle");
    };
    const angleSliderValue = document.createElement("p");
    angleSliderValue.innerText = value;
    angleSliderValue.className = "angleSliderValue";

    element.appendChild(sizeSlider);
    element.appendChild(angleSliderValue);
  };

  //==========OUTLINE=========
  const createOutlineWidthSlider = (element, value) => {
    const sizeSlider = document.createElement("input");
    sizeSlider.type = "range";
    sizeSlider.value = value;
    sizeSlider.min = "1";
    sizeSlider.max = "20";
    sizeSlider.onchange = (event) => {
      changeSymbol(event, "outline-width");
    };
    const sizeSliderValue = document.createElement("p");
    sizeSliderValue.innerText = value;
    sizeSliderValue.className = "outlineWidthSliderValue";

    element.appendChild(sizeSlider);
    element.appendChild(sizeSliderValue);
  };

  const createOutlineColorPicker = (element, value) => {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = value;
    colorPicker.onchange = (event) => {
      changeSymbol(event, "outline-color");
    };
    element.appendChild(colorPicker);
  };

  const createOutlineStyleSelect = (element, value) => {
    //need to save in array the styles and then select the value(default)
    const selectStyle = document.createElement("select");
    let optionsArray = [
      "dash",
      "dash-dot",
      "dot",
      "inside-frame",
      "long-dash",
      "long-dash-dot",
      "long-dash-dot-dot",
      "none",
      "short-dash",
      "short-dash-dot",
      "short-dash-dot-dot",
      "short-dot",
      "solid",
    ];
    for(option of optionsArray){
      createOption(selectStyle, option);
    }
    selectStyle.onchange = (event) => {
      changeSymbol(event, "outline-style");
    };
    element.appendChild(selectStyle);
  };

  const createOption = (selectElement, value) => {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = value;
    selectElement.appendChild(option);
  };
  return { load };
});
