import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useRef } from "react";
import useDisclosure from "../hooks/useDisclosure";
import {
  Archive,
  ArrowForward,
  Block,
  Cancel,
  Edit,
  HowToReg,
  More,
  PeopleAlt,
  RemoveCircle,
  RequestPage,
  Restore,
  Tag,
  Update,
  Visibility,
} from "@mui/icons-material";

function CommonActions({
  onEdit,
  onArchive,
  onView,
  onTag,
  onFreebie,
  onReleaseFreebie,
  onRegularRegister,
  onUpdateFreebies,
  onCancelFreebies,
  onManageApprovers,
  onVoid,
  item,
  status,
}) {
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
    } else if (action === "releaseFreebie") {
      onReleaseFreebie();
    } else if (action === "regularRegister") {
      onRegularRegister();
    } else if (action === "updateFreebies") {
      onUpdateFreebies();
    } else if (action === "cancelFreebies") {
      onCancelFreebies();
    } else if (action === "viewMore") {
      onView(item);
    } else if (action === "manageApprovers") {
      onManageApprovers();
    } else if (action === "void") {
      onVoid();
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
        {onView && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("viewMore");
            }}
          >
            <Visibility />
            View
          </MenuItem>
        )}
        {onTag && (
          <MenuItem
            className="actionsMenuItem"
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
            className="actionsMenuItem"
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
            className="actionsMenuItem"
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
            className="actionsMenuItem"
            onClick={() => {
              handleAction("requestFreebie");
            }}
          >
            <RequestPage />
            Add Freebie(s)
          </MenuItem>
        )}
        {onReleaseFreebie && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("releaseFreebie");
            }}
          >
            <RequestPage />
            Release Freebie(s)
          </MenuItem>
        )}
        {onRegularRegister && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("regularRegister");
            }}
          >
            <HowToReg />
            Register as Regular
          </MenuItem>
        )}

        {onUpdateFreebies && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("updateFreebies");
            }}
          >
            <Update />
            Update Freebies
          </MenuItem>
        )}

        {onCancelFreebies && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("cancelFreebies");
            }}
          >
            <Cancel />
            Cancel Freebies
          </MenuItem>
        )}

        {onManageApprovers && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("manageApprovers");
            }}
          >
            <PeopleAlt />
            Manage Approvers
          </MenuItem>
        )}

        {onVoid && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("void");
            }}
          >
            <Block />
            Void
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default CommonActions;
