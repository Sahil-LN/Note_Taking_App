import React from "react";
import { useNotes } from "../Context/NotesContext";
import { Input, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import styleForm from "./Form.module.css";
import {
  ReloadOutlined,
  CheckOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

function Form(prop) {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    clearData();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { onAdd, onUpdate, setUpdateStatus, update } = useNotes();

  useEffect(() => {
    console.log("form");
    console.log(update);

    if (update.update) {
      setTitle(update.title);
      setDescription(update.description);
      setIsModalOpen(true);
      console.log("update");
    }
  }, [update]);

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      alert("Title Should not be empty...!");
      return;
    }

    if (description.trim() === "") {
      alert("Description should not be empty...!");
      return;
    }

    var res = false;

    if (update.update) {
      console.log(
        Modal.confirm({
          title: "Do You Want To Update Note.",
          onOk: () => {
            res = onUpdate({
              id: update.id,
              title,
              description,
            });

            res && setUpdateStatus(false, {});
            res && setIsModalOpen(false);
          },
        })
      );
    } else {
      res = onAdd(title, description);
    }

    if (res) {
      setDescription("");
      setTitle("");
    }

    console.log(res);
  };

  // Add Note Handler
  function clearData() {
    console.log(title);
    setDescription("");
    setTitle("");

    setUpdateStatus(false, {});
  }

  // State handlers
  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <>
      <Button type="primary" size="large" onClick={showModal}>
        <PlusCircleOutlined style={{ fontSize: "23px" }} />
      </Button>

      <Modal
        title={update.update ? "Update Note" : "Add Note"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={formSubmitHandler}>
          <Input
            size="large"
            placeholder="Title Of the Note"
            className={styleForm.titleInput}
            required
            onChange={onTitleChange}
            value={title}
            maxLength={10}
            data-testid="title"
          />

          <TextArea
            placeholder="Type your Description here"
            autoSize={{
              minRows: 3,
              maxRows: 6,
            }}
            value={description}
            className={styleForm.textAreaInput}
            onChange={onDescriptionChange}
            required
            data-testid="description"
          />
          <br />

          <div className={styleForm.footer}>
            <Button type="primary" onClick={clearData}>
              <ReloadOutlined />
            </Button>

            <Button type="primary" htmlType="submit">
              <CheckOutlined />
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default React.memo(Form);
