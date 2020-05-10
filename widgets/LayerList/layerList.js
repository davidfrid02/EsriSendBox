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

  const defineActions = (event) => {
    var item = event.item;
    const divPanel = document.createElement("div");
    divPanel.layerId = item.layer.id;
    createSymbolSection(divPanel, item.layer.renderer);
    createLabelSection(divPanel, item.layer);

    item.panel = {
      content: divPanel,
    };
  };

  // ===== SYMBOL ======
  const createSymbolSection = (element, renderer) => {
    let color = "blue";
    let size = 14;
    let style = "rectangle";
    let angle = 0;
    let outlineColor = "white";
    let outlineWidth = 1;
    let outlineStyle = "solid";
    if (renderer && renderer.symbol) {
      color = renderer.symbol.color;
      size = renderer.symbol.size;
      style = renderer.symbol.style;
      angle = renderer.symbol.angle;
      //OUTLINE
      if (renderer.symbol.outline) {
        outlineColor = renderer.symbol.outline.color;
        outlineWidth = renderer.symbol.outline.width;
        outlineStyle = renderer.symbol.outline.style;
      }
    }

    let header = document.createElement("p");
    header.innerText = "======= Symbology! =======";
    element.appendChild(header);

    createColorPicker(element, color, "symbol", "color");
    createRange(element, "symbol", "size", "sizeSliderValue", {
      value: size,
      min: 1,
      max: 100,
    });
    createSelect(
      element,
      ["circle", "cross", "diamond", "square", "triangle", "x"],
      "symbol",
      "style"
    );
    createRange(element, "symbol", "angle", "angleSliderValue", {
      value: angle,
      min: -180,
      max: 180,
    });

    //==========OUTLINE=========
    createColorPicker(element, outlineColor, "symbol", "outline-color");
    createRange(element, "symbol", "outline-width", "outlineWidthSliderValue", {
      value: angle,
      min: 1,
      max: 20,
    });
    createSelect(
      element,
      [
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
      ],
      "outline",
      "style"
    );
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
          currRenderer.symbol.outline.style =
            event.target.selectedOptions[0].value;
          break;
      }
      layer.renderer = currRenderer;
    }
  };

  /// ===== LABEL ====
  const createLabelSection = (element, layer) => {
    let labelingInfo = layer.labelingInfo;
    if (layer.fields && layer.fields.length) {
      let fields = layer.fields.map((field) => field.name);
      fields.unshift("");
      let field = fields[0];
      let color,
        haloColor = "blue";
      let size = 14;
      let haloSize = 1;
      // let style = "rectangle";
      // let angle = 0;
      // let outlineColor = "white";
      // let outlineWidth = 1;
      // let outlineStyle = "solid";
      if (labelingInfo && labelingInfo.length) {
        field = layer.labelingInfo[0].labelExpressionInfo.split(".")[1];
        color = labelingInfo.symbol.color;
        size = renderer.labelingInfo.size;
        haloColor = renderer.labelingInfo.haloColor;
        haloSize = renderer.labelingInfo.haloSize;
        // style = renderer.labelingInfo.style;
        // angle = renderer.labelingInfo.angle;
        // //OUTLINE
        // if (renderer.labelingInfo.outline) {
        //   outlineColor = renderer.symbol.outline.color;
        //   outlineWidth = renderer.symbol.outline.width;
        //   outlineStyle = renderer.symbol.outline.style;
        // }
      }

      let header = document.createElement("p");
      header.innerText = "======= Label! =======";
      element.appendChild(header);

      createSelect(element, fields, "label", "field");
      createColorPicker(element, color, "label", "color");
      createSelect(
        element,
        [
          "serif",
          "sans-serif",
          "Josefin Slab",
          "Merriweather",
          "fantasy",
          "cursive",
        ],
        "label",
        "font-family"
      );
      createSelect(
        element,
        ["8", "10", "12", "14", "16", "18", "20", "25", "30", "35", "40"],
        "label",
        "font-size"
      );

      createButton(element, "U", "U", "label", "font-decoration");
      createButton(element, "B", "B", "label", "font-weight");
      createButton(element, "I", "I", "label", "font-style");
      createColorPicker(element, haloColor, "label", "haloColor");
      createSelect(element, [...Array(10).keys()], "label", "haloSize");

      createButton(element, "<", "top-left", "label", "alignment");
    }
  };

  const changeLabel = (event, attribute) => {
    const layerId = event.currentTarget.parentElement.layerId;
    let layer = view.map.findLayerById(layerId);
    let value = event.target.value;
    let labelClass;
    if (layer.labelingInfo) {
      labelClass = layer.labelingInfo[0];
    } else {
      labelClass = {
        symbol: {
          type: "text",
          font: {},
        },
        labelExpressionInfo: {
          expression: "$feature.SymbolId",
        },
      };
    }
    switch (attribute) {
      case "field":
        let newField = event.target.selectedOptions[0].value;
        if (newField != "") {
          newField = `$feature.${newField}`;
        }
        labelClass.labelExpressionInfo.expression = newField;
        break;
      case "color":
        labelClass.symbol.color = value;
        break;
      case "haloColor":
        labelClass.symbol.haloColor = value;
        break;
      case "haloSize":
        labelClass.symbol.haloSize = event.target.selectedOptions[0].value;
      case "alignment":
        //need to finish! not working good!
        switch (value) {
          case "top-left":
            labelClass.symbol.horizontalAlignment = "left";
            labelClass.symbol.verticalAlignment = "top";
            break;
        }
        break;
      // ==== FONT ====
      case "font-family":
        labelClass.symbol.font.family = event.target.selectedOptions[0].value;
        break;
      case "font-size":
        labelClass.symbol.font.size = event.target.selectedOptions[0].value;
        break;
      case "font-decoration":
        labelClass.symbol.font.decoration =
          labelClass.symbol.font.decoration == "none" ? "underline" : "none";
        break;
      case "font-style":
        labelClass.symbol.font.style =
          labelClass.symbol.font.style == "normal" ? "italic" : "normal";
        break;
      case "font-weight":
        labelClass.symbol.font.weight =
          labelClass.symbol.font.weight == "normal" ? "bold" : "normal";
        break;
    }
    layer.labelingInfo = [labelClass];
  };

  // ==================================
  // ======= creator functions ========
  // ==================================
  const createButton = (element, text, value, type, attribute) => {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.value = value;
    button.onclick = (event) => {
      callbackFunction(event, type, attribute);
    };
    element.appendChild(button);
  };

  const createColorPicker = (element, value, type, attribute) => {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = value;
    colorPicker.onchange = (event) => {
      callbackFunction(event, type, attribute);
    };
    element.appendChild(colorPicker);
  };

  const createRange = (
    element,
    type,
    attribute,
    valueElement,
    { value, min, max }
  ) => {
    const range = document.createElement("input");
    range.type = "range";
    range.value = value;
    range.min = min;
    range.max = max;
    range.onchange = (event) => {
      callbackFunction(event, type, attribute);
    };
    const rangeValue = document.createElement("p");
    rangeValue.innerText = value;
    rangeValue.className = valueElement;

    element.appendChild(range);
    element.appendChild(rangeValue);
  };

  const createSelect = (element, optionsArray, type, attribute) => {
    const select = document.createElement("select");
    for (option of optionsArray) {
      createOption(select, option);
    }
    select.onchange = (event) => {
      callbackFunction(event, type, attribute);
    };
    element.appendChild(select);
  };

  const callbackFunction = (event, type, attribute) => {
    if (type == "symbol") {
      changeSymbol(event, attribute);
    } else if (type == "label") {
      changeLabel(event, attribute);
    }
  };

  const createOption = (selectElement, value) => {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = value;
    selectElement.appendChild(option);
  };
  return { load };
});
