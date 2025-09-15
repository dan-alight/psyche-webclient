import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import config from "@/config";
import type {
  AiProviderRead,
  ApiKeyCreate,
  ApiKeyUpdate,
  ApiKeyRead,
  AiProviderCreate,
  AiModelRead,
} from "@/types/api";
import styles from "./index.module.css";

export const Route = createFileRoute("/options/")({
  component: Providers,
});

async function getProviders(): Promise<{ data: AiProviderRead[] }> {
  const res = await fetch(`${config.HTTP_URL}/ai-providers`);
  if (!res.ok) throw new Error("Failed to fetch providers");
  return res.json();
}

async function createProvider(
  provider: AiProviderCreate
): Promise<AiProviderRead> {
  const res = await fetch(`${config.HTTP_URL}/ai-providers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(provider),
  });
  if (!res.ok) throw new Error("Failed to create provider");
  return res.json();
}

async function updateProvider({
  id,
  ...data
}: AiProviderRead): Promise<AiProviderRead> {
  const res = await fetch(`${config.HTTP_URL}/ai-providers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update provider");
  return res.json();
}

async function deleteProvider(id: number): Promise<void> {
  const res = await fetch(`${config.HTTP_URL}/ai-providers/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete provider");
}

async function getApiKeys(): Promise<{ data: ApiKeyRead[] }> {
  const res = await fetch(`${config.HTTP_URL}/api-keys`);
  if (!res.ok) throw new Error("Failed to fetch API keys");
  return res.json();
}

async function createApiKey(apiKey: ApiKeyCreate): Promise<ApiKeyRead> {
  const res = await fetch(`${config.HTTP_URL}/api-keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiKey),
  });
  if (!res.ok) throw new Error("Failed to create API key");
  return res.json();
}

async function updateApiKey(
  id: number,
  update: ApiKeyUpdate
): Promise<ApiKeyRead> {
  const res = await fetch(`${config.HTTP_URL}/api-keys/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error("Failed to update API key");
  return res.json();
}

async function deleteApiKey(id: number): Promise<void> {
  const res = await fetch(`${config.HTTP_URL}/api-keys/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete API key");
}

async function getModels(
  providerId: number,
  refresh = false
): Promise<AiModelRead[]> {
  const url = new URL(
    `${config.HTTP_URL}/ai-providers/${providerId}/ai-models`
  );
  if (refresh) url.searchParams.set("refresh", "true");

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch models");
  return res.json();
}

async function updateModel(model: AiModelRead): Promise<AiModelRead> {
  const res = await fetch(`${config.HTTP_URL}/ai-models/${model.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active: !model.active }),
  });
  if (!res.ok) throw new Error("Failed to update model");
  return res.json();
}

function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.modal}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalContent}>
        <button onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

function CreateNewApiKeyModal({
  onClose,
  provider,
}: {
  onClose: () => void;
  provider: AiProviderRead;
}) {
  const queryClient = useQueryClient();
  const [newApiKey, setNewApiKey] = useState<ApiKeyCreate>({
    key_value: "",
    provider_id: provider?.id || 0,
    name: "",
  });

  const createApiKeyMutation = useMutation({
    mutationFn: createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      setNewApiKey({ key_value: "", provider_id: provider?.id || 0, name: "" });
      onClose();
    },
  });

  return (
    <Modal onClose={onClose}>
      <form
        name="createApiKeyForm"
        onSubmit={(e) => {
          e.preventDefault();
          createApiKeyMutation.mutate({
            ...newApiKey,
            provider_id: provider.id,
          });
        }}
        className={styles.form}
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
          required
        />
        <button type="submit" className={styles.formButton}>
          Create
        </button>
      </form>
    </Modal>
  );
}

function CreateNewProviderModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (provider: AiProviderRead) => void;
}) {
  const queryClient = useQueryClient();
  const [newProvider, setNewProvider] = useState<AiProviderCreate>({
    name: "",
    base_url: "",
  });

  const createProviderMutation = useMutation({
    mutationFn: createProvider,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      setNewProvider({ name: "", base_url: "" });
      onSuccess(data);
      onClose();
    },
  });

  return (
    <Modal onClose={onClose}>
      <form
        name="createProviderForm"
        onSubmit={(e) => {
          e.preventDefault();
          createProviderMutation.mutate(newProvider);
        }}
        className={styles.form}
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
        <button type="submit" className={styles.formButton}>
          Create
        </button>
      </form>
    </Modal>
  );
}

function EditProviderModal({
  onClose,
  provider,
  onDeleted,
}: {
  onClose: () => void;
  provider: AiProviderRead;
  onDeleted: () => void;
}) {
  const queryClient = useQueryClient();
  const [editedProvider, setEditedProvider] =
    useState<AiProviderRead>(provider);

  // Shouldn't do this, instead use key prop to reset state
  useEffect(() => {
    setEditedProvider(provider ?? null);
  }, [provider]);

  const updateProviderMutation = useMutation({
    mutationFn: updateProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      onClose();
    },
  });

  const deleteProviderMutation = useMutation({
    mutationFn: deleteProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      onDeleted();
      onClose();
    },
  });

  return (
    <Modal onClose={onClose}>
      <form
        name="editProviderForm"
        onSubmit={(e) => {
          e.preventDefault();
          updateProviderMutation.mutate(editedProvider);
        }}
        className={styles.form}
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
      <button onClick={() => deleteProviderMutation.mutate(provider.id)}>
        DELETE
      </button>
    </Modal>
  );
}

function ModelList({
  provider,
  apiKeys,
}: {
  provider?: AiProviderRead;
  apiKeys?: ApiKeyRead[];
}) {
  const queryClient = useQueryClient();

  const hasActiveKey = apiKeys?.some(
    (key) => key.provider_id === provider?.id && key.active
  );
  const {
    data: models = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["models", provider?.id],
    queryFn: () => getModels(provider!.id),
    enabled: !!provider && !!hasActiveKey,
  });

  const toggleModelMutation = useMutation({
    mutationFn: updateModel,
    onMutate: async (model) => {
      await queryClient.cancelQueries({ queryKey: ["models", provider?.id] });
      const previousModels = queryClient.getQueryData<AiModelRead[]>([
        "models",
        provider?.id,
      ]);

      queryClient.setQueryData<AiModelRead[]>(
        ["models", provider?.id],
        (old) =>
          old?.map((m) =>
            m.id === model.id ? { ...m, active: !m.active } : m
          ) || []
      );

      return { previousModels };
    },
    onError: (err, model, context) => {
      queryClient.setQueryData(
        ["models", provider?.id],
        context?.previousModels
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["models", provider?.id] });
    },
  });

  if (!provider) return null;

  if (isLoading) return <div>Loading models...</div>;

  if (!hasActiveKey || models.length === 0) {
    return (
      <div>
        <i>
          No models available for {provider.name}. Activate a valid API key then
          refresh the model list.
        </i>
      </div>
    );
  }

  return (
    <div>
      {models.map((model) => (
        <div key={model.id}>
          <input
            name="modelActiveCheckbox"
            type="checkbox"
            checked={model.active}
            onChange={() => toggleModelMutation.mutate(model)}
          />
          {model.name}
        </div>
      ))}
    </div>
  );
}

function Providers() {
  const queryClient = useQueryClient();

  const [addNewProviderModalOpen, setAddNewProviderModalOpen] = useState(false);
  const [editProviderModalOpen, setEditProviderModalOpen] = useState(false);
  const [createNewApiKeyModalOpen, setCreateNewApiKeyModalOpen] =
    useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(
    null
  );

  // Queries
  const { data: providersData, isLoading: providersLoading } = useQuery({
    queryKey: ["providers"],
    queryFn: getProviders,
  });

  const { data: apiKeysData, isLoading: apiKeysLoading } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: getApiKeys,
  });

  const providers = providersData?.data || [];
  const apiKeys = apiKeysData?.data || [];
  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  // Set initial selected provider
  // Shouldn't do this, instead use key prop to reset state
  useEffect(() => {
    if (providers.length > 0 && !selectedProviderId) {
      setSelectedProviderId(providers[0].id);
    }
  }, [providers, selectedProviderId]);

  // Mutations
  const deleteApiKeyMutation = useMutation({
    mutationFn: deleteApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });

  const toggleApiKeyMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      updateApiKey(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });

  const refreshModelsMutation = useMutation({
    mutationFn: (providerId: number) => getModels(providerId, true),
    onSuccess: (data, providerId) => {
      queryClient.setQueryData(["models", providerId], data);
    },
  });

  if (providersLoading || apiKeysLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Provider Options</h1>
      <div className={styles.providersContainer}>
        {addNewProviderModalOpen && (
          <CreateNewProviderModal
            onClose={() => setAddNewProviderModalOpen(false)}
            onSuccess={(provider) => setSelectedProviderId(provider.id)}
          />
        )}
        {createNewApiKeyModalOpen && selectedProvider && (
          <CreateNewApiKeyModal
            onClose={() => setCreateNewApiKeyModalOpen(false)}
            provider={selectedProvider}
          />
        )}
        {editProviderModalOpen && selectedProvider && (
          <EditProviderModal
            onClose={() => setEditProviderModalOpen(false)}
            provider={selectedProvider}
            onDeleted={() => {
              setSelectedProviderId(
                providers.length > 1 ? providers[0].id : null
              );
            }}
          />
        )}
        <button
          className={styles.buttonMargin}
          onClick={() => setAddNewProviderModalOpen(true)}
        >
          Add new provider
        </button>

        <div>
          <select
            name="aiProviderSelect"
            value={selectedProvider?.name || ""}
            onChange={(e) =>
              setSelectedProviderId(
                providers.find((p) => p.name === e.target.value)?.id ?? null
              )
            }
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.name}>
                {provider.name}
              </option>
            ))}
          </select>
          <button onClick={() => setEditProviderModalOpen(true)}>
            Edit provider
          </button>
        </div>

        <h3>{selectedProvider?.name} keys</h3>
        <button
          className={styles.buttonMargin}
          onClick={() => setCreateNewApiKeyModalOpen(true)}
        >
          Add new key
        </button>

        <div className={styles.keysContainer}>
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
                    className={
                      apiKey.active
                        ? styles.keyRowActive
                        : styles.keyRowInactive
                    }
                  >
                    <b>{apiKey.name}</b>: {shortened}
                  </div>
                  <button
                    onClick={() =>
                      toggleApiKeyMutation.mutate({
                        id: apiKey.id,
                        active: !apiKey.active,
                      })
                    }
                  >
                    {apiKey.active ? "Deactivate" : "Activate"}
                  </button>
                  <button disabled={true}>Change name</button>
                  <button
                    onClick={() => deleteApiKeyMutation.mutate(apiKey.id)}
                  >
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

        <h3>{selectedProvider?.name} models</h3>
        <button
          className={styles.buttonMargin}
          onClick={() => {
            if (selectedProvider)
              refreshModelsMutation.mutate(selectedProvider.id);
          }}
        >
          Refresh model list
        </button>

        <ModelList provider={selectedProvider} apiKeys={apiKeys} />
      </div>
    </div>
  );
}
