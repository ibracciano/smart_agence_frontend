/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { API_CREATE_AGENT } from "../api/api";
import type { AgentData } from "../types/types";

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface RegisterAgentResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface UseRegisterAgent<T> {
  registerAgent: (agentData: AgentData) => Promise<RegisterAgentResponse<T>>;
  loading: boolean;
  error: Error | null;
}

export function useFetchData<T>(url: string): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        // console.log("response", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: T = await response.json();
        setData(json);
      } catch (e: any) {
        setError(e as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export function useRegisterAgent<T>(): UseRegisterAgent<T> {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const registerAgent = useCallback(async (agentData: AgentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_CREATE_AGENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        let errorMessage = "Enregistrement echoué";
        try {
          const errorJson = await response.json();
          if (errorJson.message) {
            errorMessage = errorJson.message;
          }
        } catch (parseError) {
          // If we can't parse the JSON, just use the default message
          console.log(parseError);
        }
        throw new Error(errorMessage);
      }

      const json: RegisterAgentResponse<T> = await response.json();
      return json;
    } catch (e: any) {
      const error: Error =
        e instanceof Error ? e : new Error("Une erreur s'est produite");
      setError(error);
      return {
        success: false,
        message: error.message || "Enregistrement echoué",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return { registerAgent, loading, error };
}
