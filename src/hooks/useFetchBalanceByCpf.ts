import { useState, useEffect } from "react";

interface BalanceData {
  BalanceCurrentValue: number;
  Impact: number;
  ImpactDate: string;
  ImpactOrigin: string;
}

interface ApiResponse {
  Balances: BalanceData[];
  Name: string;
}

export function useFetchBalanceByCpf(cpf: string | null) {
  const [balanceCurrentValue, setBalanceCurrentValue] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cpf || cpf.trim() === "") {
      setError("CPF não fornecido.");
      setLoading(false);
      return;
    }

    console.log("📌 Enviando requisição com CPF:", cpf); // 🔹 Debug para ver o CPF antes da requisição

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://api-back.picbrand.dev.br/Dashboard/GetBalanceByCpf", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cpf": encodeURIComponent(cpf), // ✅ Garante que caracteres especiais no CPF sejam tratados
          },
        });

        console.log("📡 Status da resposta:", response.status); // 🔹 Verifica se a resposta é 200

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        console.log("📩 Resposta recebida da API:", data);

        if (data.Balances && data.Balances.length > 0) {
          // 🔍 Filtra o saldo onde `ImpactOrigin` é "Cadastro"
          const balanceFromCadastro = data.Balances.find(
            (balance: BalanceData) => balance.ImpactOrigin === "Cadastro"
          );

          if (balanceFromCadastro) {
            console.log("✅ Atualizando saldo para:", balanceFromCadastro.BalanceCurrentValue);
            setBalanceCurrentValue(balanceFromCadastro.BalanceCurrentValue);
          } else {
            console.warn("⚠️ Nenhum saldo encontrado com ImpactOrigin = 'Cadastro'");
            setBalanceCurrentValue(0);
          }
        } else {
          console.warn("⚠️ Nenhum saldo encontrado. Resposta vazia.");
          setBalanceCurrentValue(0);
        }

        // 📌 Captura o nome do usuário
        if (data.Name) {
          setUserName(data.Name);
        } else {
          console.warn("⚠️ Nome não encontrado na resposta.");
          setUserName(null);
        }
      } catch (err) {
        console.error("🚨 Erro ao buscar saldo:", err);
        setError("Erro ao buscar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [cpf]);

  return { balanceCurrentValue, userName, loading, error };
}
