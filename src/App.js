import { useEffect } from "react";

import { useNotes } from "./Component/Context/NotesContext";

import styles from "./Component/App.module.css";

import Card from "./Component/Card/Card";

import Form from "./Component/Forms/Form";

function App() {
  const { data, setLocalStorageData } = useNotes();

  // Updating Data to Local Storage
  window.onbeforeunload = () => {
    localStorage.setItem("notes", JSON.stringify(data));
  };

  useEffect(() => {
    console.log("Reloading App");

    if (localStorage.getItem("notes") === null) {
      localStorage.setItem("notes", JSON.stringify(data));
    } else {
      setLocalStorageData(JSON.parse(localStorage.getItem("notes")));
    }
  }, []);

  // Handling Delay
  // useEffect(() => {}, [data, update]);

  const splitData = () => {
    return data.map((item) => <Card key={item.id} data={item} />);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        <div className={styles.heading}>
          <h1>Notes List</h1>
          <Form />
        </div>
        <div className={styles.dataSet}>
          {data.length !== 0 ? (
            splitData()
          ) : (
            <p style={{ textAlign: "center" }}> No Notes Available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
