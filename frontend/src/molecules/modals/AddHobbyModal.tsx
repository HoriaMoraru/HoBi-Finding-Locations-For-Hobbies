// src/components/modals/AddHobbyModal.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AddHobbyModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newHobby: string) => void;
}

const AddHobbyModal: React.FC<AddHobbyModalProps> = ({ open, onClose, onAdd }) => {
  const [hobby, setHobby] = useState<string>("");

  const handleAdd = () => {
    if (hobby.trim() === "") {
      alert("Hobby cannot be empty.");
      return;
    }
    onAdd(hobby.trim());
    setHobby("");
  };

  const handleClose = () => {
    onClose();
    setHobby("");
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add New Hobby
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Hobby"
            type="text"
            fullWidth
            variant="outlined"
            value={hobby}
            onChange={(e) => setHobby(e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAdd} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddHobbyModal;
