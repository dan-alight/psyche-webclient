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
import { Container } from "@/components/Container";

export default function ApiKeys() {
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
    const json = await res.json();
    const data = json["data"];
    const N = 30;
    const replicatedData = Array(N).fill(data).flat();
    setApiKeys(replicatedData);
  };
  useEffect(() => {
    getApiKeys();
  }, []);

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
      provider: selectedProvider,
      name: "",
    });
  };

  const deleteApiKey = async (id: number) => {
    const res = await fetch(`${config.HTTP_URL}/api-keys/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setApiKeys((prevKeys) => prevKeys.filter((key) => key.id != id));
    }
  };

  const updateApiKey = async (update: ApiKeyUpdate) => {
    const res = await fetch(`${config.HTTP_URL}/api-keys`, {
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
    <>
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
      <form
        onSubmit={(e) => {
          e.preventDefault(); // prevent full page reload
          createApiKey(); // your existing function
        }}
        css={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input
          type="text"
          placeholder="API key value"
          value={newApiKey.key_value}
          onChange={(e) =>
            setNewApiKey({ ...newApiKey, key_value: e.target.value })
          }
          required // optional: native validation
        />
        <input
          type="text"
          placeholder="Identifying name"
          value={newApiKey.name}
          onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
          required
        />
        <button type="submit" css={{ alignSelf: "flex-start" }}>
          Create
        </button>
      </form>
      <h2>Existing {selectedProvider} keys</h2>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {apiKeys
          .filter((apiKeys) => apiKeys.provider === selectedProvider)
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
                <button onClick={() => deleteApiKey(apiKey.id)}>Delete</button>
              </div>
            );
          })}
      </div>
    </>
  );
}
