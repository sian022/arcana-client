import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useRef } from "react";
import useDisclosure from "../hooks/useDisclosure";
import {
  Archive,
  Edit,
  More,
  RequestPage,
  Restore,
  Tag,
} from "@mui/icons-material";

function CommonActions({ onEdit, onArchive, onTag, onFreebie, item, status }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const anchorRef = useRef();

  const handleAction = (action) => {
    if (action === "edit") {
      onEdit(item);
    } else if (action === "archive") {
      onArchive(item.id);
    } else if (action === "tag") {
      onTag();
    } else if (action === "requestFreebie") {
      onFreebie();
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
        {onTag && (
          <MenuItem
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "600",
            }}
            onClick={() => {
              handleAction("tag");
            }}
          >
            <Tag />
            Tagging
          </MenuItem>
        )}
        {onEdit && (
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
        )}
        {onArchive && (
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
        )}
        {onFreebie && (
          <MenuItem
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "600",
            }}
            onClick={() => {
              handleAction("requestFreebie");
            }}
          >
            <RequestPage />
            Add Freebie(s)
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default CommonActions;