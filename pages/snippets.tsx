import {
  faClipboard,
  faPaperPlane,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ActionIcon,
  Button,
  Card,
  createStyles,
  Divider,
  Input,
  LoadingOverlay,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  useClipboard,
  useDidUpdate,
  useInputState,
  useListState,
} from "@mantine/hooks";
import axios from "axios";
import { readJSON, writeJSON } from "fs-extra";
import Linkify from "linkify-react";
import { snippetsPath } from "models/paths";
import { Snippet } from "models/snippets";
import { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react";

interface SnippetsProps {
  serverSnippets: Snippet[];
}

export const getServerSideProps: GetServerSideProps<
  SnippetsProps
> = async () => {
  let serverSnippets: Snippet[] = [];

  try {
    const data = await readJSON(snippetsPath);
    serverSnippets = data;
  } catch {
    await writeJSON(snippetsPath, []);
    serverSnippets = [];
  }

  return { props: { serverSnippets } };
};

const Snippets: NextPage<SnippetsProps> = ({ serverSnippets }) => {
  const clipboard = useClipboard({ timeout: 500 });

  const { classes } = useStyles();
  const [userText, setUserText] = useInputState("");

  const [snippets, snippetsHandler] = useListState<Snippet>(serverSnippets);
  const [loading, setLoading] = useState(false);

  useDidUpdate(() => {
    setLoading(true);

    axios
      .post("/api/snippets/update", snippets)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [snippets]);

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

  const handleCopy = (e: React.MouseEvent) => {
    const index = e.currentTarget.getAttribute("data-index");
    if (!index) return;

    clipboard.copy(snippets[parseInt(index)].text);
  };

  return (
    <>
      <Title order={3}>Texte</Title>
      <LoadingOverlay visible={loading} />
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
              <Linkify
                options={{ className: classes.snippetText, target: "_blank" }}
              >
                {snippet.text}
              </Linkify>
              <div className={classes.snippetActions}>
                <Tooltip label="Kopieren" withinPortal>
                  <ActionIcon onClick={handleCopy} data-index={index}>
                    <FontAwesomeIcon icon={faClipboard} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Löschen" withinPortal>
                  <ActionIcon onClick={handleDelete} data-index={index}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </ActionIcon>
                </Tooltip>
              </div>
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

  snippetActions: {
    display: "flex",
    flexDirection: "row",
  },
}));

export default Snippets;
