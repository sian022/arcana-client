import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useRef } from "react";
import useDisclosure from "../hooks/useDisclosure";
import { Archive, Edit, More, Restore } from "@mui/icons-material";

function CommonActions({ onEdit, onArchive, item, status }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const anchorRef = useRef();

  const handleAction = (action) => {
    if (action === "edit") {
      onEdit(item);
    } else if (action === "archive") {
      onArchive(item.id);
    }
    onClose();
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        sx={{ color: "secondary.main", p: 0 }}
        ref={anchorRef}
      >
        <More />
      </IconButton>
      <Menu open={isOpen} onClose={onClose} anchorEl={anchorRef.current}>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: "600",
          }}
          onClick={() => {
            handleAction("edit");
          }}
        >
          <Edit />
          Edit
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: "600",
          }}
          onClick={() => {
            handleAction("archive");
          }}
        >
          {status ? <Archive /> : <Restore />}
          {status ? "Archive" : "Restore"}
        </MenuItem>
      </Menu>
    </>
  );
}

export default CommonActions;
