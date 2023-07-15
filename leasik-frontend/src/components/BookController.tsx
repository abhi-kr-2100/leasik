import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
} from "@mui/material";

import * as Types from "../utilities/types";
import Book from "./Book";

export default function BookController(props: IBookControllerProps) {
  const [isSelectingTags, setIsSelectingTags] = useState(false);
  const [tagStatuses, setTagStatuses] = useState<TagSelectionStatus[]>([]);

  const [shouldPlayUntaggedSentences, setShouldPlayUntaggedSentences] =
    useState(true);

  useEffect(() => {
    setTagStatuses(allSelected(props.book.tags));
  }, [props.book]);

  const tagSelectionToggler = (idx: number) => {
    setTagStatuses((current) => [
      ...current.slice(0, idx),
      { ...current[idx], isSelected: !current[idx].isSelected },
      ...current.slice(idx + 1),
    ]);
  };

  const playLink = useMemo(
    () => getPlayLink(props.book.id, tagStatuses, shouldPlayUntaggedSentences),
    [props.book, tagStatuses, shouldPlayUntaggedSentences]
  );

  return (
    <>
      <Book
        book={props.book}
        onTagSelection={() => setIsSelectingTags(true)}
        playLink={playLink}
      />
      <TagSelectionModal
        isOpen={isSelectingTags}
        onClose={() => {
          setIsSelectingTags(false);
          setTagStatuses(allSelected(props.book.tags));
          setShouldPlayUntaggedSentences(true);
        }}
        onFinish={() => setIsSelectingTags(false)}
        tagStatuses={tagStatuses}
        onTagSelectionToggle={tagSelectionToggler}
        isUntaggedOptionSelected={shouldPlayUntaggedSentences}
        onUntaggedOptionSelectionToggle={() =>
          setShouldPlayUntaggedSentences((current) => !current)
        }
      />
    </>
  );
}

function TagSelectionModal(props: ITagSelectionModalProps) {
  return (
    <Modal open={props.isOpen} onClose={props.onClose}>
      <Box display={"flex"} flexDirection={"column"} sx={dialogBoxStyles}>
        <FormGroup>
          {props.tagStatuses.map((tag, idx) => (
            <FormControlLabel
              key={idx}
              control={
                <Checkbox
                  checked={tag.isSelected}
                  onChange={() => props.onTagSelectionToggle(idx)}
                />
              }
              label={tag.label}
            />
          ))}
          <FormControlLabel
            control={
              <Checkbox
                checked={props.isUntaggedOptionSelected}
                onChange={props.onUntaggedOptionSelectionToggle}
              />
            }
            label={"Untagged"}
          />
        </FormGroup>
        <Button variant="contained" onClick={props.onFinish} sx={{ mt: 4 }}>
          Select
        </Button>
      </Box>
    </Modal>
  );
}

function getPlayLink(
  bookId: string,
  tagStatuses: TagSelectionStatus[],
  shouldPlayUntaggedSentences: boolean
) {
  const queryParams = new URLSearchParams({
    tags: tagStatuses
      .filter((tag) => tag.isSelected)
      .map((tag) => tag.label)
      .toString(),
    includeUntagged: shouldPlayUntaggedSentences.toString(),
  });

  return `/books/${bookId}?${queryParams}`;
}

interface ITagSelectionModalProps {
  isOpen: boolean;
  onClose: () => any;
  onFinish: () => any;

  tagStatuses: TagSelectionStatus[];
  onTagSelectionToggle: (tagIdx: number) => any;

  isUntaggedOptionSelected: boolean;
  onUntaggedOptionSelectionToggle: () => any;
}

function allSelected(tags: string[]): TagSelectionStatus[] {
  return tags.map((tag) => ({ label: tag, isSelected: true }));
}

type TagSelectionStatus = {
  label: string;
  isSelected: boolean;
};

export interface IBookControllerProps {
  book: Types.Book;
}

const dialogBoxStyles = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,

  backgroundColor: "white",
  boxShadow: 24,

  borderRadius: "1rem",

  p: 4,
};
