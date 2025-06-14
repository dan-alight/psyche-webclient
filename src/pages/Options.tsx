import { useState, useEffect } from "react";
import config from "@/config";
import type {
  AiProvider,
  ApiKeyCreate,
  ApiKeyUpdate,
  ApiKeyRead,
} from "@/types/api";
import { AiProviders } from "@/types/api";
import { useTheme } from "@emotion/react";
import { pxToRem } from "@/utils";

export default function Options() {
  const theme = useTheme();
  const [selectedProvider, setSelectedProvider] =
    useState<AiProvider>("openai");
  const [apiKeys, setApiKeys] = useState<ApiKeyRead[]>([]);
  const [newApiKey, setNewApiKey] = useState<ApiKeyCreate>({
    key_value: "",
    provider: selectedProvider,
    name: "",
  });
  const getApiKeys = async () => {
    const res = await fetch(`${config.HTTP_URL}/api-keys`);
    const data = await res.json();
    setApiKeys(data);
  };
  useEffect(() => {
    getApiKeys();
  }, []);

  const createApiKey = async () => {
    const res = await fetch(`${config.HTTP_URL}/api-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newApiKey),
    });
    const data = await res.json();
    setApiKeys((prevKeys) => [...prevKeys, data]);
    setNewApiKey({
      key_value: "",
      provider: selectedProvider,
      name: "",
    });
  };

  const deleteApiKey = async (key_value: string) => {
    const res = await fetch(
      `${config.HTTP_URL}/api-key/${encodeURIComponent(key_value)}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      setApiKeys((prevKeys) =>
        prevKeys.filter((key) => key.key_value != key_value)
      );
    }
  };

  const updateApiKey = async (update: ApiKeyUpdate) => {
    const res = await fetch(`${config.HTTP_URL}/api-key`, {
      method: "PUT",
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
      key_value: apiKey.key_value,
      new_active: apiKey.active ? false : true,
    };
    updateApiKey(update);
  };

  const changeApiKeyName = async (apiKey: ApiKeyRead, new_name: string) => {
    const update: ApiKeyUpdate = {
      key_value: apiKey.key_value,
      new_name: new_name,
    };
    updateApiKey(update);
  };

  return (
    <div
      css={{
        width: "100%",
        maxWidth: pxToRem(theme.containerWidths.content),
        margin: "0 auto",
      }}
    >
      <h1>Manage API keys</h1>
      <select
        value={selectedProvider}
        onChange={(e) => setSelectedProvider(e.target.value as AiProvider)}
      >
        {AiProviders.map((provider, i) => (
          <option key={i} value={provider}>
            {provider}
          </option>
        ))}
      </select>

      <h2>Create new {selectedProvider} key</h2>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          marginTop: `${theme.spacing.md}rem`,
        }}
      >
        <input
          type="text"
          placeholder="API key value"
          value={newApiKey.key_value}
          onChange={(e) =>
            setNewApiKey({ ...newApiKey, key_value: e.target.value })
          }
        ></input>
        <input
          type="text"
          placeholder="Identifying name"
          value={newApiKey.name}
          onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
        ></input>
      </div>
      <button onClick={createApiKey}>Create</button>
      <h2>Existing keys</h2>
      <div css={{ marginTop: `${theme.spacing.md}rem` }}>
        {apiKeys
          .filter((apiKeys) => apiKeys.provider === selectedProvider)
          .map((apiKey, i) => {
            const key = apiKey.key_value;
            const toShow = 20;
            const shortened =
              key.length > toShow
                ? `${key.slice(0, toShow / 2)}...${key.slice(-(toShow / 2))}`
                : key;
            return (
              <div key={i}>
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
                <button onClick={() => deleteApiKey(apiKey.key_value)}>
                  Delete
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
