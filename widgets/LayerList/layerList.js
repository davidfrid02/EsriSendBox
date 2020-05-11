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
    const item = event.item;
    const divPanel = document.createElement("div");
    createSymbolSection(divPanel, item.layer);
    createLabelSection(divPanel, item.layer);

    item.panel = {
      content: divPanel,
    };
  };

  // ===== SYMBOL ======
  const createSymbolSection = (element, layer) => {
    let color = "#0000ff";
    let size = 14;
    let style = "circle";
    let angle = 0;
    let outlineColor = "#000000";
    let outlineWidth = 1;
    let outlineStyle = "solid";
    let outlineStyleOptions = [
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
    let styleOptions = [
      "circle",
      "cross",
      "diamond",
      "square",
      "triangle",
      "x",
    ];
    let renderer = layer.renderer;
    if (renderer && renderer.symbol) {
      color = rgbToHex(renderer.symbol.color);
      size = renderer.symbol.size;
      style = renderer.symbol.style;
      angle = renderer.symbol.angle;
      //OUTLINE
      if (renderer.symbol.outline) {
        outlineColor = rgbToHex(renderer.symbol.outline.color);
        outlineWidth = renderer.symbol.outline.width;
        outlineStyle = renderer.symbol.outline.style;
      }
    }

    let header = document.createElement("p");
    header.innerText = "======= Symbology! =======";
    element.appendChild(header);

    createColorPicker(element, color, "symbol", "color", layer);
    createRange(
      element,
      "symbol",
      "size",
      "sizeSliderValue",
      {
        value: size,
        min: 1,
        max: 100,
      },
      layer
    );
    createSelect(element, style, styleOptions, "symbol", "style", layer);
    createRange(
      element,
      "symbol",
      "angle",
      "angleSliderValue",
      {
        value: angle,
        min: -180,
        max: 180,
      },
      layer
    );

    //==========OUTLINE=========
    createColorPicker(element, outlineColor, "symbol", "outline-color", layer);
    createRange(
      element,
      "symbol",
      "outline-width",
      "outlineWidthSliderValue",
      {
        value: outlineWidth,
        min: 1,
        max: 20,
      },
      layer
    );
    createSelect(
      element,
      outlineStyle,
      outlineStyleOptions,
      "symbol",
      "outline-style",
      layer
    );
  };

  const changeSymbol = (event, attribute, layer) => {
    if (layer.renderer) {
      let currRenderer = layer.renderer.clone();
      if (currRenderer.type !== "unique-value") {
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
    }
  };

  /// ===== LABEL ====
  const createLabelSection = (element, layer) => {
    let labelingInfo = layer.labelingInfo;
    if (layer.fields && layer.fields.length) {
      let fields = layer.fields.map((field) => field.name);
      fields.unshift("");
      let field = fields[0];
      let color = "#0000ff";
      let haloColor = "#00ff00";
      let haloSize = 1;
      let fontFamily = "Arial Unicode MS";
      let fontSize = "12";
      let labelPlacement = "above-right";
      let decoration = "none";
      let weight = "normal";
      let italic = "normal";

      let fontFamilyOptions = [
        "Arial Unicode MS",
        "Ubuntu Mono",
        "Sans-Serif",
        "Josefin Slab",
        "Merriweather",
        "Fantasy",
        "Cursive",
      ];
      let fontSizeOptions = [
        "8",
        "10",
        "12",
        "14",
        "16",
        "18",
        "20",
        "25",
        "30",
        "35",
        "40",
      ];
      let haloSizeOptions = [...Array(10).keys()];

      if (labelingInfo && labelingInfo.length) {
        let labelClass = layer.labelingInfo[0];
        field = labelClass.labelExpressionInfo.split(".")[1];
        labelPlacement = labelClass.labelPlacement;
        color = rgbToHex(labelClass.symbol.color);
        haloColor = rgbToHex(labelClass.symbol.haloColor);
        haloSize = labelClass.symbol.haloSize;
        fontFamily = labelClass.symbol.font.family;
        fontSize = labelClass.symbol.font.size;
        decoration = labelClass.symbol.font.decoration;
        weight = labelClass.symbol.font.weight;
        italic = labelClass.symbol.font.italic;
      }

      let header = document.createElement("p");
      header.innerText = "======= Label! =======";
      element.appendChild(header);

      createSelect(element, field, fields, "label", "field", layer);
      createColorPicker(element, color, "label", "color", layer);
      createSelect(
        element,
        fontFamily,
        fontFamilyOptions,
        "label",
        "font-family",
        layer
      );
      createSelect(
        element,
        fontSize,
        fontSizeOptions,
        "label",
        "font-size",
        layer
      );

      createButton(element, "U", "U", "label", "font-decoration", layer);
      createButton(element, "B", "B", "label", "font-weight", layer);
      createButton(element, "I", "I", "label", "font-style", layer);
      createColorPicker(element, haloColor, "label", "haloColor", layer);
      createSelect(
        element,
        haloSize,
        haloSizeOptions,
        "label",
        "haloSize",
        layer
      );

      createButton(element, "<", "above-left", "label", "placement", layer);
      createButton(element, "|", "above-center", "label", "placement", layer);
      createButton(element, ">", "above-right", "label", "placement", layer);

      createButton(element, "<<", "center-left", "label", "placement", layer);
      createButton(element, "||", "center-center", "label", "placement", layer);
      createButton(element, ">>", "center-right", "label", "placement", layer);

      createButton(element, "<<<", "below-left", "label", "placement", layer);
      createButton(element, "|||", "below-center", "label", "placement", layer);
      createButton(element, ">>>", "below-right", "label", "placement", layer);
    }
  };

  const changeLabel = (event, attribute, layer) => {
    let value = event.target.value;
    let labelClass;
    if (layer.labelingInfo) {
      labelClass = layer.labelingInfo[0].clone();
    } else {
      labelClass = {
        symbol: {
          type: "text",
          font: {},
        },
        labelExpressionInfo: {
          expression: "$feature.SymbolId",
        },
        labelPlacement: "above-center",
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
      // ==== labelPlacement =====
      case "placement":
        labelClass.labelPlacement = value;
        break;
    }
    layer.labelingInfo = [labelClass];
  };

  // ==================================
  // ======= creator functions ========
  // ==================================
  const createButton = (element, text, value, type, attribute, layer) => {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.value = value;
    button.onclick = (event) => {
      callbackFunction(event, type, attribute, layer);
    };
    element.appendChild(button);
  };

  const createColorPicker = (element, defaultValue, type, attribute, layer) => {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = defaultValue;
    colorPicker.onchange = (event) => {
      callbackFunction(event, type, attribute, layer);
    };
    element.appendChild(colorPicker);
  };

  const createRange = (
    element,
    type,
    attribute,
    valueElement,
    { value, min, max },
    layer
  ) => {
    const range = document.createElement("input");
    range.type = "range";
    range.value = value;
    range.min = min;
    range.max = max;
    range.onchange = (event) => {
      callbackFunction(event, type, attribute, layer);
    };
    const rangeValue = document.createElement("p");
    rangeValue.innerText = value;
    rangeValue.className = valueElement;

    element.appendChild(range);
    element.appendChild(rangeValue);
  };

  const createSelect = (
    element,
    defaultValue,
    optionsArray,
    type,
    attribute,
    layer
  ) => {
    const select = document.createElement("select");
    for (option of optionsArray) {
      if (option == defaultValue) {
        createOption(select, option, true);
      } else {
        createOption(select, option, false);
      }
    }
    select.onchange = (event) => {
      callbackFunction(event, type, attribute, layer);
    };
    element.appendChild(select);
  };

  const callbackFunction = (event, type, attribute, layer) => {
    if (type == "symbol") {
      changeSymbol(event, attribute, layer);
    } else if (type == "label") {
      changeLabel(event, attribute, layer);
    }
  };

  const createOption = (selectElement, value, selected) => {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = value;
    if (selected) {
      option.selected = selected;
    }
    selectElement.appendChild(option);
  };

  const rgbToHex = ({ r, g, b }) => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  return { load };
});
