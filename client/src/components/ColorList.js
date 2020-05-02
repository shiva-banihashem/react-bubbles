import React, { useState } from "react";
// import axios from "axios";
import { axiosWithAuth } from "./AxiosAuth";
const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [colorToAdd, setColorToAdd] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    updateColors(
      colors.map(color => {
          if (color.id === colorToEdit.id) {
              return colorToEdit;
          } else {
              return color;
          }
      })
  );
  axiosWithAuth()
      .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
          console.log("Edited color on Server", res);
      })
      .catch(err => console.log(err.response));

   setColorToEdit(initialColor);
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    updateColors(colors.filter(item => item.id !== color.id));
    
      axiosWithAuth()
        .delete(`http://localhost:5000/api/colors/${color.id}`)
        .then(res => {
            console.log("Deleted a color on server", res);
        })
        .catch(err => console.log("error in deleting: ", err.response));
  };

  const addColor = e => {
    e.preventDefault();
    console.log("Color added form: ", colorToAdd);
    axiosWithAuth()
        .post(`http://localhost:5000/api/colors/`, colorToAdd)
        .then(res => console.log("Color added to server"))
        .catch(err => console.log("error in adding color", err.response));

    axiosWithAuth()
        .get(`http://localhost:5000/api/colors`)
        .then(res => {
            updateColors(res.data);
        })
        .catch(err => console.log(err.response));
    setColorToAdd(initialColor)
          
        
  };
  
  return (
    <div className="colors-wrap">
      <p>colors</p>
        <ul>
            {colors.map(color => (
                <li
                    key={color.id}
                    onClick={() => {
                        editColor(color);
                    }}
                >
            <span>
              <span
                  className="delete"
                  onClick={e => {
                      e.stopPropagation();
                      deleteColor(color);
                  }}
              >
                x
              </span>{" "}
                {color.color}
            </span>
                    <div
                        className="color-box"
                        style={{ backgroundColor: color.code.hex }}
                    />
                </li>
            ))}
        </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
        <form onSubmit={addColor}>
            <h4>Add a new color</h4>
            <label>
                color name:
                <input
                    onChange={e =>
                        setColorToAdd({ ...colorToAdd, color: e.target.value })
                    }
                    value={colorToAdd.color}
                />
            </label>
            <label>
                hex code:
                <input
                    onChange={e =>
                        setColorToAdd({
                            ...colorToAdd,
                            code: { hex: e.target.value }
                        })
                    }
                    value={colorToAdd.code.hex}
                />
            </label>
            <button className="buttonAdd" type="submit">Add</button>
        </form>
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
