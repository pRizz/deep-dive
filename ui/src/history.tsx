import React, { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { HistoryMetadata } from "./models";
import { formatBytes, formatPercent } from "./utils";

export default function HistoryList(props: {
  entries: HistoryMetadata[];
  isLoading: boolean;
  error?: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}) {
  const { entries, isLoading, error, onSelect, disabled } = props;
  const [filter, setFilter] = useState("");

  const filteredEntries = useMemo(() => {
    const trimmed = filter.trim().toLowerCase();
    if (!trimmed) {
      return entries;
    }
    return entries.filter((entry) =>
      entry.image.toLowerCase().includes(trimmed)
    );
  }, [entries, filter]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h3">History</Typography>
        <TextField
          label="Filter by image/tag"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          size="small"
          sx={{ minWidth: 240 }}
          disabled={disabled}
        />
      </Stack>
      {error ? <Alert severity="warning">{error}</Alert> : null}
      {isLoading ? (
        <Typography variant="body2" color="text.secondary">
          Loading history...
        </Typography>
      ) : filteredEntries.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No saved analyses yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {filteredEntries.map((entry) => {
            const completedAt = new Date(entry.completedAt).toLocaleString();
            const efficiency = formatPercent(entry.summary.efficiencyScore);
            return (
              <Card key={entry.id} variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6">{entry.image}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed: {completedAt}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={`Size: ${formatBytes(entry.summary.sizeBytes)}`}
                        size="small"
                      />
                      <Chip
                        label={`Wasted: ${formatBytes(
                          entry.summary.inefficientBytes
                        )}`}
                        size="small"
                      />
                      <Chip label={`Efficiency: ${efficiency}`} size="small" />
                      <Chip label={entry.source} size="small" />
                    </Stack>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onSelect(entry.id)}
                    disabled={disabled}
                  >
                    Open analysis
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
