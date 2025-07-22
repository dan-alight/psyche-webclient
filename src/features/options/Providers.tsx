import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import config from "@/config";
import type {
  AiProviderRead,
  ApiKeyCreate,
  ApiKeyUpdate,
  ApiKeyRead,
  AiProviderCreate,
  AiModelRead,
} from "@/types/api";

function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  const theme = useTheme();

  return (
    <div
      css={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: theme.colors.modalBackground,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: theme.zIndices.modal,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        css={{
          background: theme.colors.surface,
        }}
      >
        <button onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

function CreateNewApiKeyModal({
  isOpen,
  onClose,
  setApiKeys,
  selectedProvider,
}: {
  isOpen: boolean;
  onClose: () => void;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKeyRead[]>>;
  selectedProvider: AiProviderRead | null;
}) {
  if (!isOpen || !selectedProvider) return null;
  const theme = useTheme();
  const [newApiKey, setNewApiKey] = useState<ApiKeyCreate>({
    key_value: "",
    provider_id: selectedProvider.id,
    name: "",
  });

  const createApiKey = async () => {
    const res = await fetch(`${config.HTTP_URL}/api-keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newApiKey),
    });
    const json = await res.json();
    setApiKeys((prevKeys) => [...prevKeys, json]);
    setNewApiKey({
      key_value: "",
      provider_id: selectedProvider.id,
      name: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        name="createApiKeyForm"
        onSubmit={(e) => {
          e.preventDefault(); // prevent full page reload
          createApiKey(); // your existing function
          onClose(); // close the modal after creating the key
        }}
        css={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input
          type="text"
          placeholder="Identifying name"
          value={newApiKey.name}
          onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="API key value"
          value={newApiKey.key_value}
          onChange={(e) =>
            setNewApiKey({ ...newApiKey, key_value: e.target.value })
          }
          required // optional: native validation
        />

        <button type="submit" css={{ alignSelf: "flex-start" }}>
          Create
        </button>
      </form>
    </Modal>
  );
}
function CreateNewProviderModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (provider: AiProviderRead) => void;
}) {
  if (!isOpen) return null;
  const [newProvider, setNewProvider] = useState<AiProviderCreate>({
    name: "",
    base_url: "",
  });

  const createProvider = async () => {
    const res = await fetch(`${config.HTTP_URL}/ai-providers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProvider),
    });
    const json = await res.json();
    setNewProvider({ name: "", base_url: "" }); // Reset the form
    onCreate(json); // Call the onCreate callback with the new provider
    onClose(); // Close the modal after adding the provider
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        name="createProviderForm"
        onSubmit={(e) => {
          e.preventDefault();
          createProvider(); // Call the function to create the provider
        }}
        css={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input
          type="text"
          placeholder="Provider Name"
          value={newProvider.name}
          onChange={(e) =>
            setNewProvider({ ...newProvider, name: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Provider URL"
          value={newProvider.base_url}
          onChange={(e) =>
            setNewProvider({ ...newProvider, base_url: e.target.value })
          }
          required
        />
        <button type="submit" css={{ alignSelf: "flex-start" }}>
          Create
        </button>
      </form>
    </Modal>
  );
}

function EditProviderModal({
  isOpen,
  onClose,
  onEdit,
  provider,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (provider: AiProviderRead | null) => void;
  provider: AiProviderRead | null;
}) {
  if (!isOpen || !provider) return null;

  const [editedProvider, setEditedProvider] =
    useState<AiProviderRead>(provider);

  const updateProvider = async () => {
    const res = await fetch(`${config.HTTP_URL}/ai-providers/${provider.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedProvider),
    });
    if (res.ok) {
      onEdit(editedProvider);
      onClose(); // Close the modal after updating
    }
  };

  const deleteProvider = async () => {
    const res = await fetch(`${config.HTTP_URL}/ai-providers/${provider.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onEdit(null); // Clear the selected provider
      onClose(); // Close the modal after deleting
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        name="editProviderForm"
        onSubmit={(e) => {
          e.preventDefault();
          updateProvider();
        }}
        css={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input
          type="text"
          value={editedProvider.name}
          onChange={(e) =>
            setEditedProvider({ ...editedProvider, name: e.target.value })
          }
        />
        <input
          type="text"
          value={editedProvider.base_url}
          onChange={(e) =>
            setEditedProvider({ ...editedProvider, base_url: e.target.value })
          }
        />
        <button type="submit">Update</button>
      </form>
      <button onClick={deleteProvider}>DELETE</button>
    </Modal>
  );
}

function ModelList({
  aiModels,
  setAiModels,
  selectedProvider,
}: {
  aiModels: AiModelRead[];
  setAiModels: React.Dispatch<React.SetStateAction<AiModelRead[]>>;
  selectedProvider: AiProviderRead | null;
}) {

  if (!selectedProvider) return null;
  if (aiModels.length === 0) {
    return (
      <div>
        <i>
          No models available for {selectedProvider.name}. Activate a valid API
          key then refresh the model list.
        </i>
      </div>
    );
  }

  const toggleActive = async (model: AiModelRead) => {
    const res = await fetch(
      `${config.HTTP_URL}/ai-providers/${selectedProvider.id}/models/${model.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !model.active }),
      }
    );
    if (res.ok) {
      const updatedModel = await res.json();
      setAiModels((prevModels) =>
        prevModels.map((m) => (m.id === model.id ? updatedModel : m))
      );
    } else {
      console.error("Failed to update model active status");
    }
  };

  return (
    <div>
      {aiModels.map((model) => (
        <div key={model.id}>
          <input
            name="modelActiveCheckbox"
            type="checkbox"
            checked={model.active}
            onChange={(e) => {
              toggleActive(model);
            }}
          />
          {model.name}
        </div>
      ))}
    </div>
  );
}

export default function Providers() {
  const theme = useTheme();

  const [addNewProviderModalOpen, setAddNewProviderModalOpen] = useState(false);
  const [editProviderModalOpen, setEditProviderModalOpen] = useState(false);
  const [createNewApiKeyModalOpen, setCreateNewApiKeyModalOpen] =
    useState(false);
  const [aiProviders, setAiProviders] = useState<AiProviderRead[]>([]);
  const [selectedProvider, setSelectedProvider] =
    useState<AiProviderRead | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeyRead[]>([]);
  const [aiModels, setAiModels] = useState<AiModelRead[]>([]);

  const getApiKeys = async () => {
    const res = await fetch(`${config.HTTP_URL}/api-keys`);
    const json = await res.json();
    const data = json["data"];

    setApiKeys(data);
  };
  const getProviders = async () => {
    const res = await fetch(`${config.HTTP_URL}/ai-providers`);
    const json = await res.json();
    const data = json["data"];
    setAiProviders(data);
  };

  const getModels = async (refresh: boolean) => {
    if (!selectedProvider) return;
    const url = new URL(
      `${config.HTTP_URL}/ai-providers/${selectedProvider.id}/models`
    );
    if (refresh) url.searchParams.set("refresh", "true");
    const res = await fetch(url);

    if (res.ok) {
      const json = await res.json();
      setAiModels(json);
    } else {
      console.error("Failed to fetch models");
    }
  };

  useEffect(() => {
    if (!selectedProvider) return;
    const activeKey = apiKeys.find(
      (key) => key.provider_id === selectedProvider.id && key.active
    );
    if (activeKey) getModels(false);
    else {
      setAiModels([]); // Clear models if no active key
    }
  }, [selectedProvider, apiKeys]);

  useEffect(() => {
    if (!selectedProvider && aiProviders.length > 0) {
      setSelectedProvider(aiProviders[0]);
    }
  }, [aiProviders, selectedProvider]);

  useEffect(() => {
    getProviders();
    getApiKeys();
  }, []);

  const deleteApiKey = async (id: number) => {
    const res = await fetch(`${config.HTTP_URL}/api-keys/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setApiKeys((prevKeys) => prevKeys.filter((key) => key.id != id));
    }
  };

  const updateApiKey = async (id: number, update: ApiKeyUpdate) => {
    const res = await fetch(`${config.HTTP_URL}/api-keys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update),
    });
    if (res.ok) {
      getApiKeys();
    }
  };

  const toggleApiKeyActive = async (apiKey: ApiKeyRead) => {
    const update: ApiKeyUpdate = {
      active: apiKey.active ? false : true,
    };
    updateApiKey(apiKey.id, update);
  };

  const changeApiKeyName = async (apiKey: ApiKeyRead, new_name: string) => {
    const update: ApiKeyUpdate = {
      name: new_name,
    };
    updateApiKey(apiKey.id, update);
  };

  return (
    <div
      css={
        {
          //padding: `${theme.spacing.sm}rem`,
        }
      }
    >
      <h1>Provider Options</h1>
      <div
        css={{
          //border: `1px solid ${theme.colors.border}`,
          //padding: `${theme.spacing.md}rem`,
          //borderRadius: `${theme.radii.sm}rem`,
          //marginTop: `${theme.spacing.md}rem`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          
        }}
      >
        <CreateNewProviderModal
          isOpen={addNewProviderModalOpen}
          onClose={() => setAddNewProviderModalOpen(false)}
          onCreate={(provider: AiProviderRead) => {
            setSelectedProvider(provider);
            getProviders(); // Refresh the provider list
          }}
        />

        <CreateNewApiKeyModal
          isOpen={createNewApiKeyModalOpen}
          onClose={() => setCreateNewApiKeyModalOpen(false)}
          setApiKeys={setApiKeys}
          selectedProvider={selectedProvider}
        />
        <EditProviderModal
          isOpen={editProviderModalOpen}
          onClose={() => setEditProviderModalOpen(false)}
          onEdit={(provider) => {
            setSelectedProvider(provider);
            getProviders(); // Refresh the provider list
          }}
          provider={selectedProvider}
        />
        <button
          css={{ marginBottom: `${theme.spacing.md}rem` }}
          onClick={() => setAddNewProviderModalOpen(true)}
        >
          Add new provider
        </button>

        <div>
          <select
            name="aiProviderSelect"
            value={selectedProvider?.name}
            onChange={(e) =>
              setSelectedProvider(
                aiProviders.find((p) => p.name === e.target.value) || null
              )
            }
            css={
              {
                /*   marginBottom: `${theme.spacing.md}rem`, */
              }
            }
          >
            {aiProviders.map((provider, i) => (
              <option key={i} value={provider.name}>
                {provider.name}
              </option>
            ))}
          </select>
          <button
            css={
              {
                /* marginBottom: `${theme.spacing.md}rem`, */
              }
            }
            onClick={() => setEditProviderModalOpen(true)}
          >
            Edit provider
          </button>
        </div>

        {/* <h3>Create new {selectedProvider} key</h3> */}
        {/*          */}
        <h3>{selectedProvider?.name} keys</h3>
        <button
          css={{
            marginBottom: `${theme.spacing.md}rem`,
          }}
          onClick={() => setCreateNewApiKeyModalOpen(true)}
        >
          Add new key
        </button>
        <div
          css={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {apiKeys
            .filter((apiKey) => apiKey.provider_id === selectedProvider?.id)
            .map((apiKey) => {
              const key = apiKey.key_value;
              const toShow = 20;
              const shortened =
                key.length > toShow
                  ? `${key.slice(0, toShow / 2)}...${key.slice(-(toShow / 2))}`
                  : key;
              return (
                <div key={apiKey.id}>
                  <div
                    css={{
                      background: apiKey.active
                        ? theme.colors.surface
                        : theme.colors.disabled.background,
                    }}
                  >
                    <b>{apiKey.name}</b>: {shortened}
                  </div>
                  <button onClick={() => toggleApiKeyActive(apiKey)}>
                    {apiKey.active ? "Deactivate" : "Activate"}
                  </button>
                  <button disabled={true}>Change name</button>
                  <button onClick={() => deleteApiKey(apiKey.id)}>
                    Delete
                  </button>
                </div>
              );
            })}
          {apiKeys.filter(
            (apiKey) => apiKey.provider_id === selectedProvider?.id
          ).length === 0 && (
            <div>
              <i>No API keys have been added for {selectedProvider?.name}.</i>
            </div>
          )}
        </div>
        {/* <h3>Available {selectedProvider?.name} models</h3> */}

        <h3>{selectedProvider?.name} models</h3>
        <button
          css={{
            /* marginTop: `${theme.spacing.md}rem`, */
            marginBottom: `${theme.spacing.md}rem`,
          }}
          onClick={() => getModels(true)}
        >
          Refresh model list
        </button>
        <ModelList
          aiModels={aiModels}
          setAiModels={setAiModels}
          selectedProvider={selectedProvider}
        />
        {/* <button onClick={refreshModels}>Refresh</button> */}
        {/* Additional content can be added here */}
      </div>
    </div>
  );
}
