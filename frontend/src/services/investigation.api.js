import api from "./api";

export async function getInvestigations() {
  const response = await api.get("/investigations");
  return response.data;
}

export async function getInvestigation(id) {
  const response = await api.get(`/investigations/${id}`);
  return response.data;
}

export async function createInvestigation(transactionId) {
  const response = await api.post("/investigations", {
    transactionId,
  });

  return response.data;
}

export async function sendInvestigationMessage(
  investigationId,
  message
) {
  const response = await api.post(
    `/investigations/${investigationId}/chat`,
    {
      message,
    }
  );

  return response.data;
}

export async function getInvestigationMessages(
  investigationId
) {
  const response = await api.get(
    `/investigations/${investigationId}/chat`
  );

  return response.data;
}