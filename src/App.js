import React, { useRef, useEffect, useState } from "react";
import jsonDocument from "./data";
// import "import-jquery";
// import "jquery-ui-bundle"; // you also need this
// import "jquery-ui-bundle/jquery-ui.css";
// import draw2d from './libs/draw2d';
// import draw2d from 'draw2d';
// import "./App.css";

function App() {
  // const draw2d = window.draw2d
  const $ = window.$;
  const draw2d = window.draw2d;
  const drawElement = useRef(null);
  const [data, setData] = useState(jsonDocument);
  const refCanvas = useRef();
  function displayJSON(canvas) {
    var writer = new draw2d.io.json.Writer();
    writer.marshal(canvas, function (json) {
      setData(JSON.stringify(json));
      $("#json").text(JSON.stringify(json, null, 2));
    });
  }

  useEffect(() => {
    refCanvas.current = new draw2d.Canvas("gfx_holder", 2000, 2000);
    refCanvas.current.installEditPolicy(
      new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection: function () {
          return new MyConnection();
        },
      })
    );
    draw();
    refCanvas.current.getCommandStack().addEventListener(listener);
  }, []);

  function listener(e) {
    if (e.isPostChangeEvent()) {
      displayJSON(refCanvas.current);
    }
  }
  function draw() {
    const reader = new draw2d.io.json.Reader();
    reader.unmarshal(refCanvas.current, data);
    // displayJSON(refCanvas.current);
    refCanvas.current.setScrollArea('html');
  }
  function add() {
    const newItem = [
      {
        type: "draw2d.shape.node.Start",
        id: Math.random() * 1000,
        x: 25,
        y: 117,
        width: 50,
        height: 50,
        alpha: 1,
        selectable: true,
        draggable: true,
        angle: 0,
        userData: {},
        cssClass: "draw2d_shape_node_Start",
        ports: [
          {
            type: "draw2d.OutputPort",
            id: "530e6f2b-7d47-0a1b-2c7b-16a7f178bc33",
            width: 10,
            height: 10,
            alpha: 1,
            selectable: false,
            draggable: true,
            angle: 0,
            userData: {},
            cssClass: "draw2d_OutputPort",
            bgColor: "rgba(79,104,112,1)",
            color: "rgba(27,27,27,1)",
            stroke: 1,
            dasharray: null,
            maxFanOut: 9007199254740991,
            name: "output0",
            semanticGroup: "global",
            port: "draw2d.OutputPort",
            locator: "draw2d.layout.locator.OutputPortLocator",
            locatorAttr: {},
          },
        ],
        bgColor: "rgba(77,144,254,1)",
        color: "rgba(69,130,229,1)",
        stroke: 1,
        radius: 2,
        dasharray: null,
      },
    ];

    const reader = new draw2d.io.json.Reader();
    
    reader.unmarshal(refCanvas.current, JSON.stringify(newItem));
  }
  return (
    <div className="App">
      <img
        src="./logo.svg"
        style={{ width: 100, height: 100, background: "red" }}
      />
      <button onClick={add}>Add</button>
      <div style={{ width: 100, height: 100, background: "red" }}></div>
      <div>
        <div style={{ width: 1500, height: 1500 }} id="gfx_holder"></div>
        <pre
          id="json"
          style={{
            overflow: "auto",
            position: "absolute",
            top: 10,
            right: 10,
            width: 450,
            height: 500,
            background: "white",
            border: "1px solid gray",
          }}
        />
      </div>
    </div>
  );
}

export default App;
const $ = window.$;
const MyConnection = window.draw2d.Connection.extend({
  init: function (attr) {
    this._super(attr);

    this.setRouter(
      new window.draw2d.layout.connection.InteractiveManhattanConnectionRouter()
    );
    this.setOutlineStroke(1);
    this.setOutlineColor("#303030");
    this.setStroke(2);
    this.setColor("#00A8F0");
    this.setRadius(20);
  },

  /**
   * @method
   * called by the framework if the figure should show the contextmenu.</br>
   * The strategy to show the context menu depends on the plattform. Either loooong press or
   * right click with the mouse.
   *
   * @param {Number} x the x-coordinate to show the menu
   * @param {Number} y the y-coordinate to show the menu
   * @since 1.1.0
   */
  onContextMenu: function (x, y) {
    $.contextMenu({
      selector: "body",
      events: {
        hide: function () {
          $.contextMenu("destroy");
        },
      },
      callback: $.proxy(function (key, options) {
        switch (key) {
          case "red":
            this.setColor("#f3546a");
            break;
          case "green":
            this.setColor("#b9dd69");
            break;
          case "blue":
            this.setColor("#00A8F0");
            break;
          case "delete":
            // without undo/redo support
            //     this.getCanvas().remove(this);

            // with undo/redo support
            var cmd = new window.draw2d.command.CommandDelete(this);
            this.getCanvas().getCommandStack().execute(cmd);
          default:
            break;
        }
      }, this),
      x: x,
      y: y,
      items: {
        red: { name: "Red" },
        green: { name: "Green" },
        blue: { name: "Blue" },
        sep1: "---------",
        delete: { name: "Delete" },
      },
    });
  },
});
