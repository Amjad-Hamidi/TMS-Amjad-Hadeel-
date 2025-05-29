import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  CircularProgress,
  Box,
  Stack,
} from "@mui/material";
import { fetchWithAuth } from '../utils/fetchWithAuth';

const feedbackTypeLabels = {
  0: "General",
  1: "Suggestion",
  2: "Complaint",
  3: "Praise",
};

export default function EditModal({ feedback, onSave, onClose }) {
  const [editedMessage, setEditedMessage] = useState(feedback.message || "");
  const [editedRating, setEditedRating] = useState(feedback.rating || 0);
  const [editedType, setEditedType] = useState(feedback.type || 0);
  const [editedAttachment, setEditedAttachment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Message", editedMessage);
      formData.append("Rating", editedRating);
      formData.append("Type", editedType);
      if (editedAttachment) formData.append("Attachment", editedAttachment);

      const response = await fetchWithAuth(
        `http://amjad-hamidi-tms.runasp.net/api/Feedbacks/receiver-user/${feedback.receiverId}/feedback/${feedback.feedbackId}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        Swal.fire("Error", errorText || "Failed to update feedback.", "error");
        setLoading(false);
        return;
      }

      // The backend returns a string, not the updated object, so update locally
      const updatedItem = {
        ...feedback,
        message: editedMessage,
        rating: editedRating,
        type: editedType,
        attachmentUrl: editedAttachment ? "(updated)" : feedback.attachmentUrl,
      };
      onSave(updatedItem);
    } catch (error) {
      Swal.fire("Error", error.message || "An error occurred while updating feedback.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, textAlign: "center", color: "#1e3c72" }}>Edit Feedback</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Message"
            multiline
            minRows={3}
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            fullWidth
          />
          <TextField
            label="Rating"
            type="number"
            value={editedRating}
            inputProps={{ min: 1, max: 5 }}
            onChange={(e) => setEditedRating(Number(e.target.value))}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={editedType}
              label="Type"
              onChange={(e) => setEditedType(Number(e.target.value))}
            >
              <MenuItem value={0}>General</MenuItem>
              <MenuItem value={1}>Suggestion</MenuItem>
              <MenuItem value={2}>Complaint</MenuItem>
              <MenuItem value={3}>Praise</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            component="label"
            color="secondary"
            sx={{ borderRadius: 2 }}
          >
            {editedAttachment ? editedAttachment.name : "Upload Attachment (optional)"}
            <input
              type="file"
              hidden
              onChange={(e) => setEditedAttachment(e.target.files[0])}
              accept=".pdf,.png,.jpg,.jpeg,.docx"
            />
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button onClick={onClose} color="error" variant="contained" sx={{ borderRadius: 2 }} disabled={loading}>
          Cancel
        </Button>
        <Box sx={{ position: "relative" }}>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            sx={{ borderRadius: 2, minWidth: 100 }}
            disabled={loading}
          >
            Save
          </Button>
          {loading && (
            <CircularProgress
              size={28}
              sx={{
                color: "#1976d2",
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-14px",
                marginLeft: "-14px",
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
