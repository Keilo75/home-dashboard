import { faPaperPlane, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionIcon,
  Button,
  Card,
  createStyles,
  Divider,
  Input,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useInputState, useListState } from "@mantine/hooks";
import { Snippet } from "models/snippets";
import { NextPage } from "next";
import React, { useMemo } from "react";

const Snippets: NextPage = () => {
  const { classes } = useStyles();
  const [userText, setUserText] = useInputState("");

  const [snippets, snippetsHandler] = useListState<Snippet>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    snippetsHandler.prepend({ text: userText, createdAt: Date.now() });

    setUserText("");
  };

  const handleDelete = (e: React.MouseEvent) => {
    const index = e.currentTarget.getAttribute("data-index");
    if (!index) return;

    snippetsHandler.remove(parseInt(index));
  };

  return (
    <>
      <Title order={3}>Texte</Title>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextInput
          className={classes.formInput}
          placeholder="Füge Text ein..."
          label="Text"
          required
          value={userText}
          onChange={setUserText}
        />
        <Button
          leftIcon={<FontAwesomeIcon icon={faPaperPlane} />}
          type="submit"
        >
          Hinzufügen
        </Button>
      </form>
      <Divider my="xs" />
      {snippets.length === 0 ? (
        <Text>Keine Texte gefunden.</Text>
      ) : (
        <Stack spacing="xs">
          {snippets.map((snippet, index) => (
            <Card
              key={snippet.createdAt}
              p="xs"
              withBorder
              className={classes.snippet}
            >
              <div className={classes.snippetText}>{snippet.text}</div>
              <Tooltip label="Löschen" withinPortal>
                <ActionIcon onClick={handleDelete} data-index={index}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </ActionIcon>
              </Tooltip>
            </Card>
          ))}
        </Stack>
      )}
    </>
  );
};

const useStyles = createStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing.xs,
    alignItems: "flex-end",
  },

  formInput: {
    flexGrow: 1,
  },

  snippet: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
    alignItems: "center",
  },

  snippetText: {
    flexGrow: 1,
  },
}));

export default Snippets;
