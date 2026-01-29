import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { ExportFormat } from "./models";

export default function ExportDialog(props: {
  open: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat) => Promise<void>;
}) {
  const { open, onClose, onExport } = props;
  const [format, setFormat] = useState<ExportFormat>("json");
  const [isExporting, setExporting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setFormat("json");
      setError(undefined);
      setExporting(false);
    }
  }, [open]);

  const handleExport = async () => {
    setExporting(true);
    setError(undefined);
    try {
      await onExport(format);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Export analysis</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Choose an export format for this analysis.
          </Typography>
          <FormControl>
            <RadioGroup
              value={format}
              onChange={(event) => setFormat(event.target.value as ExportFormat)}
            >
              <FormControlLabel value="json" control={<Radio />} label="JSON" />
              <FormControlLabel value="csv" control={<Radio />} label="CSV" />
              <FormControlLabel value="html" control={<Radio />} label="HTML" />
            </RadioGroup>
          </FormControl>
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isExporting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
