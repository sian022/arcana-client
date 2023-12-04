import { IconButton, Menu, MenuItem } from "@mui/material";
import React, { useRef } from "react";
import useDisclosure from "../hooks/useDisclosure";
import {
  Archive,
  ArrowForward,
  Block,
  Cancel,
  Edit,
  History,
  HowToReg,
  MonetizationOn,
  More,
  PeopleAlt,
  Print,
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
  onPrintFreebies,
  onAddPriceChange,
  onVoid,
  onHistory,
  disableActions,
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
    } else if (action === "history") {
      onHistory();
    } else if (action === "printFreebies") {
      onPrintFreebies();
    } else if (action === "addPriceChange") {
      onAddPriceChange();
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
            disabled={
              disableActions ? disableActions?.includes("viewMore") : false
            }
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
            disabled={disableActions ? disableActions?.includes("tag") : false}
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
            disabled={disableActions ? disableActions?.includes("edit") : false}
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
            disabled={
              disableActions ? disableActions?.includes("archive") : false
            }
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
            disabled={
              disableActions
                ? disableActions?.includes("requestFreebie")
                : false
            }
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
            disabled={
              disableActions
                ? disableActions?.includes("releaseFreebie")
                : false
            }
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
            disabled={
              disableActions
                ? disableActions?.includes("regularRegister")
                : false
            }
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
            disabled={
              disableActions
                ? disableActions?.includes("updateFreebies")
                : false
            }
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
            disabled={
              disableActions
                ? disableActions?.includes("cancelFreebies")
                : false
            }
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
            disabled={
              disableActions
                ? disableActions?.includes("manageApprovers")
                : false
            }
          >
            <PeopleAlt />
            Manage Approvers
          </MenuItem>
        )}

        {onAddPriceChange && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("addPriceChange");
            }}
            disabled={
              disableActions
                ? disableActions?.includes("addPriceChange")
                : false
            }
          >
            <MonetizationOn />
            Add Price Change
          </MenuItem>
        )}

        {onHistory && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("history");
            }}
            disabled={
              disableActions ? disableActions?.includes("history") : false
            }
          >
            <History />
            History
          </MenuItem>
        )}

        {onPrintFreebies && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("printFreebies");
            }}
            disabled={
              disableActions ? disableActions?.includes("printFreebies") : false
            }
            // title={
            //   disableActions && disableActions?.includes("printFreebies")
            //     ? "No freebies found"
            //     : ""
            // }
          >
            <Print />
            Print Freebies
          </MenuItem>
        )}

        {onVoid && (
          <MenuItem
            className="actionsMenuItem"
            onClick={() => {
              handleAction("void");
            }}
            disabled={disableActions ? disableActions?.includes("void") : false}
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
