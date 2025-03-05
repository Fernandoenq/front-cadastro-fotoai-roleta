import { unformatCpf } from "../utils/cpfUtils";
import { unformatWhatsapp } from "../utils/whatsappUtils";

export const handleCadastro = async (
  formData: any,
  callApi: any,
  navigate: any
) => {
  const cpfSemFormatacao = unformatCpf(formData.cpf);
  const whatsappSemFormatacao = unformatWhatsapp(formData.whatsapp);

  const registerData = {
    PersonName: formData.nome,
    Cpf: cpfSemFormatacao,
    Phone: `55${whatsappSemFormatacao}`,
    Mail: formData.email,
    HasAcceptedTerm: formData.lgpd,
    HasAccount: formData.correntista,
    ExternalCode: localStorage.getItem("rfidValue") || "",
    AgeProfileId: parseInt(formData.idadePerfil),
  };

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
