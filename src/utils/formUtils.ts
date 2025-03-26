import { unformatCpf } from "../utils/cpfUtils";
import { unformatWhatsapp } from "../utils/whatsappUtils";

export const handleCadastro = async (
  formData: any,
  callApi: any,
  navigate: any
) => {
  const cpfSemFormatacao = unformatCpf(formData.cpf);
  const whatsappSemFormatacao = unformatWhatsapp(formData.whatsapp);

  const idadePerfilMap: Record<string, number> = {
    "até 16": 1,
    "17 a 25": 2,
    "26 a 35": 3,
    "36 a 45": 4,
    "46+": 5
  };
  
  const registerData: any = {
    PersonName: formData.nome,
    Cpf: cpfSemFormatacao,
    Phone: `55${whatsappSemFormatacao}`,
    Mail: formData.email,
    HasAcceptedTerm: formData.lgpd,
    HasAccount: formData.correntista,
    Age: idadePerfilMap[formData.idadePerfil], 
    OrganizerId: parseInt(localStorage.getItem("OrganizerId") || ""),
    Gender: formData.sexo,
  };
  

  // Verifica se o valor do ExternalCode existe no localStorage
  const externalCode = localStorage.getItem("rfidValue");
  if (externalCode) {
    registerData.ExternalCode = externalCode; // Adiciona o ExternalCode se estiver presente
  }

  console.log("📤 Enviando dados para API:", registerData);
  localStorage.setItem("cpf", registerData.Cpf);
  
  const result = await callApi("/Person/Person", "POST", registerData);

  console.log("🔄 Resposta da API:", result);

  if (result !== null) {
    console.log("✅ Cadastro bem-sucedido!");
    navigate("/camera");
  } else {
    console.error("❌ Erro no cadastro.");
  }
};

