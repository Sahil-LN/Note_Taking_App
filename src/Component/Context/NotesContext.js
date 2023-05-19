import { Modal } from "antd";
import { createContext, useContext, useState } from "react";

const noteContext = createContext();

export function useNotes() {
  const useNoteContext = useContext(noteContext);

  return useNoteContext;
}

export function NotesProvider(props) {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState({});

  const onAdd = (title, description) => {
    for (let item of data) {
      if (item.title === title) {
        // alert("Note With Title=" + title + " is Already Exists..");
        Modal.warn({
          title: "Duplicate Title",
          content : "Note With Title=" + title + " is Already Exists.."
        });
        
        return false;
      }
    }

    setData([
      ...data,
      {
        id: Math.floor(Math.random() * 11090909900),
        title,
        description,
      },
    ]);

    console.log(data);

    return true;
  };

  const setUpdateStatus = (changeUpdate, newCardData) => {
    setUpdate({
      ...newCardData,
      update: changeUpdate,
    });
  };

  const onDelete = (id) => {
    setData(data.filter((item) => item.id !== id));

    console.log("deleted Clicked");
    // console.log(data);
    console.log(id);
  };


  const onUpdate = (updatedValue) => {
    var noteIndex = 0;

    for (let i = 0; i < data.length; i++) {
      if (
        data[i].title === updatedValue.title &&
        data[i].id !== updatedValue.id
      ) {
        // alert("Note With Title=" + updatedValue.title + " is Already Exists..");
        Modal.warn({
          title: "Duplicate Title",
          content : "Note With Title=" + updatedValue.title + " is Already Exists.."
        });

        return false;
      }

      if (data[i].id === updatedValue.id) {
        noteIndex = i;
      }
    }

    data[noteIndex].title = updatedValue.title;
    data[noteIndex].description = updatedValue.description;

    setData([...data]);
    console.log("updating");

    return true;
  };

  function setLocalStorageData(storedData){
    setData([
        ...storedData
    ])
  }

  const value= { data,update,onAdd,onDelete,onUpdate,setUpdateStatus, setLocalStorageData};

  return <noteContext.Provider value={value} {...props}/>
}
