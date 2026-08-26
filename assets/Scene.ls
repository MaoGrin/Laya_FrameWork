{
  "_$ver": 1,
  "_$id": "lx8mwule",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "width": 1334,
  "height": 750,
  "_$comp": [
    {
      "_$type": "7bad1742-6eed-4d8d-81c0-501dc5bf03d6",
      "scriptPath": "../src/Main.ts"
    }
  ],
  "_$child": [
    {
      "_$id": "4remo5i5",
      "_$prefab": "b72f48d3-6577-42a5-afae-916777ebc44a",
      "name": "BagPanel",
      "active": true,
      "x": 329,
      "y": 55,
      "visible": true,
      "_$child": [
        {
          "_$override": [
            "76w0sog3",
            "uhmoyvf8"
          ],
          "_templateNode": {
            "_$ref": "cn7pmxw9",
            "_$tmpl": "itemTemplate"
          },
          "name": "ItemList"
        },
        {
          "_$id": "cn7pmxw9",
          "_$prefab": "142cf089-2cdd-4e8c-b5a5-4d3fc2455473",
          "_$parent": [
            "76w0sog3",
            "uhmoyvf8"
          ],
          "name": "BagItem",
          "active": true,
          "x": 0,
          "y": 0,
          "visible": true
        }
      ]
    }
  ]
}