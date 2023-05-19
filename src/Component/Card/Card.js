import React from "react";

import { useNotes } from "../Context/NotesContext";

import { DeleteOutlined,EditOutlined } from "@ant-design/icons";

import { Button, Divider, Modal } from "antd";

import style1 from "./Card.module.css";

function Card(prop) {
  console.log("card");

  const { onDelete, setUpdateStatus } = useNotes();

  const onDeleteData = () => {
    Modal.confirm({
      title: 'Do You want to delete this Note.',
      onOk:()=>{
        onDelete(prop.data.id);
      }
    })
    
  };

  const onEditNote = () => {
    setUpdateStatus(true, prop.data);
  };

  return (
    <div className={style1.container} data-testid="container">
      <p className={style1.para} >
        {" "}
        Title : {prop.data.title}
      </p>

      <div className={style1.icons}>
        <Divider type="vertical" className={style1.divider} />
        <Button
          data-testid="delete"
          type="primary"
          className={style1.btn}
          onClick={onEditNote}
        >
          <EditOutlined />
        </Button>

        <Divider type="vertical" className={style1.divider} />
        <Button
          data-testid="delete"
          type="primary"
          className={style1.btn}
          onClick={onDeleteData}
        >
          <DeleteOutlined />
        </Button>
      </div>
    </div>
  );
}

export default React.memo(Card);
